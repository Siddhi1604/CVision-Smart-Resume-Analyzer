# 🚀 CVision Smart Resume Analyzer **An AI-powered resume analysis and career advancement platform built with React, Node.js, and Supabase** [![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-green?style=for-the-badge)](https://c-vision-smart-resume-analyzer-327s.vercel.app) [![Tech Stack](https://img.shields.io/badge/Tech%20Stack-React%20%7C%20Node.js%20%7C%20Supabase-blue?style=for-the-badge)](https://github.com/Siddhi1604/CVision-Smart-Resume-Analyzer) [![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE) ## 📋 Table of Contents - [🎯 Overview](#-overview) - [✨ Features](#-features) - [🏗️ Architecture](#️-architecture) - [🛠️ Tech Stack](#️-tech-stack) - [📁 Project Structure](#-project-structure) - [🚀 Quick Start](#-quick-start) - [⚙️ Configuration](#️-configuration) - [🔧 Development](#-development) - [📚 API Documentation](#-api-documentation) - [🚀 Deployment](#-deployment) - [🤝 Contributing](#-contributing) - [📞 Contact](#-contact) --- ## 🎯 Overview **CVision Smart Resume Analyzer** is a comprehensive career advancement platform that combines cutting-edge AI technology with intuitive design to help job seekers optimize their resumes and advance their careers. The platform offers both standard algorithmic analysis and advanced AI-powered insights to provide personalized feedback and recommendations. ### Mission Statement CVision represents our vision of democratizing career advancement through technology. By combining cutting-edge AI with intuitive design, this platform empowers job seekers at every career stage to showcase their true potential and stand out in today's competitive job market. ### Key Highlights - 🤖 **AI-Powered Analysis**: GPT-4 integration via OpenRouter API - 📊 **Real-time Dashboard**: Track your resume performance over time - 🔍 **Job Search Integration**: Live job listings from The Muse and Adzuna APIs - 📝 **Smart Resume Builder**: Create professional resumes with multiple templates - 🔐 **Secure Authentication**: Firebase Auth with Google Sign-in - 💾 **Persistent Storage**: Supabase PostgreSQL database for data persistence - 🚀 **Serverless Architecture**: Deployed on Vercel with serverless functions --- ## ✨ Features ### 🔍 Resume Analysis - **Dual Analysis Modes**: Standard algorithmic analysis and AI-powered insights - **ATS Optimization**: Ensures compatibility with Applicant Tracking Systems - **Keyword Matching**: Analyzes resume against job-specific requirements - **Format Scoring**: Evaluates resume structure and presentation - **Section Analysis**: Identifies missing or weak resume sections - **Contact Information Validation**: Checks for essential contact details - **File Support**: PDF and DOCX file processing ### 🤖 AI-Powered Insights - **GPT-4 Integration**: Advanced AI analysis using OpenRouter API - **Personalized Recommendations**: Tailored suggestions based on target role - **Job Description Matching**: Compares resume against specific job requirements - **Skill Gap Analysis**: Identifies missing skills and competencies - **Content Optimization**: Suggests improvements for better impact - **Industry-Specific Analysis**: Customized feedback for different job categories ### 📝 Resume Builder - **Multiple Templates**: Modern, Professional, Minimal, and Creative designs - **Real-time Preview**: Live preview of resume as you build - **Export Options**: Download as DOCX format - **Section Management**: Easy addition and organization of resume sections - **Skills Categorization**: Technical, soft skills, languages, and tools - **Professional Formatting**: Industry-standard resume layouts ### 🔍 Job Search Integration - **Real Job Listings**: Live data from The Muse API and Adzuna API - **Advanced Filtering**: Search by company, location, experience level - **Pagination**: Infinite scroll for seamless browsing - **External Links**: Direct access to company career pages - **Rate Limit Handling**: Graceful management of API limits - **Job Categories**: Technology, Healthcare, Finance, Marketing, and more ### 📊 Dashboard & Analytics - **Analysis History**: Track all previous resume analyses - **Performance Metrics**: Visual charts and statistics - **Download Options**: Access to original uploaded files - **Progress Tracking**: Monitor improvement over time - **Real-time Updates**: Automatic refresh when new analyses are completed - **Score Breakdown**: Detailed analysis of ATS, keyword, format, and section scores ### 🔐 User Authentication - **Firebase Integration**: Secure user authentication - **Google Sign-in**: One-click authentication with Google - **Protected Routes**: Access control for premium features - **User Profiles**: Personalized experience and data storage - **Session Management**: Persistent login across browser sessions ### 💬 Feedback System - **User Feedback Collection**: Comprehensive feedback forms - **Email Notifications**: Automatic email delivery to team - **Rating System**: 5-star rating with detailed comments - **Contact Integration**: Direct communication channels - **Testimonials**: User success stories and reviews --- ## 🏗️ Architecture ### System Architecture Overview
mermaid
graph TB
    subgraph "Frontend (React + Vercel)"
        A[User Interface] --> B[Firebase Auth]
        A --> C[Resume Analyzer]
        A --> D[Resume Builder]
        A --> E[Job Search]
        A --> F[Dashboard]
        A --> G[Feedback]
    end
    
    subgraph "Backend (Node.js + Vercel Serverless)"
        H[API Gateway] --> I[Resume Analysis Engine]
        H --> J[OpenRouter AI Integration]
        H --> K[File Processing]
        H --> L[Job Search APIs]
        H --> M[Gmail SMTP Service]
        H --> N[Supabase Integration]
    end
    
    subgraph "External Services"
        O[OpenRouter API - GPT-4]
        P[The Muse API]
        Q[Adzuna API]
        R[Gmail SMTP]
        S[Firebase Auth]
        T[Supabase PostgreSQL]
    end
    
    subgraph "Storage & Database"
        U[Supabase Database]
        V[File Uploads]
        W[User Data Firebase]
    end
    
    A --> H
    B --> S
    I --> O
    L --> P
    L --> Q
    M --> R
    N --> T
    H --> U
    H --> V
    B --> W
