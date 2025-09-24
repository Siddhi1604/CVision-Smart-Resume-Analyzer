// API endpoint for job roles
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Technology job roles only
  const rolesData = {
    "Technology": {
      "Software Engineer": {
        "description": "Develop software applications and systems",
        "required_skills": ["Programming", "Problem Solving", "Software Development", "Algorithms", "Data Structures"]
      },
      "Frontend Developer": {
        "description": "Develop user-facing web applications",
        "required_skills": ["JavaScript", "React", "CSS", "HTML", "TypeScript"]
      },
      "Backend Developer": {
        "description": "Build server-side applications and APIs",
        "required_skills": ["Python", "Node.js", "SQL", "REST APIs", "Database Design"]
      },
      "Full Stack Developer": {
        "description": "Handle both frontend and backend development",
        "required_skills": ["JavaScript", "Python", "React", "Node.js", "SQL"]
      },
      "DevOps Engineer": {
        "description": "Manage infrastructure and deployment pipelines",
        "required_skills": ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux"]
      },
      "Data Scientist": {
        "description": "Analyze complex data to extract insights",
        "required_skills": ["Python", "Machine Learning", "SQL", "Statistics", "Data Analysis"]
      },
      "Mobile Developer": {
        "description": "Develop mobile applications",
        "required_skills": ["React Native", "Swift", "Kotlin", "JavaScript", "Mobile Development"]
      },
      "UI/UX Designer": {
        "description": "Design user interfaces and experiences",
        "required_skills": ["Figma", "User Research", "Prototyping", "Design Systems", "Wireframing"]
      },
      "Product Manager": {
        "description": "Define product strategy and roadmap",
        "required_skills": ["Product Strategy", "Analytics", "User Research", "Agile", "Leadership"]
      },
      "QA Engineer": {
        "description": "Test software applications for quality assurance",
        "required_skills": ["Testing", "Automation", "Selenium", "Bug Tracking", "Quality Assurance"]
      }
    }
  };

  res.status(200).json(rolesData);
}
