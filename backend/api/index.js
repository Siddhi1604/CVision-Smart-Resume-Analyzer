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
  console.log('Health endpoint called');
  res.json({ 
    status: 'ok', 
    message: 'Backend is working!',
    timestamp: new Date().toISOString(),
    analysesCount: resumeAnalysesStorage.length
  });
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
        description: 'Develop user-facing web applications and interfaces',
        required_skills: [
          'javascript', 'typescript', 'react', 'next.js', 'html', 'css', 
          'tailwind', 'redux', 'testing-library', 'cypress', 'webpack', 
          'vite', 'accessibility', 'responsive design', 'git'
        ]
      },
      'Backend Developer': {
        description: 'Build server-side applications and APIs',
        required_skills: [
          'node.js', 'express', 'python', 'fastapi', 'java', 'spring', 
          'rest', 'graphql', 'sql', 'postgresql', 'mysql', 'nosql', 
          'mongodb', 'docker', 'kubernetes', 'aws', 'auth', 'jwt', 
          'caching', 'redis', 'message queues', 'git', 'testing'
        ]
      },
      'Software Engineer': {
        description: 'Design and develop software applications and systems',
        required_skills: [
          'data structures', 'algorithms', 'python', 'java', 'javascript', 
          'git', 'sql', 'rest', 'system design', 'docker', 'cloud', 
          'aws', 'testing', 'ci/cd', 'design patterns', 'linux'
        ]
      },
      'Data Scientist': {
        description: 'Analyze complex data to extract insights and build models',
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

// In-memory storage for resume analyses (in production, use a database)
let resumeAnalysesStorage = [];

// Load existing analyses from file if available
const fs = require('fs');
const path = require('path');

try {
  const analysesPath = path.join(__dirname, '../storage/analyses.json');
  if (fs.existsSync(analysesPath)) {
    const data = fs.readFileSync(analysesPath, 'utf8');
    resumeAnalysesStorage = JSON.parse(data);
    console.log(`Loaded ${resumeAnalysesStorage.length} existing analyses`);
  }
} catch (error) {
  console.log('Could not load existing analyses:', error.message);
  resumeAnalysesStorage = [];
}

// Save analyses to file
function saveAnalysesToFile() {
  try {
    const analysesPath = path.join(__dirname, '../storage/analyses.json');
    const storageDir = path.dirname(analysesPath);
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }
    fs.writeFileSync(analysesPath, JSON.stringify(resumeAnalysesStorage, null, 2));
  } catch (error) {
    console.log('Could not save analyses:', error.message);
  }
}

// Job roles dataset
const jobRolesDataset = {
  "Technology": {
    "Frontend Developer": [
      "javascript", "typescript", "react", "next.js", "html", "css", 
      "tailwind", "redux", "testing-library", "cypress", "webpack", 
      "vite", "accessibility", "responsive design", "git"
    ],
    "Backend Developer": [
      "node.js", "express", "python", "fastapi", "java", "spring", 
      "rest", "graphql", "sql", "postgresql", "mysql", "nosql", 
      "mongodb", "docker", "kubernetes", "aws", "auth", "jwt", 
      "caching", "redis", "message queues", "git", "testing"
    ],
    "Software Engineer": [
      "data structures", "algorithms", "python", "java", "javascript", 
      "git", "sql", "rest", "system design", "docker", "cloud", 
      "aws", "testing", "ci/cd", "design patterns", "linux"
    ],
    "Data Scientist": [
      "python", "pandas", "numpy", "scikit-learn", "machine learning", 
      "statistics", "sql", "matplotlib", "seaborn", "feature engineering", 
      "model evaluation", "notebooks", "deployment", "mlflow", 
      "tensorflow", "pytorch", "data visualization"
    ]
  }
};