### Data Flow Architecture
mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend (React)
    participant B as Backend (Node.js)
    participant AI as OpenRouter API
    participant DB as Supabase
    participant J as Job APIs
    
    U->>F: Upload Resume
    F->>B: POST /analyze-resume
    B->>B: Extract Text (PDF/DOCX)
    B->>AI: Send for AI Analysis
    AI->>B: Return Analysis Results
    B->>DB: Store Results (Supabase)
    B->>F: Return Analysis
    F->>U: Display Results & Charts
    
    U->>F: Search Jobs
    F->>B: GET /api/jobs
    B->>J: Fetch Job Listings
    J->>B: Return Job Data
    B->>F: Return Jobs
    F->>U: Display Job Listings
--- ## 🛠️ Tech Stack ### Frontend Technologies - **React 18** - Modern UI library with hooks and concurrent features - **React Router v6** - Client-side routing and navigation - **Tailwind CSS 3** - Utility-first CSS framework with custom design system - **Framer Motion** - Advanced animations and transitions - **Chart.js + react-chartjs-2** - Data visualization and analytics - **React Dropzone** - File upload handling with drag-and-drop - **Axios** - HTTP client for API communication - **React Toastify** - User notifications and feedback - **Lucide React** - Modern icon library - **Firebase** - Authentication and user management ### Backend Technologies - **Node.js 18+** - JavaScript runtime environment - **Express.js** - Web application framework - **Multer** - File upload middleware - **PDF-Parse** - PDF text extraction - **Mammoth** - DOCX document processing - **OpenAI API** - AI-powered analysis via OpenRouter - **Nodemailer** - Email delivery service - **UUID** - Unique identifier generation - **CORS** - Cross-origin resource sharing ### Database & Storage - **Supabase** - PostgreSQL database with real-time capabilities - **Row Level Security (RLS)** - Data access control - **Real-time Subscriptions** - Live data updates - **File Storage** - Temporary file handling for uploads ### External Services - **OpenRouter API** - AI model access (GPT-4) - **The Muse API** - Job listings and company data - **Adzuna API** - Additional job search data - **Gmail SMTP** - Email delivery service - **Firebase** - User authentication and management ### Deployment & Hosting - **Vercel** - Primary hosting platform (Frontend + Backend) - **Vercel Serverless Functions** - Backend API hosting - **Vercel Static Hosting** - Frontend hosting - **GitHub** - Version control and CI/CD ### Development Tools - **Create React App** - React development environment - **PostCSS + Autoprefixer** - CSS processing - **ESLint** - Code linting and quality - **Jest** - Testing framework - **Git** - Version control --- ## 📁 Project Structure
CVision-Smart-Resume-Analyzer/
├── 📁 frontend/                    # React frontend application
│   ├── 📁 public/                   # Static assets
│   │   ├── index.html              # Main HTML template
│   │   └── manifest.json           # PWA manifest
│   ├── 📁 src/                     # Source code
│   │   ├── 📁 components/          # Reusable components
│   │   │   ├── BeamsBackground.js  # Animated background component
│   │   │   ├── Navbar.js          # Navigation component
│   │   │   ├── ProtectedRoute.js  # Route protection wrapper
│   │   │   ├── ResumeChart.js     # Analytics charts component
│   │   │   └── TypingHero.js      # Hero section animation
│   │   ├── 📁 context/             # React context providers
│   │   │   ├── AuthContext.js     # Authentication state management
│   │   │   └── JobRolesContext.js # Job data management
│   │   ├── 📁 pages/               # Page components
│   │   │   ├── About.js           # About page
│   │   │   ├── Auth.js            # Login/signup page
│   │   │   ├── Dashboard.js       # User dashboard
│   │   │   ├── Feedback.js        # Feedback form
│   │   │   ├── Home.js            # Landing page
│   │   │   ├── JobSearch.js       # Job search interface
│   │   │   ├── Profile.js         # User profile page
│   │   │   ├── ResumeAnalyzer.js  # Resume analysis page
│   │   │   └── ResumeBuilder.js   # Resume builder page
│   │   ├── firebase.js             # Firebase configuration
│   │   ├── supabase.js             # Supabase client configuration
│   │   ├── index.css              # Global styles
│   │   ├── index.js               # App entry point
│   │   └── App.js                 # Main app component
│   ├── 📁 build/                   # Production build output
│   ├── package.json               # Dependencies and scripts
│   ├── tailwind.config.js         # Tailwind configuration
│   ├── postcss.config.js          # PostCSS configuration
│   ├── Procfile                   # Heroku deployment config
│   └── README.md                  # Frontend documentation
├── 📁 backend/                     # Node.js backend application
│   ├── 📁 api/                    # Vercel serverless entry point
│   │   ├── index.js              # Main API handler
│   │   ├── package.json          # Backend dependencies
│   │   └── package-lock.json     # Dependency lock file
│   ├── 📁 storage/                # Data storage
│   │   └── analyses.json          # Analysis results (fallback)
│   ├── 📁 uploads/                # File uploads (temporary)
│   │   └── *.pdf                 # Uploaded resumes
│   ├── main.py                    # Python FastAPI application (legacy)
│   ├── requirements.txt           # Python dependencies
│   ├── roles.json                 # Job roles dataset
│   ├── Procfile                  # Heroku deployment config
│   ├── runtime.txt               # Python version (3.11.0)
│   └── env-template.txt          # Environment variables template
├── 📁 api/                        # Additional API modules
│   ├── analyze-resume.js         # Resume analysis logic
│   ├── job_categories.js         # Job categories data
│   ├── job_roles.js              # Job roles data
│   ├── job-categories.js         # Alternative categories
│   ├── job-roles.js              # Alternative roles
│   └── jobs.js                   # Job search logic
├── 📄 vercel.json                # Vercel deployment configuration
├── 📄 vercel-env-template.txt     # Vercel environment variables
├── 📄 VERCEL_DEPLOYMENT_GUIDE.md # Vercel deployment instructions
├── 📄 SUPABASE_SETUP_GUIDE.md    # Supabase integration guide
├── 📄 VERCEL_ENV_SETUP.md        # Environment setup guide
├── 📄 HEROKU_COMMANDS.md         # Heroku deployment guide
├── 📄 deploy-heroku.ps1          # Heroku deployment script
├── 📄 setup-heroku.ps1           # Heroku setup script
├── 📄 deploy-to-heroku.md        # Heroku documentation
├── 📄 test_muse_integration.py   # API testing script
├── 📄 heroku-installer.exe       # Heroku CLI installer
└── 📄 README.md                  # This file
--- ## 🚀 Quick Start ### Prerequisites - **Node.js 18+** and npm - **Git** for version control - **Supabase Account** for database - **Firebase Project** for authentication - **OpenRouter API Key** for AI analysis ### 1. Clone the Repository
bash
git clone https://github.com/Siddhi1604/CVision-Smart-Resume-Analyzer.git
cd CVision-Smart-Resume-Analyzer
### 2. Environment Setup #### Frontend Environment Variables Create frontend/.env:
env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

