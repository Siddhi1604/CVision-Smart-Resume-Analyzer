// API endpoint for user analyses
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

  try {
    // Extract user ID from the URL path
    const userId = req.query.userId || 'default_user';

    // Mock user analyses data
    const analyses = [
      {
        id: 1,
        title: "Software Engineer Resume Analysis",
        score: 85,
        date: "2024-01-15",
        job_role: "Software Engineer",
        job_category: "Technology",
        strengths: ["Strong technical skills", "Good project experience"],
        weaknesses: ["Limited backend experience"],
        recommendations: ["Add more backend projects", "Include testing examples"]
      },
      {
        id: 2,
        title: "Frontend Developer Resume Analysis",
        score: 78,
        date: "2024-01-10",
        job_role: "Frontend Developer",
        job_category: "Technology",
        strengths: ["Excellent React skills", "Good UI/UX sense"],
        weaknesses: ["Missing TypeScript experience"],
        recommendations: ["Learn TypeScript", "Add more complex projects"]
      }
    ];

    res.status(200).json({ analyses });

  } catch (error) {
    console.error('Error fetching user analyses:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