// Simple resume analysis function
function analyzeResume(resumeText, jobCategory, jobRole) {
  const skills = jobRolesDataset[jobCategory]?.[jobRole] || [];
  
  // Simple keyword matching
  const resumeLower = resumeText.toLowerCase();
  const matchedSkills = skills.filter(skill => 
    resumeLower.includes(skill.toLowerCase())
  );
  
  const keywordMatchScore = skills.length > 0 ? 
    Math.round((matchedSkills.length / skills.length) * 100) : 0;
  
  // Simple format scoring
  const wordCount = resumeText.split(/\s+/).length;
  let formatScore = 100;
  if (wordCount < 250) formatScore -= 20;
  if (wordCount > 3000) formatScore -= 15;
  if (!resumeText.includes('•') && !resumeText.includes('-')) formatScore -= 10;
  
  // Simple section scoring
  const sections = ['summary', 'experience', 'education', 'skills'];
  const foundSections = sections.filter(section => 
    resumeLower.includes(section)
  );
  const sectionScore = Math.round((foundSections.length / sections.length) * 100);
  
  // Calculate ATS score
  const atsScore = Math.round(
    0.5 * keywordMatchScore + 
    0.25 * sectionScore + 
    0.25 * formatScore
  );
  
  // Generate suggestions
  const suggestions = [];
  if (matchedSkills.length < skills.length) {
    const missingSkills = skills.filter(skill => 
      !matchedSkills.includes(skill)
    );
    suggestions.push(`Include relevant skills: ${missingSkills.slice(0, 5).join(', ')}`);
  }
  if (keywordMatchScore < 70) {
    suggestions.push('Add more role-specific keywords across Skills and Experience sections.');
  }
  if (sectionScore < 70) {
    suggestions.push('Ensure key sections like Summary, Skills, Experience, and Education are present.');
  }
  if (formatScore < 80) {
    suggestions.push('Use bullet points and ensure the document text is selectable.');
  }
  
  return {
    ats_score: atsScore,
    keyword_match: { score: keywordMatchScore },
    missing_skills: skills.filter(skill => !matchedSkills.includes(skill)),
    format_score: formatScore,
    section_score: sectionScore,
    suggestions: suggestions,
    jd_match_score: null,
    contact: {
      has_email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(resumeText),
      has_phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(resumeText),
      has_linkedin: resumeLower.includes('linkedin'),
      has_github: resumeLower.includes('github')
    },
    metrics: {
      word_count: wordCount,
      reading_time_minutes: Math.max(1, Math.round(wordCount / 200))
    }
  };
}

