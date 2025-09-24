// API endpoint for resume analysis
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Mock analysis response
    const analysis = {
      "overall_score": 85,
      "strengths": [
        "Strong technical skills in React and JavaScript",
        "Good project experience with web development",
        "Clear communication skills"
      ],
      "weaknesses": [
        "Limited experience with backend technologies",
        "Could benefit from more testing experience",
        "Missing some industry-specific certifications"
      ],
      "recommendations": [
        "Add more backend projects to your portfolio",
        "Include unit testing examples in your projects",
        "Consider getting AWS or other cloud certifications",
        "Highlight any leadership or team collaboration experience"
      ],
      "skills_match": {
        "matched_skills": ["JavaScript", "React", "CSS", "HTML"],
        "missing_skills": ["Node.js", "SQL", "Docker", "Testing"],
        "match_percentage": 60
      },
      "analysis_type": req.body.analysisType || "standard"
    };

    res.status(200).json(analysis);

  } catch (error) {
    console.error('Error in resume analysis:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
