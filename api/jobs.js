// Simple test API endpoint
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Simple test response
  const testResponse = {
    message: "API is working!",
    timestamp: new Date().toISOString(),
    method: req.method,
    query: req.query
  };

  res.status(200).json(testResponse);
}