// Resume analysis endpoint
app.post('/analyze-resume', (req, res) => {
  try {
    console.log('Analyze resume endpoint called with:', req.body);
    const { job_category, job_role, user_id = 'default_user' } = req.body;
    
    if (!job_category || !job_role) {
      return res.status(400).json({ error: 'Job category and role are required' });
    }
    
    // For now, return a mock analysis since we don't have file upload handling
    const mockResumeText = `
      John Doe
      Software Engineer
      
      Summary:
      Experienced software engineer with 5+ years of experience in web development.
      
      Skills:
      JavaScript, Python, React, Node.js, SQL
      
      Experience:
      • Developed web applications using React and Node.js
      • Worked with databases and APIs
      • Collaborated with cross-functional teams
      
      Education:
      Bachelor's in Computer Science
    `;
    
    const analysis = analyzeResume(mockResumeText, job_category, job_role);
    
    // Store the analysis
    const analysisData = {
      id: Math.random().toString(36).substr(2, 9) + Date.now().toString(36),
      user_id: user_id,
      resume_name: 'Sample Resume',
      job_category: job_category,
      job_role: job_role,
      analysis_type: 'standard',
      analysis_result: analysis,
      created_at: new Date().toISOString(),
      file_name: null,
      file_path: null,
      file_mime: null
    };
    
    resumeAnalysesStorage.push(analysisData);
    saveAnalysesToFile();
    
    console.log(`Analysis stored. Total analyses: ${resumeAnalysesStorage.length}`);
    res.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

// AI resume analysis endpoint
app.post('/ai-analyze-resume', (req, res) => {
  try {
    console.log('AI analyze resume endpoint called with:', req.body);
    const { job_category, job_role, user_id = 'default_user' } = req.body;
    
    if (!job_category || !job_role) {
      return res.status(400).json({ error: 'Job category and role are required' });
    }
    
    // For now, return a mock AI analysis
    const mockResumeText = `
      John Doe
      Software Engineer
      
      Summary:
      Experienced software engineer with 5+ years of experience in web development.
      
      Skills:
      JavaScript, Python, React, Node.js, SQL
      
      Experience:
      • Developed web applications using React and Node.js
      • Worked with databases and APIs
      • Collaborated with cross-functional teams
      
      Education:
      Bachelor's in Computer Science
    `;
    
    const analysis = analyzeResume(mockResumeText, job_category, job_role);
    
    // Store the analysis
    const analysisData = {
      id: Math.random().toString(36).substr(2, 9) + Date.now().toString(36),
      user_id: user_id,
      resume_name: 'Sample Resume',
      job_category: job_category,
      job_role: job_role,
      analysis_type: 'ai',
      analysis_result: analysis,
      created_at: new Date().toISOString(),
      file_name: null,
      file_path: null,
      file_mime: null
    };
    
    resumeAnalysesStorage.push(analysisData);
    saveAnalysesToFile();
    
    console.log(`AI Analysis stored. Total analyses: ${resumeAnalysesStorage.length}`);
    res.json(analysis);
  } catch (error) {
    console.error('AI Analysis error:', error);
    res.status(500).json({ error: 'AI Analysis failed' });
  }
});

// User analyses endpoint
app.get('/user-analyses/:userId', (req, res) => {
  try {
    console.log('User analyses endpoint called for user:', req.params.userId);
    const { userId } = req.params;
    const userAnalyses = resumeAnalysesStorage.filter(analysis => 
      analysis.user_id === userId
    );
    
    // Sort by created_at date (newest first)
    userAnalyses.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    console.log(`Found ${userAnalyses.length} analyses for user ${userId}`);
    console.log('Total analyses in storage:', resumeAnalysesStorage.length);
    
    res.json({ analyses: userAnalyses });
  } catch (error) {
    console.error('Error fetching user analyses:', error);
    res.status(500).json({ error: 'Failed to fetch analyses' });
  }
});

// Download resume endpoint
app.get('/download-resume/:analysisId', (req, res) => {
  try {
    const { analysisId } = req.params;
    const analysis = resumeAnalysesStorage.find(a => a.id === analysisId);
    
    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }
    
    if (!analysis.file_path) {
      return res.status(404).json({ error: 'No file available for download' });
    }
    
    // For now, return a placeholder since we don't have file handling
    res.json({ message: 'File download not implemented in Node.js backend' });
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Download failed' });
  }
});

// Job skills endpoint
app.get('/job-skills', (req, res) => {
  try {
    const { category, role } = req.query;
    
    if (!category || !role) {
      return res.status(400).json({ error: 'Category and role are required' });
    }
    
    const skills = jobRolesDataset[category]?.[role];
    if (!skills) {
      return res.status(404).json({ error: 'Category or role not found' });
    }
    
    res.json({ category, role, skills });
  } catch (error) {
    console.error('Job skills error:', error);
    res.status(500).json({ error: 'Failed to fetch job skills' });
  }
});

// Store analysis endpoint
app.post('/store-analysis', (req, res) => {
  try {
    const analysisData = {
      id: Math.random().toString(36).substr(2, 9) + Date.now().toString(36),
      ...req.body,
      created_at: new Date().toISOString()
    };
    
    resumeAnalysesStorage.push(analysisData);
    saveAnalysesToFile();
    
    res.json({ id: analysisData.id, message: 'Analysis stored successfully' });
  } catch (error) {
    console.error('Store analysis error:', error);
    res.status(500).json({ error: 'Failed to store analysis' });
  }
});

// Build resume endpoint (placeholder)
app.post('/build-resume', (req, res) => {
  res.json({ message: 'Build resume endpoint - Node.js backend working' });
});

// Send feedback endpoint (placeholder)
app.post('/send-feedback', (req, res) => {
  res.json({ message: 'Feedback endpoint - Node.js backend working' });
});

// Export for Vercel
module.exports = app;
