from fastapi import FastAPI, UploadFile, File, Form
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional, Set
import io
import json
import re
import os


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


def score_keyword_match(text: str, skills: List[str]):
    present = [s for s in skills if word_present(text, s)]
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

    return {
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


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/job-skills")
async def list_job_skills(category: str, role: str):
    skills = ROLES_DATASET.get(category, {}).get(role)
    if skills is None:
        raise HTTPException(status_code=404, detail="Category or role not found")
    return {"category": category, "role": role, "skills": skills}

