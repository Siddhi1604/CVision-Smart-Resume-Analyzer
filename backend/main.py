from fastapi import FastAPI, UploadFile, File, Form
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional, Set, Tuple
import io
import json
import re
import os
from openai import OpenAI


app = FastAPI(title="CVision Standard Analyzer", version="0.1.0")

# CORS - allow frontend dev server by default
allowed_origins_env = os.environ.get("BACKEND_ALLOWED_ORIGINS", "*")
allowed_origins = (
    [o.strip() for o in allowed_origins_env.split(",") if o.strip()]
    if allowed_origins_env != "*"
    else ["*"]
)
allow_credentials = allowed_origins != ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OpenAI client for AI analysis
openai_client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="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",
    default_headers={
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "CVision Resume Analyzer",
    }
)

# Simple in-memory storage for resume analyses (in production, use a database)
resume_analyses_storage = []

class ResumeAnalysis(BaseModel):
    id: Optional[str] = None
    user_id: str
    resume_name: str
    job_category: str
    job_role: str
    analysis_type: str  # 'standard' or 'ai'
    analysis_result: Dict
    created_at: Optional[str] = None
    file_name: Optional[str] = None


def _load_roles_dataset() -> Dict[str, Dict[str, List[str]]]:
    try:
        # Resolve path whether run from repo root or backend directory
        repo_root = os.path.dirname(os.path.abspath(__file__))
        roles_path = os.path.join(repo_root, "roles.json")
        with open(roles_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}


ROLES_DATASET = _load_roles_dataset()


@app.get("/job-categories")
async def list_job_categories():
    return {"categories": sorted(list(ROLES_DATASET.keys()))}


@app.get("/job-roles")
async def list_job_roles(category: Optional[str] = None):
    if not category:
        # Return nested structure compatible with frontend fallback shape
        # { category: { role: { description: str, required_skills: [str] } } }
        nested: Dict[str, Dict[str, Dict[str, List[str]]]] = {}
        for cat, roles in ROLES_DATASET.items():
            nested[cat] = {}
            for role, skills in roles.items():
                nested[cat][role] = {
                    "description": "",
                    "required_skills": skills,
                }
        return nested
    roles = ROLES_DATASET.get(category, {})
    return {"category": category, "roles": sorted(list(roles.keys()))}


def extract_text_from_upload(file: UploadFile) -> str:
    data = file.file.read()
    # Reset pointer so other functions can re-read if needed
    try:
        file.file.seek(0)
    except Exception:
        pass

    filename = (file.filename or "").lower()
    if filename.endswith(".pdf"):
        try:
            from pdfminer.high_level import extract_text as pdf_text

            return pdf_text(io.BytesIO(data)) or ""
        except Exception:
            return ""
    if filename.endswith(".docx"):
        try:
            import docx  # python-docx

            doc = docx.Document(io.BytesIO(data))
            return "\n".join([p.text for p in doc.paragraphs])
        except Exception:
            return ""
    # Fallback plain text
    try:
        return data.decode("utf-8", errors="ignore")
    except Exception:
        return ""


def word_present(text: str, term: str) -> bool:
    return re.search(rf"\b{re.escape(term)}\b", text, flags=re.I) is not None


def normalize_text(text: str) -> str:
    lowered = text.lower()
    # Replace punctuation and slashes with spaces while preserving tokens like c++ -> c++
    cleaned = re.sub(r"[^a-z0-9+#./-]", " ", lowered)
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    return cleaned


def tokenize(text: str) -> Tuple[List[str], List[str]]:
    tokens = re.findall(r"[a-z0-9+.#-]+", text.lower())
    bigrams = [f"{tokens[i]} {tokens[i+1]}" for i in range(len(tokens)-1)] if len(tokens) > 1 else []
    return tokens, bigrams


