const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const OpenAI = require('openai');
const nodemailer = require('nodemailer');

const app = express();

// Initialize OpenAI client for AI analysis
const openaiApiKey = process.env.OPENROUTER_API_KEY;
let openaiClient = null;

if (!openaiApiKey) {
  console.log('Warning: OPENROUTER_API_KEY not found in environment variables. AI analysis will not work.');
} else {
  openaiClient = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: openaiApiKey,
    defaultHeaders: {
      'HTTP-Referer': 'http://localhost:3000',
      'X-Title': 'CVision Resume Analyzer',
    }
  });
  console.log('✅ OpenAI client initialized successfully');
}

// Initialize email transporter for feedback
const emailTransporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'cvision.feedback@gmail.com',
    pass: process.env.EMAIL_PASSWORD || ''
  }
});

// Function to send feedback email
const sendFeedbackEmail = async (feedbackData) => {
  try {
    const { name, email, subject, message, rating } = feedbackData;
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'cvision.feedback@gmail.com',
      to: '22it084@charusat.edu.in, 22it157@charusat.edu.in',
      subject: `CVision Feedback: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Feedback Received - CVision Resume Analyzer</h2>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>From:</strong> ${name} (${email})</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Rating:</strong> ${rating}/5 ${rating ? '⭐'.repeat(rating) : ''}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border-left: 4px solid #007bff;">
            <h3 style="color: #007bff; margin-top: 0;">Message:</h3>
            <p style="line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #e9ecef; border-radius: 4px; font-size: 12px; color: #666;">
            <p>This feedback was sent automatically from the CVision application.</p>
          </div>
        </div>
      `
    };

    if (process.env.EMAIL_PASSWORD) {
      await emailTransporter.sendMail(mailOptions);
      console.log('✅ Feedback email sent successfully');
      return true;
    } else {
      console.log('⚠️ Email password not configured. Feedback would be sent to:', mailOptions.to);
      console.log('📧 Feedback content:', { name, email, subject, message, rating });
      return false;
    }
  } catch (error) {
    console.error('❌ Error sending feedback email:', error);
    return false;
  }
};

// In-memory storage for resume analyses (Vercel-compatible)
let resumeAnalysesStorage = [];

// Load existing analyses from file if available (Vercel temp directory)
const loadAnalysesFromFile = () => {
  try {
    const data = fs.readFileSync('/tmp/analyses.json', 'utf8');
    resumeAnalysesStorage = JSON.parse(data);
  } catch (error) {
    console.log('No existing analyses file found, starting fresh');
    resumeAnalysesStorage = [];
  }
};

// Save analyses to file (Vercel temp directory)
const saveAnalysesToFile = () => {
  try {
    fs.writeFileSync('/tmp/analyses.json', JSON.stringify(resumeAnalysesStorage, null, 2));
  } catch (error) {
    console.error('Failed to save analyses:', error);
  }
};

// Initialize storage
loadAnalysesFromFile();

// Add some sample data for testing if storage is empty
if (resumeAnalysesStorage.length === 0) {
  const sampleAnalysis = {
    id: 'sample-1',
    user_id: 'default_user',
    resume_name: 'Sample Resume.pdf',
    job_category: 'Technology',
    job_role: 'Software Engineer',
    analysis_type: 'standard',
    analysis_result: {
      ats_score: 85,
      keyword_match: { score: 80 },
      missing_skills: ['docker', 'kubernetes'],
      format_score: 90,
      section_score: 85,
      suggestions: [
        'Include relevant skills: docker, kubernetes',
        'Add more role-specific keywords across Skills and Experience sections'
      ],
      contact: {
        email: true,
        phone: true,
        linkedin: true,
        github: false
      },
      metrics: {
        word_count: 450,
        reading_time_minutes: 3
      }
    },
    created_at: new Date().toISOString(),
    file_name: 'Sample Resume.pdf',
    file_path: null
  };
  
  resumeAnalysesStorage.push(sampleAnalysis);
  saveAnalysesToFile();
}