# Supabase Configuration
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
#### Backend Environment Variables Create backend/.env:
env
# OpenAI/OpenRouter Configuration
OPENROUTER_API_KEY=your_openrouter_api_key

# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key

# Email Configuration
GMAIL_USER=your_gmail@gmail.com
GMAIL_APP_PASSWORD=your_app_password
### 3. Database Setup #### Supabase Setup 1. Go to your Supabase project dashboard 2. Navigate to **SQL Editor** 3. Run the following SQL to create required tables:
sql
-- Create the resume_analyses table
CREATE TABLE IF NOT EXISTS resume_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    resume_name TEXT NOT NULL,
    job_category TEXT NOT NULL,
    job_role TEXT NOT NULL,
    analysis_type TEXT NOT NULL CHECK (analysis_type IN ('standard', 'ai')),
    analysis_result JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    file_name TEXT,
    file_path TEXT,
    file_mime TEXT
);

-- Create the users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    display_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_resume_analyses_user_id ON resume_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_resume_analyses_created_at ON resume_analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resume_analyses_analysis_type ON resume_analyses(analysis_type);

-- Enable Row Level Security
ALTER TABLE resume_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (adjust as needed for your auth system)
CREATE POLICY "Enable all operations for service role" ON resume_analyses FOR ALL USING (true);
CREATE POLICY "Enable all operations for service role" ON users FOR ALL USING (true);
### 4. Install Dependencies
bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend/api
npm install
### 5. Run Development Servers #### Frontend Development
bash
cd frontend
npm start
The frontend will be available at http://localhost:3000 #### Backend Development
bash
cd backend/api
npm run dev
The backend API will be available at http://localhost:3001 ### 6. Test the Application 1. Open http://localhost:3000 in your browser 2. Sign up/Login with Firebase Auth 3. Upload a resume for analysis 4. Check the dashboard for your analysis results 5. Try the job search feature 6. Test the resume builder --- ## ⚙️ Configuration ### Firebase Setup 1. Go to [Firebase Console](https://console.firebase.google.com/) 2. Create a new project or use existing one 3. Enable Authentication with Google Sign-in 4. Get your Firebase configuration keys 5. Add them to your environment variables ### Supabase Setup 1. Go to [Supabase](https://supabase.com/) 2. Create a new project 3. Get your project URL and API keys 4. Run the database schema SQL 5. Configure Row Level Security policies ### OpenRouter API Setup 1. Go to [OpenRouter](https://openrouter.ai/) 2. Create an account and get API key 3. Add the key to your environment variables 4. Ensure you have credits for GPT-4 usage ### Job APIs Setup The application uses The Muse API and Adzuna API for job listings. These are configured in the backend and should work out of the box. --- ## 🔧 Development ### Project Structure Overview - **Frontend**: React application with modern hooks and context - **Backend**: Node.js Express server with serverless functions - **Database**: Supabase PostgreSQL with real-time capabilities - **Authentication**: Firebase Auth with Google Sign-in - **AI Integration**: OpenRouter API for GPT-4 analysis ### Key Components #### Frontend Components - **AuthContext**: Manages user authentication state - **JobRolesContext**: Handles job data and categories - **ResumeAnalyzer**: Main analysis interface - **Dashboard**: User analytics and history - **ResumeBuilder**: Template-based resume creation - **JobSearch**: Live job listings integration #### Backend Endpoints - **POST /analyze-resume**: Standard resume analysis - **POST /ai-analyze-resume**: AI-powered analysis - **GET /user-analyses/:id**: Fetch user's analyses - **GET /api/jobs**: Job search API - **POST /send-feedback**: Feedback submission - **GET /health**: System health check ### Development Workflow 1. **Feature Development**: Create feature branches 2. **Testing**: Test locally with both frontend and backend 3. **Code Review**: Submit pull requests for review 4. **Deployment**: Merge to main triggers Vercel deployment ### Code Style - **Frontend**: ESLint with React rules - **Backend**: Standard JavaScript/Node.js conventions - **CSS**: Tailwind CSS utility classes - **Components**: Functional components with hooks --- ## 📚 API Documentation ### Authentication Endpoints #### POST /auth/login - **Description**: User login with email/password - **Body**: { email, password } - **Response**: User object with token #### POST /auth/register - **Description**: User registration - **Body**: { email, password, displayName } - **Response**: User object with token ### Resume Analysis Endpoints #### POST /analyze-resume - **Description**: Standard resume analysis - **Body**: FormData with file, jobCategory, jobRole - **Response**: Analysis results with scores and recommendations #### POST /ai-analyze-resume - **Description**: AI-powered resume analysis - **Body**: FormData with file, jobCategory, jobRole, customJobDescription - **Response**: Enhanced analysis with AI insights ### User Data Endpoints #### GET /user-analyses/:userId - **Description**: Fetch user's analysis history - **Response**: Array of analysis objects #### GET /download-resume/:analysisId - **Description**: Download original resume file - **Response**: File download ### Job Search Endpoints #### GET /api/jobs - **Description**: Search job listings - **Query Parameters**: - page: Page number (default: 0) - keyword: Search term - location: Location filter - job_type: Job type filter - **Response**: Job listings with pagination #### GET /job-categories - **Description**: Get available job categories - **Response**: Array of category names #### GET /job-roles - **Description**: Get job roles by category - **Response**: Object with categories and roles ### Utility Endpoints #### GET /health - **Description**: System health check - **Response**: System status and configuration #### POST /send-feedback - **Description**: Submit user feedback - **Body**: { name, email, rating, message, category } - **Response**: Success confirmation --- ## 🚀 Deployment ### Vercel Deployment (Recommended) #### 1. Install Vercel CLI
bash
npm install -g vercel
#### 2. Login to Vercel
bash
vercel login
#### 3. Deploy Project
bash
# From project root
vercel

