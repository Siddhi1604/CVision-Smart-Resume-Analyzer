const express = require('express');
const cors = require('cors');

const app = express();

// Adzuna API function
async function fetchAdzunaJobs(page, keyword, location, jobType, appId, apiKey) {
  const baseUrl = `https://api.adzuna.com/v1/api/jobs/${location}/search/${page + 1}`;
  
  const params = new URLSearchParams({
    app_id: appId,
    app_key: apiKey,
    results_per_page: 10,
    what: keyword || 'software engineer',
    'content-type': 'application/json'
  });
  
  // Add job type filter
  if (jobType && jobType !== 'full_time') {
    const jobTypeMap = {
      'internship': 'internship',
      'part_time': 'part_time', 
      'contract': 'contract',
      'full_time': 'full_time'
    };
    params.append('employment_type', jobTypeMap[jobType] || 'full_time');
  }
  
  if (location && location !== 'us') {
    params.append('where', location);
  }
  
  const response = await fetch(`${baseUrl}?${params}`);
  
  if (!response.ok) {
    throw new Error(`Adzuna API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  // Transform Adzuna response to match our frontend format
  const jobs = data.results.map((job, index) => ({
    id: job.id || (page * 10 + index + 1),
    title: job.title || 'Software Engineer',
    company: job.company?.display_name || 'Company',
    location: job.location?.display_name || 'Remote',
    salary: job.salary_min && job.salary_max 
      ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`
      : 'Salary not specified',
    job_type: jobType,
    description: job.description || 'Job description not available',
    landing_page: job.redirect_url || '#',
    created: job.created || new Date().toISOString()
  }));
  
  return {
    jobs,
    page_count: Math.ceil(data.count / 10),
    total_jobs: data.count,
    source: 'Adzuna API'
  };
}

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
  const categories = ['Technology'];
  res.json({ categories });
});

// Job roles endpoint
app.get('/job-roles', (req, res) => {
  const roles = {
    'Technology': {
      'Frontend Developer': {
        description: '',
        required_skills: [
          'javascript', 'typescript', 'react', 'next.js', 'html', 'css', 
          'tailwind', 'redux', 'testing-library', 'cypress', 'webpack', 
          'vite', 'accessibility', 'responsive design', 'git'
        ]
      },
      'Backend Developer': {
        description: '',
        required_skills: [
          'node.js', 'express', 'python', 'fastapi', 'java', 'spring', 
          'rest', 'graphql', 'sql', 'postgresql', 'mysql', 'nosql', 
          'mongodb', 'docker', 'kubernetes', 'aws', 'auth', 'jwt', 
          'caching', 'redis', 'message queues', 'git', 'testing'
        ]
      },
      'Software Engineer': {
        description: '',
        required_skills: [
          'data structures', 'algorithms', 'python', 'java', 'javascript', 
          'git', 'sql', 'rest', 'system design', 'docker', 'cloud', 
          'aws', 'testing', 'ci/cd', 'design patterns', 'linux'
        ]
      },
      'Data Scientist': {
        description: '',
        required_skills: [
          'python', 'pandas', 'numpy', 'scikit-learn', 'machine learning', 
          'statistics', 'sql', 'matplotlib', 'seaborn', 'feature engineering', 
          'model evaluation', 'notebooks', 'deployment', 'mlflow', 
          'tensorflow', 'pytorch', 'data visualization'
        ]
      }
    }
  };
  res.json(roles);
});