// Configure multer for file uploads (Vercel-compatible)
const upload = multer({ 
  dest: '/tmp/uploads/',
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Job roles data
const ROLES_DATASET = {
  'Technology': {
    'Frontend Developer': [
      'javascript', 'typescript', 'react', 'next.js', 'html', 'css', 
      'tailwind', 'redux', 'testing-library', 'cypress', 'webpack', 
      'vite', 'accessibility', 'responsive design', 'git'
    ],
    'Backend Developer': [
      'node.js', 'express', 'python', 'fastapi', 'java', 'spring', 
      'rest', 'graphql', 'sql', 'postgresql', 'mysql', 'nosql', 
      'mongodb', 'docker', 'kubernetes', 'aws', 'auth', 'jwt', 
      'caching', 'redis', 'message queues', 'git', 'testing'
    ],
    'Software Engineer': [
      'data structures', 'algorithms', 'python', 'java', 'javascript', 
      'git', 'sql', 'rest', 'system design', 'docker', 'cloud', 
      'aws', 'testing', 'ci/cd', 'design patterns', 'linux'
    ],
    'Data Scientist': [
      'python', 'pandas', 'numpy', 'scikit-learn', 'machine learning', 
      'statistics', 'sql', 'matplotlib', 'seaborn', 'feature engineering', 
      'model evaluation', 'notebooks', 'deployment', 'mlflow', 
      'tensorflow', 'pytorch', 'data visualization'
    ]
  }
};

// Resume analysis functions
const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    return '';
  }
};

const extractTextFromDOCX = async (filePath) => {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    console.error('Error extracting text from DOCX:', error);
    return '';
  }
};

const extractTextFromFile = async (filePath, mimeType) => {
  if (mimeType === 'application/pdf') {
    return await extractTextFromPDF(filePath);
  } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return await extractTextFromDOCX(filePath);
  }
  return '';
};

const scoreKeywordMatch = (resumeText, requiredSkills) => {
  const resumeLower = resumeText.toLowerCase();
  const matchedSkills = requiredSkills.filter(skill => 
    resumeLower.includes(skill.toLowerCase())
  );
  return Math.round((matchedSkills.length / requiredSkills.length) * 100);
};

const scoreSections = (resumeText) => {
  const sections = ['summary', 'experience', 'education', 'skills', 'contact'];
  const resumeLower = resumeText.toLowerCase();
  const foundSections = sections.filter(section => 
    resumeLower.includes(section) || resumeLower.includes(section + 's')
  );
  return Math.round((foundSections.length / sections.length) * 100);
};

const scoreFormat = (resumeText, fileSize) => {
  let score = 50; // Base score
  
  // Check for bullet points
  if (resumeText.includes('•') || resumeText.includes('-') || resumeText.includes('*')) {
    score += 20;
  }
  
  // Check for proper length (not too short, not too long)
  const wordCount = resumeText.split(/\s+/).length;
  if (wordCount >= 200 && wordCount <= 800) {
    score += 20;
  } else if (wordCount < 100) {
    score -= 20;
  }
  
  // Check for contact information
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const phoneRegex = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/;
  
  if (emailRegex.test(resumeText)) score += 5;
  if (phoneRegex.test(resumeText)) score += 5;
  
  return Math.min(100, Math.max(0, score));
};

const getPresentSections = (resumeText) => {
  const sections = ['summary', 'experience', 'education', 'skills', 'contact', 'projects', 'certifications'];
  const resumeLower = resumeText.toLowerCase();
  return sections.filter(section => 
    resumeLower.includes(section) || resumeLower.includes(section + 's')
  );
};