# For production deployment
vercel --prod
#### 4. Configure Environment Variables In Vercel dashboard → Settings → Environment Variables:
env
# Frontend Environment Variables
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

# Backend Environment Variables
OPENROUTER_API_KEY=your_openrouter_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
GMAIL_USER=your_gmail@gmail.com
GMAIL_APP_PASSWORD=your_app_password
#### 5. Verify Deployment - Frontend: https://your-app.vercel.app/ - Backend Health: https://your-app.vercel.app/health - API Test: https://your-app.vercel.app/api/jobs ### Heroku Deployment (Alternative) #### 1. Install Heroku CLI
bash
# Windows
heroku-installer.exe

# macOS/Linux
curl https://cli-assets.heroku.com/install.sh | sh
#### 2. Login and Create App
bash
heroku login
heroku create your-app-name
#### 3. Configure Environment Variables
bash
heroku config:set REACT_APP_FIREBASE_API_KEY=your_key
heroku config:set OPENROUTER_API_KEY=your_key
# ... add all environment variables
#### 4. Deploy
bash
git push heroku main
--- ## 🤝 Contributing We welcome contributions to CVision! Here's how you can help: ### How to Contribute 1. **Fork the Repository**
bash
   git clone https://github.com/your-username/CVision-Smart-Resume-Analyzer.git