ALIASES: Dict[str, List[str]] = {
    # Languages / Core
    "javascript": ["js", "nodejs", "node.js", "vanilla js", "ecmascript"],
    "typescript": ["ts"],
    "python": ["py"],
    "java": [],
    "sql": ["postgres", "postgresql", "mysql", "sqlite"],
    "nosql": ["mongodb", "dynamo", "dynamodb", "cassandra"],
    "html": ["html5"],
    "css": ["css3", "scss", "sass", "tailwind", "bootstrap"],

    # Frameworks / Libraries
    "react": ["reactjs", "react.js", "next", "nextjs", "next.js"],
    "next.js": ["next", "nextjs"],
    "redux": ["redux toolkit", "rtk"],
    "testing-library": ["react testing library"],
    "cypress": ["e2e", "end to end testing"],
    "webpack": [],
    "vite": [],
    "express": ["expressjs", "express.js"],
    "fastapi": [],
    "spring": ["spring boot", "springboot"],
    "graphql": [],

    # Infra / DevOps
    "docker": [],
    "kubernetes": ["k8s"],
    "aws": ["amazon web services", "ec2", "s3", "lambda", "rds"],
    "ci/cd": ["cicd", "continuous integration", "continuous delivery", "github actions", "gitlab ci"],
    "git": ["github", "gitlab", "bitbucket"],
    "redis": [],
    "caching": ["cache"],

    # Concepts
    "rest": ["restful", "rest api", "apis"],
    "system design": ["architecture", "scalability"],
    "design patterns": ["patterns"],
    "algorithms": ["algo"],
    "data structures": ["ds"],
    "machine learning": ["ml", "mlops"],
    "model evaluation": ["evaluation", "metrics"],
    "feature engineering": ["features"],
}


def tokens_contain(tokens: List[str], target: str) -> bool:
    t = target.lower()
    if t in tokens:
        return True
    # Accept token variants with punctuation removed
    t_compact = re.sub(r"[^a-z0-9]+", "", t)
    for tok in tokens:
        if tok == t:
            return True
        if re.sub(r"[^a-z0-9]+", "", tok) == t_compact:
            return True
    return False


def fuzzy_similar(a: str, b: str, threshold: float = 0.9) -> bool:
    from difflib import SequenceMatcher
    return SequenceMatcher(None, a.lower(), b.lower()).ratio() >= threshold


def match_skill(resume_tokens: List[str], resume_bigrams: List[str], skill: str) -> bool:
    candidates = [skill] + ALIASES.get(skill.lower(), [])
    # Exact token or bigram match
    for c in candidates:
        if tokens_contain(resume_tokens, c) or tokens_contain(resume_bigrams, c):
            return True
    # Substring within tokens (e.g., "typescript" in "ts/tsx/typescript")
    for c in candidates:
        c_compact = re.sub(r"[^a-z0-9]+", "", c.lower())
        for tok in resume_tokens + resume_bigrams:
            tok_compact = re.sub(r"[^a-z0-9]+", "", tok.lower())
            if c_compact and tok_compact and c_compact in tok_compact:
                return True
            if fuzzy_similar(tok_compact, c_compact, threshold=0.92) and len(c_compact) >= 4:
                return True
    return False


def score_keyword_match(text: str, skills: List[str]):
    normalized = normalize_text(text)
    tokens, bigrams = tokenize(normalized)
    present = []
    for s in skills:
        if match_skill(tokens, bigrams, s):
            present.append(s)
    missing = [s for s in skills if s not in present]
    score = round((len(present) / max(1, len(skills))) * 100)
    return score, missing


def score_sections(text: str) -> int:
    sections = [
        "summary",
        "objective",
        "skills",
        "experience",
        "employment",
        "education",
        "projects",
        "certifications",
        "contact",
    ]
    found = sum(1 for s in sections if word_present(text, s))
    return round((found / len(sections)) * 100)


def get_present_sections(text: str) -> List[str]:
    """Return list of section names detected in the resume text."""
    sections = [
        "summary",
        "objective",
        "skills",
        "experience",
        "employment",
        "education",
        "projects",
        "certifications",
        "contact",
    ]
    present = [s for s in sections if word_present(text, s)]
    return present


def score_format(text: str, raw_len: int) -> int:
    score = 100
    words = len(re.findall(r"\w+", text))
    if words < 250:
        score -= 20
    if words > 3000:
        score -= 15
    if "•" not in text and "-" not in text:
        score -= 10
    if text.strip() == "" or (raw_len > 0 and len(text) < 50):
        score -= 40
    return max(0, min(100, score))


class AnalyzeResponse(BaseModel):
    ats_score: int
    keyword_match: Dict[str, int]
    missing_skills: List[str]
    format_score: int
    section_score: int
    suggestions: List[str]
    jd_match_score: Optional[int] = None
    contact: Dict[str, bool]
    metrics: Dict[str, int]


