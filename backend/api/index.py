import json
import os
import re
import uuid
from datetime import datetime
from pathlib import Path

# Set environment variables for Vercel deployment
os.environ["VERCEL"] = "1"

# In-memory storage for resume analyses
resume_analyses_storage = []

# Job roles dataset
job_roles_dataset = {
    "Technology": {
        "Frontend Developer": [
            "javascript", "typescript", "react", "next.js", "html", "css", 
            "tailwind", "redux", "testing-library", "cypress", "webpack", 
            "vite", "accessibility", "responsive design", "git"
        ],
        "Backend Developer": [
            "node.js", "express", "python", "fastapi", "java", "spring", 
            "rest", "graphql", "sql", "postgresql", "mysql", "nosql", 
            "mongodb", "docker", "kubernetes", "aws", "auth", "jwt", 
            "caching", "redis", "message queues", "git", "testing"
        ],
        "Software Engineer": [
            "data structures", "algorithms", "python", "java", "javascript", 
            "git", "sql", "rest", "system design", "docker", "cloud", 
            "aws", "testing", "ci/cd", "design patterns", "linux"
        ],
        "Data Scientist": [
            "python", "pandas", "numpy", "scikit-learn", "machine learning", 
            "statistics", "sql", "matplotlib", "seaborn", "feature engineering", 
            "model evaluation", "notebooks", "deployment", "mlflow", 
            "tensorflow", "pytorch", "data visualization"
        ]
    }
}