// AI Analysis function
const performAIAnalysis = async (resumeText, jobCategory, jobRole, customJobDescription) => {
  if (!openaiClient) {
    throw new Error('AI analysis service not configured. Please set OPENROUTER_API_KEY environment variable.');
  }

  const requiredSkills = ROLES_DATASET[jobCategory]?.[jobRole] || [];
  const presentSections = getPresentSections(resumeText);
  
  // Build the AI prompt
  let prompt = `Analyze this resume for a ${jobRole} position in ${jobCategory}. 
  
Resume Text:
${resumeText}

Required Skills for ${jobRole}:
${requiredSkills.join(', ')}

Present Sections: ${presentSections.join(', ')}

${customJobDescription ? `Custom Job Description: ${customJobDescription}` : ''}

Please provide a comprehensive analysis in JSON format with the following structure:
{
  "ats_score": <number 0-100>,
  "keyword_match": {"score": <number 0-100>},
  "missing_skills": [<array of missing skills>],
  "format_score": <number 0-100>,
  "section_score": <number 0-100>,
  "suggestions": [<array of improvement suggestions>],
  "jd_match_score": <number 0-100 if custom job description provided>,
  "contact": {
    "email": <boolean>,
    "phone": <boolean>,
    "linkedin": <boolean>,
    "github": <boolean>
  },
  "metrics": {
    "word_count": <number>,
    "reading_time_minutes": <number>
  }
}

Focus on:
1. ATS compatibility and keyword matching
2. Missing skills that should be added
3. Format and structure improvements
4. Section completeness
5. Contact information presence
6. Specific, actionable suggestions

Return only valid JSON, no additional text.`;

  try {
    console.log('🤖 Calling AI service for resume analysis...');
    const completion = await openaiClient.chat.completions.create({
      model: 'openai/gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 1500,
    });

    const aiResponse = completion.choices[0].message.content.trim();
    console.log('✅ AI response received');
    
    // Clean up the response
    let cleanedResponse = aiResponse;
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.slice(7);
    }
    if (cleanedResponse.endsWith('```')) {
      cleanedResponse = cleanedResponse.slice(0, -3);
    }
    
    const analysisData = JSON.parse(cleanedResponse);
    
    return {
      ats_score: analysisData.ats_score || 0,
      keyword_match: analysisData.keyword_match || { score: 0 },
      missing_skills: analysisData.missing_skills || [],
      format_score: analysisData.format_score || 0,
      section_score: analysisData.section_score || 0,
      suggestions: analysisData.suggestions || [],
      jd_match_score: analysisData.jd_match_score,
      contact: analysisData.contact || {
        email: false,
        phone: false,
        linkedin: false,
        github: false
      },
      metrics: analysisData.metrics || {
        word_count: resumeText.split(/\s+/).length,
        reading_time_minutes: Math.max(1, Math.round(resumeText.split(/\s+/).length / 200))
      }
    };
  } catch (error) {
    console.error('AI Analysis error:', error);
    throw new Error('Failed to perform AI analysis: ' + error.message);
  }
};

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

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Backend is working!',
    ai_enabled: !!openaiClient
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
        description: 'Build user-facing web applications and interfaces',
        required_skills: ROLES_DATASET['Technology']['Frontend Developer']
      },
      'Backend Developer': {
        description: 'Develop server-side applications and APIs',
        required_skills: ROLES_DATASET['Technology']['Backend Developer']
      },
      'Software Engineer': {
        description: 'Design and develop software solutions',
        required_skills: ROLES_DATASET['Technology']['Software Engineer']
      },
      'Data Scientist': {
        description: 'Analyze data and build machine learning models',
        required_skills: ROLES_DATASET['Technology']['Data Scientist']
      }
    }
  };
  res.json(roles);
});

// Resume analysis endpoint
app.post('/analyze-resume', upload.single('file'), async (req, res) => {
  try {
    const { job_category, job_role, user_id = 'default_user', text } = req.body;
    
    if (!job_category || !job_role) {
      return res.status(400).json({ error: 'Job category and role are required' });
    }

    let resumeText = '';
    let filePath = null;
    let fileName = 'Text Resume';

    if (req.file) {
      filePath = req.file.path;
      fileName = req.file.originalname;
      resumeText = await extractTextFromFile(filePath, req.file.mimetype);
    } else if (text) {
      resumeText = text;
    } else {
      return res.status(400).json({ error: 'Either file or text is required' });
    }

    if (!resumeText.trim()) {
      return res.status(400).json({ error: 'Could not extract text from the provided content' });
    }

    // Get required skills for the job role
    const requiredSkills = ROLES_DATASET[job_category]?.[job_role] || [];
    
    // Calculate scores
    const keywordMatchScore = scoreKeywordMatch(resumeText, requiredSkills);
    const sectionScore = scoreSections(resumeText);
    const formatScore = scoreFormat(resumeText, req.file?.size || 0);
    const atsScore = Math.round(0.5 * keywordMatchScore + 0.25 * sectionScore + 0.25 * formatScore);

    // Generate suggestions
    const suggestions = [];
    const missingSkills = requiredSkills.filter(skill => 
      !resumeText.toLowerCase().includes(skill.toLowerCase())
    );

    if (missingSkills.length > 0) {
      suggestions.push(`Include relevant skills: ${missingSkills.slice(0, 5).join(', ')}`);
    }
    if (keywordMatchScore < 70) {
      suggestions.push('Add more role-specific keywords across Skills and Experience sections');
    }
    if (sectionScore < 70) {
      suggestions.push('Ensure key sections like Summary, Skills, Experience, and Education are present');
    }
    if (formatScore < 80) {
      suggestions.push('Use bullet points and ensure the document text is selectable');
    }

    // Check for contact information
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const phoneRegex = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/;
    const hasEmail = emailRegex.test(resumeText);
    const hasPhone = phoneRegex.test(resumeText);

    const contact = {
      email: hasEmail,
      phone: hasPhone,
      linkedin: resumeText.toLowerCase().includes('linkedin'),
      github: resumeText.toLowerCase().includes('github')
    };

    // Calculate word count and reading time
    const wordCount = resumeText.split(/\s+/).length;
    const readingTimeMinutes = Math.max(1, Math.round(wordCount / 200));

    const result = {
      ats_score: atsScore,
      keyword_match: { score: keywordMatchScore },
      missing_skills: missingSkills.slice(0, 10),
      format_score: formatScore,
      section_score: sectionScore,
      suggestions: suggestions,
      contact: contact,
      metrics: {
        word_count: wordCount,
        reading_time_minutes: readingTimeMinutes
      }
    };

    // Store the analysis
    const analysisId = uuidv4();
    const analysisData = {
      id: analysisId,
      user_id: user_id,
      resume_name: fileName,
      job_category: job_category,
      job_role: job_role,
      analysis_type: 'standard',
      analysis_result: result,
      created_at: new Date().toISOString(),
      file_name: fileName,
      file_path: filePath
    };

    resumeAnalysesStorage.push(analysisData);
    saveAnalysesToFile();

    res.json(result);

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Internal server error during analysis' });
  }
});