@app.post("/analyze-resume", response_model=AnalyzeResponse)
async def analyze_resume(
    file: Optional[UploadFile] = File(None),
    job_category: str = Form(...),
    job_role: str = Form(...),
    custom_job_description: Optional[str] = Form(None),
    text: Optional[str] = Form(None),
):
    if not file and not text:
        raise HTTPException(status_code=400, detail="Provide either a file or text")

    raw = b""
    if file:
        raw = file.file.read()
        try:
            file.file.seek(0)
        except Exception:
            pass

    resume_text = (text or "").strip() or (extract_text_from_upload(file) if file else "")

    skills = ROLES_DATASET.get(job_category, {}).get(job_role, [])
    km_score, missing = score_keyword_match(resume_text, skills)
    sec_score = score_sections(resume_text)
    fmt_score = score_format(resume_text, len(raw))
    ats = round(0.5 * km_score + 0.25 * sec_score + 0.25 * fmt_score)

    suggestions: List[str] = []
    if missing:
        suggestions.append(
            "Include relevant skills if applicable: " + ", ".join(missing[:8]) + "."
        )
    if km_score < 70:
        suggestions.append(
            "Add more role-specific keywords across Skills and Experience sections."
        )
    if sec_score < 70:
        suggestions.append(
            "Ensure key sections like Summary, Skills, Experience, and Education are present and clearly labeled."
        )
    if fmt_score < 80:
        suggestions.append(
            "Use bullet points and ensure the document text is selectable (avoid image-only PDFs)."
        )
    if custom_job_description:
        suggestions.append(
            "Tailor quantified achievements to the provided job description."
        )

    # Contact info checks
    contact = {
        "has_email": bool(re.search(r"[\w.+'-]+@[\w.-]+\.[A-Za-z]{2,}", resume_text)),
        "has_phone": bool(re.search(r"(\+?\d[\s-]?){7,}\d", resume_text)),
        "has_linkedin": "linkedin.com" in resume_text.lower(),
        "has_github": "github.com" in resume_text.lower(),
    }
    if not contact["has_email"]:
        suggestions.append("Add a professional email address in the header.")
    if not contact["has_phone"]:
        suggestions.append("Include a reachable phone number.")
    if not (contact["has_linkedin"] or contact["has_github"]):
        suggestions.append("Add a LinkedIn or GitHub link if relevant.")

    # JD match score (lightweight)
    jd_match_score: Optional[int] = None
    if custom_job_description:
        def tokenize(s: str) -> Set[str]:
            tokens = re.findall(r"[A-Za-z][A-Za-z0-9+.#-]{1,}", s.lower())
            stop = {
                "and","or","the","a","an","to","for","with","of","in","on","by","at","from","as","is","are","be","this","that","these","those","you","we","they","it","your","our"}
            return {t for t in tokens if len(t) > 2 and t not in stop}

        jd_tokens = tokenize(custom_job_description)
        res_tokens = tokenize(resume_text)
        if jd_tokens:
            overlap = len(jd_tokens & res_tokens)
            jd_match_score = round((overlap / len(jd_tokens)) * 100)
            if jd_match_score < 50:
                suggestions.append("Mirror the language of the job description where appropriate.")

    # Metrics
    word_count = len(re.findall(r"\w+", resume_text))
    reading_time_minutes = max(1, round(word_count / 200))

    result = {
        "ats_score": ats,
        "keyword_match": {"score": km_score},
        "missing_skills": missing,
        "format_score": fmt_score,
        "section_score": sec_score,
        "suggestions": suggestions,
        "jd_match_score": jd_match_score,
        "contact": contact,
        "metrics": {"word_count": word_count, "reading_time_minutes": reading_time_minutes},
    }
    
    # Store the analysis for dashboard
    try:
        import uuid
        from datetime import datetime
        
        analysis_data = {
            "id": str(uuid.uuid4()),
            "user_id": "default_user",  # In a real app, get from auth context
            "resume_name": file.filename if file else "Text Resume",
            "job_category": job_category,
            "job_role": job_role,
            "analysis_type": "standard",
            "analysis_result": result,
            "created_at": datetime.now().isoformat(),
            "file_name": file.filename if file else None
        }
        resume_analyses_storage.append(analysis_data)
    except Exception as e:
        print(f"Failed to store analysis: {e}")
    
    return result


