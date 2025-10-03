const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS for Vercel deployment
app.use(cors({
  origin: [
    'https://c-vision-smart-resume-analyzer-327s.vercel.app',
    'https://cvision-smart-resume-analyzer.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true
}));

app.use(express.json());

// Health endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is working!' });
});

// Job categories endpoint
app.get('/job-categories', (req, res) => {
  const categories = [
    'Engineering', 'Data Science', 'Product', 'Design', 
    'Marketing', 'Sales', 'Operations', 'Finance',
    'Human Resources', 'Customer Success', 'Quality Assurance'
  ];
  res.json({ categories });
});

// Job roles endpoint
app.get('/job-roles', (req, res) => {
  const roles = {
    'Engineering': ['Software Engineer', 'Backend Developer', 'Frontend Developer', 'Full Stack Developer'],
    'Data Science': ['Data Scientist', 'Data Analyst', 'ML Engineer', 'Data Engineer'],
    'Product': ['Product Manager', 'Product Owner', 'Product Designer']
  };
  res.json({ roles_by_category: roles });
});

// Placeholder endpoints for other functionality
app.post('/analyze-resume', (req, res) => {
  res.json({ message: 'Resume analysis endpoint - Node.js backend working' });
});

app.post('/ai-analyze-resume', (req, res) => {
  res.json({ message: 'AI resume analysis endpoint - Node.js backend working' });
});

app.get('/user-analyses/:id', (req, res) => {
  res.json({ message: 'User analyses endpoint - Node.js backend working' });
});

app.post('/send-feedback', (req, res) => {
  res.json({ message: 'Feedback endpoint - Node.js backend working' });
});

app.post('/build-resume', (req, res) => {
  res.json({ message: 'Build resume endpoint - Node.js backend working' });
});

// Export for Vercel
module.exports = app;