// AI resume analysis endpoint
app.post('/ai-analyze-resume', upload.single('file'), async (req, res) => {
  try {
    const { job_category, job_role, user_id = 'default_user', custom_job_description, text } = req.body;
    
    if (!job_category || !job_role) {
      return res.status(400).json({ error: 'Job category and role are required' });
    }

    let resumeText = '';
    let filePath = null;
    let fileName = 'Text Resume';

    if (req.file) {
      filePath = req.file.path;
      fileName = req.file.originalname;
      resumeText = await extractTextFromFile(filePath, req.file.mimetype);
    } else if (text) {
      resumeText = text;
    } else {
      return res.status(400).json({ error: 'Either file or text is required' });
    }

    if (!resumeText.trim()) {
      return res.status(400).json({ error: 'Could not extract text from the provided content' });
    }

    // Perform AI analysis
    console.log('🚀 Starting AI analysis for:', fileName);
    const result = await performAIAnalysis(resumeText, job_category, job_role, custom_job_description);

    // Store the analysis
    const analysisId = uuidv4();
    const analysisData = {
      id: analysisId,
      user_id: user_id,
      resume_name: fileName,
      job_category: job_category,
      job_role: job_role,
      analysis_type: 'ai',
      analysis_result: result,
      created_at: new Date().toISOString(),
      file_name: fileName,
      file_path: filePath
    };

    resumeAnalysesStorage.push(analysisData);
    saveAnalysesToFile();

    console.log('✅ AI analysis completed and stored');
    res.json(result);

  } catch (error) {
    console.error('AI Analysis error:', error);
    if (error.message.includes('AI analysis service not configured')) {
      res.status(503).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error during AI analysis' });
    }
  }
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

// Get user analyses endpoint
app.get('/user-analyses/:id', (req, res) => {
  try {
    const userId = req.params.id;
    const userAnalyses = resumeAnalysesStorage.filter(analysis => analysis.user_id === userId);
    
    // Sort by created_at date (newest first)
    userAnalyses.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    res.json({ analyses: userAnalyses });
  } catch (error) {
    console.error('Error fetching user analyses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Download resume endpoint
app.get('/download-resume/:id', (req, res) => {
  try {
    const analysisId = req.params.id;
    const analysis = resumeAnalysesStorage.find(a => a.id === analysisId);
    
    if (!analysis || !analysis.file_path) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    if (!fs.existsSync(analysis.file_path)) {
      return res.status(404).json({ error: 'Resume file not found' });
    }

    res.download(analysis.file_path, analysis.file_name || 'resume.pdf');
  } catch (error) {
    console.error('Error downloading resume:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Placeholder endpoints for other functionality
app.post('/build-resume', (req, res) => {
  res.json({ message: 'Build resume endpoint - Node.js backend working' });
});

// Send feedback endpoint
app.post('/send-feedback', async (req, res) => {
  try {
    const { name, email, subject, message, rating } = req.body;
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, email, subject, message' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email format' 
      });
    }

    // Validate rating if provided
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ 
        error: 'Rating must be between 1 and 5' 
      });
    }

    console.log('📧 Processing feedback from:', name, email);

    // Send feedback email
    const emailSent = await sendFeedbackEmail({ name, email, subject, message, rating });

    if (emailSent) {
      res.json({ 
        message: 'Feedback sent successfully!', 
        status: 'success' 
      });
    } else {
      res.json({ 
        message: 'Feedback logged (email not configured)', 
        status: 'logged' 
      });
    }

  } catch (error) {
    console.error('❌ Feedback error:', error);
    res.status(500).json({ 
      error: 'Failed to send feedback: ' + error.message 
    });
  }
});

app.get('/job-skills', (req, res) => {
  res.json({ message: 'Job skills endpoint - Node.js backend working' });
});

app.post('/store-analysis', (req, res) => {
  res.json({ message: 'Store analysis endpoint - Node.js backend working' });
});

// Export for Vercel
module.exports = app;