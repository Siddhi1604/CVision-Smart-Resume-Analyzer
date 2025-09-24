// API endpoint for sending feedback
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
    const { name, email, subject, message, rating } = req.body;

    // Mock feedback processing
    console.log('Feedback received:', { name, email, subject, message, rating });

    // In a real implementation, you would:
    // 1. Save feedback to database
    // 2. Send email notification
    // 3. Process the feedback

    res.status(200).json({
      status: 'success',
      message: 'Feedback received successfully',
      feedbackId: `FB-${Date.now()}`
    });

  } catch (error) {
    console.error('Error processing feedback:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
