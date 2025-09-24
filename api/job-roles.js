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

  // Mock job roles data with proper structure
  const rolesData = {
    "Software Engineering": {
      "Frontend Developer": {
        "description": "Develop user-facing web applications using modern frameworks",
        "required_skills": ["JavaScript", "React", "CSS", "HTML", "TypeScript"]
      },
      "Backend Developer": {
        "description": "Build server-side applications and APIs",
        "required_skills": ["Python", "Node.js", "SQL", "REST APIs", "Docker"]
      },
      "Full Stack Developer": {
        "description": "Handle both frontend and backend development",
        "required_skills": ["JavaScript", "Python", "React", "Node.js", "SQL"]
      },
      "DevOps Engineer": {
        "description": "Manage infrastructure and deployment pipelines",
        "required_skills": ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux"]
      },
      "Mobile Developer": {
        "description": "Develop mobile applications for iOS and Android",
        "required_skills": ["React Native", "Swift", "Kotlin", "JavaScript", "iOS/Android"]
      }
    },
    "Data Science": {
      "Data Scientist": {
        "description": "Analyze complex data to extract insights",
        "required_skills": ["Python", "Machine Learning", "SQL", "Statistics", "Pandas"]
      },
      "Data Analyst": {
        "description": "Analyze data to help business decisions",
        "required_skills": ["SQL", "Excel", "Python", "Tableau", "Statistics"]
      },
      "Machine Learning Engineer": {
        "description": "Build and deploy ML models",
        "required_skills": ["Python", "TensorFlow", "PyTorch", "MLOps", "AWS"]
      }
    },
    "Product Management": {
      "Product Manager": {
        "description": "Define product strategy and roadmap",
        "required_skills": ["Product Strategy", "Analytics", "User Research", "Agile", "Leadership"]
      },
      "Product Owner": {
        "description": "Manage product backlog and requirements",
        "required_skills": ["Agile", "User Stories", "Stakeholder Management", "Analytics"]
      }
    },
    "Design": {
      "UI/UX Designer": {
        "description": "Design user interfaces and experiences",
        "required_skills": ["Figma", "Adobe Creative Suite", "User Research", "Prototyping", "Design Systems"]
      },
      "Graphic Designer": {
        "description": "Create visual designs and branding",
        "required_skills": ["Adobe Creative Suite", "Illustration", "Branding", "Typography", "Color Theory"]
      }
    },
    "Marketing": {
      "Digital Marketing Manager": {
        "description": "Manage online marketing campaigns",
        "required_skills": ["Google Ads", "Facebook Ads", "Analytics", "SEO", "Content Marketing"]
      },
      "Content Marketing Specialist": {
        "description": "Create and manage content strategy",
        "required_skills": ["Content Writing", "SEO", "Social Media", "Analytics", "CMS"]
      }
    }
  };

  res.status(200).json(rolesData);
}
