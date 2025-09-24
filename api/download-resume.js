// API endpoint for downloading resume
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
    // Extract resume ID from the URL path
    const resumeId = req.query.resumeId || '1';

    // Mock resume content
    const mockResumeContent = `
# John Doe
## Software Engineer

### Contact Information
- Email: john.doe@email.com
- Phone: (555) 123-4567
- LinkedIn: linkedin.com/in/johndoe

### Professional Summary
Experienced software engineer with 5+ years of experience in full-stack development...

### Skills
- JavaScript, React, Node.js
- Python, SQL
- AWS, Docker

### Experience
**Senior Software Engineer** - Tech Corp (2020-Present)
- Developed and maintained web applications
- Led team of 3 developers
- Implemented CI/CD pipelines

### Education
**Bachelor of Computer Science** - University of Technology (2018)
`;

    // Set headers for file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="resume_${resumeId}.pdf"`);
    
    // For now, return a simple text response
    // In production, you'd generate an actual PDF
    res.status(200).send(mockResumeContent);

  } catch (error) {
    console.error('Error downloading resume:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
