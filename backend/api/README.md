# CVision Backend API

A Node.js backend API for the CVision Smart Resume Analyzer, designed to work with Vercel deployment.

## Features

- **Resume Analysis**: Extract text from PDF and DOCX files and analyze them
- **ATS Scoring**: Calculate ATS (Applicant Tracking System) scores based on keyword matching, sections, and format
- **Job Role Matching**: Match resumes against specific job roles and categories
- **Data Persistence**: Store analysis results for dashboard display
- **File Upload**: Handle PDF and DOCX file uploads
- **Download**: Download previously uploaded resume files

## API Endpoints

### Health Check
- `GET /health` - Returns backend status

### Job Data
- `GET /job-categories` - Get available job categories
- `GET /job-roles` - Get job roles with required skills

### Resume Analysis
- `POST /analyze-resume` - Analyze resume (standard analysis)
- `POST /ai-analyze-resume` - Analyze resume (AI-enhanced analysis)

### User Data
- `GET /user-analyses/:id` - Get analyses for a specific user
- `GET /download-resume/:id` - Download a resume file

### Job Search
- `GET /api/jobs` - Search for jobs (with Adzuna API integration)

## Dependencies

- **express**: Web framework
- **cors**: Cross-origin resource sharing
- **multer**: File upload handling
- **uuid**: Unique ID generation
- **pdf-parse**: PDF text extraction
- **mammoth**: DOCX text extraction
- **axios**: HTTP client for testing

## Vercel Deployment

This backend is configured to work with Vercel serverless functions:

1. **File Storage**: Uses `/tmp/` directory for temporary file storage
2. **Data Persistence**: Stores analysis data in JSON files
3. **CORS**: Configured for Vercel domains
4. **File Size Limits**: 10MB limit for file uploads

## Testing

Run the test script to verify all endpoints work:

```bash
cd backend/api
node test-endpoints.js
```

## Environment Variables

For production deployment, set these environment variables in Vercel:

- `ADZUNA_APP_ID`: Adzuna API app ID (optional)
- `ADZUNA_API_KEY`: Adzuna API key (optional)

## File Structure

```
backend/api/
├── index.js              # Main API server
├── package.json          # Dependencies
├── test-endpoints.js     # Test script
└── README.md            # This file
```

## Analysis Algorithm

The resume analysis uses a weighted scoring system:

1. **Keyword Match (50%)**: Matches resume text against required skills for the job role
2. **Section Score (25%)**: Checks for presence of key resume sections
3. **Format Score (25%)**: Evaluates formatting, length, and contact information

## Sample Analysis Response

```json
{
  "ats_score": 85,
  "keyword_match": { "score": 80 },
  "missing_skills": ["docker", "kubernetes"],
  "format_score": 90,
  "section_score": 85,
  "suggestions": [
    "Include relevant skills: docker, kubernetes",
    "Add more role-specific keywords across Skills and Experience sections"
  ],
  "contact": {
    "email": true,
    "phone": true,
    "linkedin": true,
    "github": false
  },
  "metrics": {
    "word_count": 450,
    "reading_time_minutes": 3
  }
}
```

## Troubleshooting

1. **File Upload Issues**: Check file size limits and supported formats (PDF, DOCX)
2. **Text Extraction Errors**: Ensure files are not password-protected or corrupted
3. **CORS Issues**: Verify domain configuration in CORS settings
4. **Storage Issues**: Check Vercel temp directory permissions

## Development

To run locally:

```bash
cd backend/api
npm install
node index.js
```

The server will start on port 3000 by default.