2. **Create a Feature Branch**
bash
   git checkout -b feature/your-feature-name
3. **Make Your Changes** - Follow the existing code style - Add tests for new features - Update documentation as needed 4. **Test Your Changes**
bash
   # Frontend testing
   cd frontend
   npm test
   
   # Backend testing
   cd backend/api
   npm test
5. **Submit a Pull Request** - Provide a clear description of your changes - Include screenshots for UI changes - Reference any related issues ### Development Guidelines - **Code Style**: Follow ESLint configuration - **Commits**: Use conventional commit messages - **Testing**: Add tests for new features - **Documentation**: Update README for significant changes ### Areas for Contribution - 🐛 **Bug Fixes**: Report and fix bugs - ✨ **New Features**: Add new functionality - 📚 **Documentation**: Improve documentation - 🎨 **UI/UX**: Enhance user interface - ⚡ **Performance**: Optimize application performance - 🔒 **Security**: Improve security measures --- ## 📞 Contact ### Project Maintainers - **Siddhi Patel** - [@Siddhi1604](https://github.com/Siddhi1604) - **Vyom Shah** - [@Vyom1184](https://github.com/Vyom1184) ### Support Channels - 📧 **Email**: 22it084@charusat.edu.in, 22it157@charusat.edu.in - 🐛 **Issues**: [GitHub Issues](https://github.com/Siddhi1604/CVision-Smart-Resume-Analyzer/issues) - 💬 **Discussions**: [GitHub Discussions](https://github.com/Siddhi1604/CVision-Smart-Resume-Analyzer/discussions) ### Live Application - 🌐 **Website**: [CVision Smart Resume Analyzer](https://c-vision-smart-resume-analyzer-327s.vercel.app) - 📱 **Mobile**: Responsive design works on all devices --- ## 📄 License This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. --- ## 🙏 Acknowledgments - **OpenRouter** for providing access to GPT-4 API - **Supabase** for the excellent database and real-time features - **Firebase** for authentication services - **The Muse** and **Adzuna** for job listing APIs - **Vercel** for seamless deployment and hosting - **React** and **Node.js** communities for excellent documentation --- <div align="center"> **Made with ❤️ by Siddhi Patel & Vyom Shah** [![GitHub](https://img.shields.io/badge/GitHub-Siddhi1604-black?style=for-the-badge&logo=github)](https://github.com/Siddhi1604) [![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/siddhi-patel-1604) *Empowering careers through AI-driven resume optimization* </div>