def analyze_resume(resume_text, job_category, job_role):
    """Analyze resume text and return analysis results"""
    skills = job_roles_dataset.get(job_category, {}).get(job_role, [])
    
    # Simple keyword matching
    resume_lower = resume_text.lower()
    matched_skills = [skill for skill in skills if skill.lower() in resume_lower]
    
    keyword_match_score = round((len(matched_skills) / max(1, len(skills))) * 100) if skills else 0
    
    # Simple format scoring
    word_count = len(resume_text.split())
    format_score = 100
    if word_count < 250:
        format_score -= 20
    if word_count > 3000:
        format_score -= 15
    if '•' not in resume_text and '-' not in resume_text:
        format_score -= 10
    
    # Simple section scoring
    sections = ['summary', 'experience', 'education', 'skills']
    found_sections = [section for section in sections if section in resume_lower]
    section_score = round((len(found_sections) / len(sections)) * 100)
    
    # Calculate ATS score
    ats_score = round(0.5 * keyword_match_score + 0.25 * section_score + 0.25 * format_score)
    
    # Generate suggestions
    suggestions = []
    if len(matched_skills) < len(skills):
        missing_skills = [skill for skill in skills if skill not in matched_skills]
        suggestions.append(f"Include relevant skills: {', '.join(missing_skills[:5])}")
    if keyword_match_score < 70:
        suggestions.append("Add more role-specific keywords across Skills and Experience sections.")
    if section_score < 70:
        suggestions.append("Ensure key sections like Summary, Skills, Experience, and Education are present.")
    if format_score < 80:
        suggestions.append("Use bullet points and ensure the document text is selectable.")
    
    return {
        "ats_score": ats_score,
        "keyword_match": {"score": keyword_match_score},
        "missing_skills": [skill for skill in skills if skill not in matched_skills],
        "format_score": format_score,
        "section_score": section_score,
        "suggestions": suggestions,
        "jd_match_score": None,
        "contact": {
            "has_email": bool(re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', resume_text)),
            "has_phone": bool(re.search(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', resume_text)),
            "has_linkedin": "linkedin" in resume_lower,
            "has_github": "github" in resume_lower
        },
        "metrics": {
            "word_count": word_count,
            "reading_time_minutes": max(1, round(word_count / 200))
        }
    }

# Vercel handler function
def handler(event, context):
    """
    Vercel serverless function handler
    """
    try:
        # Extract path and method from event
        path = event.get('path', '/')
        method = event.get('httpMethod', 'GET')
        body = event.get('body', '')
        
        # Handle specific endpoints
        if path == "/health":
            return {
                "statusCode": 200,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps({
                    "status": "ok", 
                    "message": "Python backend is working!",
                    "timestamp": datetime.now().isoformat(),
                    "analysesCount": len(resume_analyses_storage)
                })
            }
        
        elif path == "/job-categories":
            categories = [
                "Technology", "Data Science", "Product", "Design", 
                "Marketing", "Sales", "Operations", "Finance",
                "Human Resources", "Customer Success", "Quality Assurance"
            ]
            return {
                "statusCode": 200,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps({"categories": categories})
            }
        
        elif path == "/job-roles":
            roles = {
                "Technology": {
                    "Frontend Developer": {
                        "description": "Develop user-facing web applications and interfaces",
                        "required_skills": [
                            "javascript", "typescript", "react", "next.js", "html", "css", 
                            "tailwind", "redux", "testing-library", "cypress", "webpack", 
                            "vite", "accessibility", "responsive design", "git"
                        ]
                    },
                    "Backend Developer": {
                        "description": "Build server-side applications and APIs",
                        "required_skills": [
                            "node.js", "express", "python", "fastapi", "java", "spring", 
                            "rest", "graphql", "sql", "postgresql", "mysql", "nosql", 
                            "mongodb", "docker", "kubernetes", "aws", "auth", "jwt", 
                            "caching", "redis", "message queues", "git", "testing"
                        ]
                    },
                    "Software Engineer": {
                        "description": "Design and develop software applications and systems",
                        "required_skills": [
                            "data structures", "algorithms", "python", "java", "javascript", 
                            "git", "sql", "rest", "system design", "docker", "cloud", 
                            "aws", "testing", "ci/cd", "design patterns", "linux"
                        ]
                    },
                    "Data Scientist": {
                        "description": "Analyze complex data to extract insights and build models",
                        "required_skills": [
                            "python", "pandas", "numpy", "scikit-learn", "machine learning", 
                            "statistics", "sql", "matplotlib", "seaborn", "feature engineering", 
                            "model evaluation", "notebooks", "deployment", "mlflow", 
                            "tensorflow", "pytorch", "data visualization"
                        ]
                    }
                }
            }
            return {
                "statusCode": 200,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps(roles)
            }
        
        elif path.startswith("/user-analyses/"):
            # Extract user ID from path
            user_id = path.split("/")[-1]
            user_analyses = [analysis for analysis in resume_analyses_storage if analysis["user_id"] == user_id]
            
            # Sort by created_at date (newest first)
            user_analyses.sort(key=lambda x: x["created_at"], reverse=True)
            
            return {
                "statusCode": 200,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps({"analyses": user_analyses})
            }
        
        elif path in ["/analyze-resume", "/ai-analyze-resume"]:
            # Parse request body
            try:
                request_data = json.loads(body) if body else {}
                job_category = request_data.get('job_category')
                job_role = request_data.get('job_role')
                user_id = request_data.get('user_id', 'default_user')
                
                if not job_category or not job_role:
                    return {
                        "statusCode": 400,
                        "headers": {"Content-Type": "application/json"},
                        "body": json.dumps({"error": "Job category and role are required"})
                    }
                
                # Mock resume text for analysis
                mock_resume_text = """
                John Doe
                Software Engineer
                
                Summary:
                Experienced software engineer with 5+ years of experience in web development.
                
                Skills:
                JavaScript, Python, React, Node.js, SQL
                
                Experience:
                • Developed web applications using React and Node.js
                • Worked with databases and APIs
                • Collaborated with cross-functional teams
                
                Education:
                Bachelor's in Computer Science
                """
                
                # Perform analysis
                analysis = analyze_resume(mock_resume_text, job_category, job_role)
                
                # Store the analysis
                analysis_data = {
                    "id": str(uuid.uuid4()),
                    "user_id": user_id,
                    "resume_name": "Sample Resume",
                    "job_category": job_category,
                    "job_role": job_role,
                    "analysis_type": "ai" if path == "/ai-analyze-resume" else "standard",
                    "analysis_result": analysis,
                    "created_at": datetime.now().isoformat(),
                    "file_name": None,
                    "file_path": None,
                    "file_mime": None
                }
                
                resume_analyses_storage.append(analysis_data)
                
                return {
                    "statusCode": 200,
                    "headers": {"Content-Type": "application/json"},
                    "body": json.dumps(analysis)
                }
                
            except json.JSONDecodeError:
                return {
                    "statusCode": 400,
                    "headers": {"Content-Type": "application/json"},
                    "body": json.dumps({"error": "Invalid JSON in request body"})
                }
            except Exception as e:
                return {
                    "statusCode": 500,
                    "headers": {"Content-Type": "application/json"},
                    "body": json.dumps({"error": str(e)})
                }
        
        else:
            # Default response
            return {
                "statusCode": 200,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps({
                    "message": f"Python backend endpoint {path} is working",
                    "method": method,
                    "info": "Using Python backend"
                })
            }
        
    except Exception as e:
        print(f"Handler error: {str(e)}")
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": str(e)})
        }