// Job search endpoint
app.get('/api/jobs', async (req, res) => {
  const { page = 0, keyword = 'software engineer', location = 'us', job_type = 'full_time' } = req.query;
  
  // Get Adzuna API credentials from environment
  const appId = process.env.ADZUNA_APP_ID;
  const apiKey = process.env.ADZUNA_API_KEY;
  
  // Try Adzuna API first if credentials are available
  if (appId && apiKey) {
    try {
      const adzunaResponse = await fetchAdzunaJobs(page, keyword, location, job_type, appId, apiKey);
      return res.json(adzunaResponse);
    } catch (error) {
      console.log('Adzuna API failed, falling back to mock data:', error.message);
      // Fall through to mock data
    }
  } else {
    console.log('Adzuna API credentials not found, using mock data');
  }
  
  // Mock job data (simplified version of the Python backend)
  const mockJobs = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      salary: '$120,000 - $150,000',
      job_type: 'full_time',
      description: 'We are looking for a senior software engineer to join our team...',
      landing_page: 'https://example.com/job/1',
      created: '2024-01-15T10:00:00Z'
    },
    {
      id: 2,
      title: 'Frontend Developer',
      company: 'StartupXYZ',
      location: 'Remote',
      salary: '$90,000 - $110,000',
      job_type: 'full_time',
      description: 'Join our frontend team to build amazing user experiences...',
      landing_page: 'https://example.com/job/2',
      created: '2024-01-14T15:30:00Z'
    },
    {
      id: 3,
      title: 'Backend Developer',
      company: 'DataFlow Systems',
      location: 'New York, NY',
      salary: '$100,000 - $130,000',
      job_type: 'full_time',
      description: 'Build scalable backend systems for our data platform...',
      landing_page: 'https://example.com/job/3',
      created: '2024-01-13T09:15:00Z'
    },
    {
      id: 4,
      title: 'Full Stack Developer',
      company: 'InnovateTech',
      location: 'Austin, TX',
      salary: '$95,000 - $125,000',
      job_type: 'full_time',
      description: 'Work on both frontend and backend development...',
      landing_page: 'https://example.com/job/4',
      created: '2024-01-12T14:45:00Z'
    },
    {
      id: 5,
      title: 'Data Scientist',
      company: 'Analytics Pro',
      location: 'Seattle, WA',
      salary: '$110,000 - $140,000',
      job_type: 'full_time',
      description: 'Apply machine learning and statistical analysis...',
      landing_page: 'https://example.com/job/5',
      created: '2024-01-11T11:20:00Z'
    }
  ];

  // Simple filtering based on keyword
  let filteredJobs = mockJobs;
  if (keyword && keyword !== 'software engineer') {
    filteredJobs = mockJobs.filter(job => 
      job.title.toLowerCase().includes(keyword.toLowerCase()) ||
      job.description.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  // Pagination
  const pageSize = 10;
  const startIndex = parseInt(page) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

  res.json({
    jobs: paginatedJobs,
    page_count: Math.ceil(filteredJobs.length / pageSize),
    total_jobs: filteredJobs.length,
    source: 'Mock Data'
  });
});

// Job details endpoint
app.get('/api/jobs/:jobId', (req, res) => {
  const { jobId } = req.params;
  // Return a mock job detail
  res.json({
    id: parseInt(jobId),
    title: 'Software Engineer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    salary: '$120,000 - $150,000',
    description: 'Full job description here...',
    how_to_apply: 'Please visit the company\'s careers page to apply for this position.',
    company_url: 'https://example.com/careers'
  });
});

// Placeholder endpoints for other functionality
app.post('/analyze-resume', (req, res) => {
  res.json({ message: 'Resume analysis endpoint - Node.js backend working' });
});

app.post('/ai-analyze-resume', (req, res) => {
  res.json({ message: 'AI resume analysis endpoint - Node.js backend working' });
});

app.post('/build-resume', (req, res) => {
  res.json({ message: 'Build resume endpoint - Node.js backend working' });
});

app.post('/send-feedback', (req, res) => {
  res.json({ message: 'Feedback endpoint - Node.js backend working' });
});

app.get('/user-analyses/:id', (req, res) => {
  res.json({ message: 'User analyses endpoint - Node.js backend working' });
});

app.get('/download-resume/:id', (req, res) => {
  res.json({ message: 'Download resume endpoint - Node.js backend working' });
});

app.get('/job-skills', (req, res) => {
  res.json({ message: 'Job skills endpoint - Node.js backend working' });
});

app.post('/store-analysis', (req, res) => {
  res.json({ message: 'Store analysis endpoint - Node.js backend working' });
});

app.post('/send-feedback', (req, res) => {
  res.json({ message: 'Feedback endpoint - Node.js backend working' });
});

app.post('/build-resume', (req, res) => {
  res.json({ message: 'Build resume endpoint - Node.js backend working' });
});

// Export for Vercel
module.exports = app;
