// API endpoint for AI resume analysis
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
    // Mock AI analysis response
    const analysis = {
      "overall_score": 92,
      "strengths": [
        "Excellent technical skills in React and JavaScript",
        "Strong project portfolio with modern web technologies",
        "Good understanding of software development best practices",
        "Clear communication and problem-solving abilities"
      ],
      "weaknesses": [
        "Limited experience with backend technologies",
        "Could benefit from more testing and DevOps experience",
        "Missing some industry-specific certifications"
      ],
      "recommendations": [
        "Add more backend projects to your portfolio (Node.js, Python)",
        "Include unit testing examples in your projects",
        "Consider getting AWS or other cloud certifications",
        "Highlight any leadership or team collaboration experience",
        "Add more detailed project descriptions with technologies used"
      ],
      "skills_match": {
        "matched_skills": ["JavaScript", "React", "CSS", "HTML", "Git"],
        "missing_skills": ["Node.js", "SQL", "Docker", "Testing", "AWS"],
        "match_percentage": 75
      },
      "analysis_type": "ai",
      "ai_insights": [
        "Your resume shows strong frontend development skills",
        "Consider adding more full-stack projects to increase marketability",
        "Your project descriptions could be more detailed with specific technologies",
        "Strong foundation for junior to mid-level positions"
      ]
    };

    res.status(200).json(analysis);

  } catch (error) {
    console.error('Error in AI resume analysis:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