@app.post("/ai-analyze-resume", response_model=AnalyzeResponse)
async def ai_analyze_resume(
    file: Optional[UploadFile] = File(None),
    job_category: str = Form(...),
    job_role: str = Form(...),
    custom_job_description: Optional[str] = Form(None),
    text: Optional[str] = Form(None),
):
    if not file and not text:
        raise HTTPException(status_code=400, detail="Provide either a file or text")

    raw = b""
    if file:
        raw = file.file.read()
        try:
            file.file.seek(0)
        except Exception:
            pass

    resume_text = (text or "").strip() or (extract_text_from_upload(file) if file else "")
    
    if not resume_text.strip():
        raise HTTPException(status_code=400, detail="No text could be extracted from the provided file")

    # Get role skills for context
    skills = ROLES_DATASET.get(job_category, {}).get(job_role, [])
    present_sections = get_present_sections(resume_text)
    
    # Build the AI prompt (broader, avoids redundant suggestions)
    prompt = f"""You are an expert resume analyst and career coach.
Analyze the following resume for a {job_role} position within {job_category}.
Read the entire resume holistically (not only the skills list). Infer synonyms and equivalents.
Only suggest adding sections or items if they are genuinely missing. The following sections were detected: {present_sections}.
Avoid recommending items already present (e.g., certifications, experience) unless the improvement is about quality/clarity.
Consider both technical and non-technical aspects: impact, outcomes, leadership, collaboration, communication, quantification, clarity, readability, formatting consistency, and relevance.
Tailor feedback to the target role and the provided job description if present.

Resume Text (trimmed):
{resume_text[:3000]}

Target Role: {job_role}
Target Category: {job_category}
Required Skills: {', '.join(skills)}
{f'Job Description: {custom_job_description}' if custom_job_description else ''}

Return ONLY valid JSON in this schema:
{{
  "ats_score": 0-100,
  "keyword_match": {{"score": 0-100}},
  "missing_skills": ["..."],
  "format_score": 0-100,
  "section_score": 0-100,
  "suggestions": ["Concrete, deduplicated, non-generic improvements that do not ask to add things already present"],
  "jd_match_score": 0-100 or null,
  "contact": {{"has_email": bool, "has_phone": bool, "has_linkedin": bool, "has_github": bool}},
  "metrics": {{"word_count": number, "reading_time_minutes": number}}
}}
"""

    try:
        completion = openai_client.chat.completions.create(
            model="openai/gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=1500,
        )
        ai_response = completion.choices[0].message.content.strip()
        # Try to parse the JSON response
        try:
            if ai_response.startswith("```json"):
                ai_response = ai_response[7:]
            if ai_response.endswith("```"):
                ai_response = ai_response[:-3]
            analysis_data = json.loads(ai_response)
            result = {
                "ats_score": analysis_data.get("ats_score", 0),
                "keyword_match": analysis_data.get("keyword_match", {"score": 0}),
                "missing_skills": analysis_data.get("missing_skills", []),
                "format_score": analysis_data.get("format_score", 0),
                "section_score": analysis_data.get("section_score", 0),
                "suggestions": analysis_data.get("suggestions", []),
                "jd_match_score": analysis_data.get("jd_match_score"),
                "contact": analysis_data.get("contact", {"has_email": False, "has_phone": False, "has_linkedin": False, "has_github": False}),
                "metrics": analysis_data.get("metrics", {"word_count": len(re.findall(r"\\w+", resume_text)), "reading_time_minutes": max(1, round(len(re.findall(r"\\w+", resume_text)) / 200))}),
            }
            
            # Store the analysis for dashboard
            try:
                import uuid
                from datetime import datetime
                
                analysis_data = {
                    "id": str(uuid.uuid4()),
                    "user_id": "default_user",  # In a real app, get from auth context
                    "resume_name": file.filename if file else "Text Resume",
                    "job_category": job_category,
                    "job_role": job_role,
                    "analysis_type": "ai",
                    "analysis_result": result,
                    "created_at": datetime.now().isoformat(),
                    "file_name": file.filename if file else None
                }
                resume_analyses_storage.append(analysis_data)
            except Exception as e:
                print(f"Failed to store AI analysis: {e}")
            
            return result
        except json.JSONDecodeError as e:
            print(f"AI response parsing failed: {e}")
            print(f"AI response: {ai_response}")
            raise HTTPException(status_code=500, detail="AI analysis failed - using standard analysis")
    except Exception as e:
        print(f"OpenAI API error: {e}")
        raise HTTPException(status_code=500, detail="AI analysis service unavailable")


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/job-skills")
async def list_job_skills(category: str, role: str):
    skills = ROLES_DATASET.get(category, {}).get(role)
    if skills is None:
        raise HTTPException(status_code=404, detail="Category or role not found")
    return {"category": category, "role": role, "skills": skills}


@app.post("/store-analysis")
async def store_analysis(analysis: ResumeAnalysis):
    import uuid
    from datetime import datetime
    
    analysis.id = str(uuid.uuid4())
    analysis.created_at = datetime.now().isoformat()
    
    resume_analyses_storage.append(analysis.dict())
    return {"id": analysis.id, "message": "Analysis stored successfully"}


@app.get("/user-analyses/{user_id}")
async def get_user_analyses(user_id: str):
    user_analyses = [a for a in resume_analyses_storage if a["user_id"] == user_id]
    return {"analyses": user_analyses}

