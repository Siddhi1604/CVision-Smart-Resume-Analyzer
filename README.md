# 🚀 CVision Smart Resume Analyzer

> A modern **AI-powered web application** that analyzes, enhances, and generates resumes using **GPT-4**, **Supabase**, and **Firebase** — helping users create job-ready CVs effortlessly.

![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.0-black)
![Supabase](https://img.shields.io/badge/Backend-Supabase-blue)
![Firebase](https://img.shields.io/badge/Auth-Firebase-orange)
![Status](https://img.shields.io/badge/Status-Active-success)

---

## 📘 Overview

CVision Smart Resume Analyzer is an intelligent platform that leverages **AI and NLP** to provide:
- Smart resume analysis and improvement suggestions 🧠  
- Resume generation with customizable templates 📄  
- AI-based job recommendations aligned with user skills 💼  
- Secure cloud storage using **Supabase** and **Firebase Authentication**

---

## 🧭 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Folder Structure](#-folder-structure)
- [Setup Instructions](#️-setup-instructions)
- [Database Schema](#-database-schema)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)
- [Future Enhancements](#-future-enhancements)
- [Contributors](#-contributors)
- [License](#-license)

---

## ✨ Features

✅ **Resume Analysis** — Upload your resume in PDF or DOCX format to receive instant, AI-generated feedback.  
✅ **Resume Builder** — Generate professional resumes in different templates with auto-filled content.  
✅ **Skill Extraction** — Detects key skills and achievements from uploaded documents.  
✅ **Job Recommendations** — Fetches AI-based job suggestions matching your profile.  
✅ **Secure Authentication** — Firebase-based login system with Google OAuth.  
✅ **Data Storage** — Stores resumes, feedback, and history in Supabase database.  
✅ **Responsive UI** — Fully optimized for mobile and desktop users.

---

## 🧰 Tech Stack

| Category | Technology Used |
|-----------|----------------|
| **Frontend** | Next.js 15, React 18, Tailwind CSS |
| **Backend** | Supabase (PostgreSQL + Edge Functions) |
| **Authentication** | Firebase Auth (Email + Google) |
| **AI Engine** | OpenAI GPT-4 API |
| **Storage** | Supabase Storage |
| **Deployment** | Vercel |
| **Version Control** | Git + GitHub |

---

## 🧱 System Architecture

```
                +--------------------+
                |     Frontend       |
                |   (Next.js + TS)   |
                +----------+---------+
                           |
                           ↓
                +--------------------+
                |  Firebase Auth     |
                |  (User Login)      |
                +----------+---------+
                           |
                           ↓
                +--------------------+
                |   Supabase API     |
                | (Resume, Jobs DB)  |
                +----------+---------+
                           |
                           ↓
                +--------------------+
                |   GPT-4 API Layer  |
                | (AI Resume Engine) |
                +--------------------+
```

---

## 📂 Folder Structure

```
CVision/
│
├── app/                    # Next.js pages & routes
│   ├── resume/             # Resume builder & analyzer
│   ├── jobs/               # Job recommendation module
│   └── api/                # API route handlers
│
├── components/             # Reusable React components
├── lib/                    # Config (Supabase, Firebase, OpenAI)
├── styles/                 # Global and Tailwind styles
├── public/                 # Static assets (logos, icons, screenshots)
├── .env.example            # Example environment variables
└── README.md
```

---

## ⚙️ Setup Instructions

### 🔑 1. Clone the Repository
```bash
git clone https://github.com/yourusername/CVision.git
cd CVision
```

### 📦 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 🧾 3. Configure Environment Variables
Create a `.env.local` file and add the following:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
OPENAI_API_KEY=your_openai_api_key
```

> For detailed setup instructions, refer to:  
> 📄 [Supabase Setup Guide](docs/SUPABASE_SETUP_GUIDE.md)  
> 🔥 [Firebase Auth Configuration](docs/FIREBASE_AUTH_SETUP.md)

### ▶️ 4. Run the Development Server
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) to explore the app locally.

---

## 🗄️ Database Schema

<details>
<summary>📦 Click to view Database Structure</summary>

```sql
-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Resumes Table
CREATE TABLE resumes (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title TEXT,
  content TEXT,
  ai_feedback JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Jobs Table
CREATE TABLE jobs (
  id UUID PRIMARY KEY,
  title TEXT,
  description TEXT,
  skills TEXT[],
  link TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

</details>

---

## ☁️ Deployment

Deployed on **Vercel** with automatic GitHub CI/CD.  
For instructions, follow:  
📘 [Vercel Deployment Guide](docs/VERCEL_DEPLOYMENT_GUIDE.md)

```bash
vercel login
vercel --prod
```

---

## 📸 Screenshots

| Dashboard | Resume Analyzer | Job Recommendations |
|------------|-----------------|---------------------|
| ![Dashboard](docs/screenshots/dashboard.png) | ![Analyzer](docs/screenshots/analyzer.png) | ![Jobs](docs/screenshots/jobs.png) |

---

## 🚀 Future Enhancements

- 🔍 AI-based Interview Question Generator  
- 🧾 Resume Template Customization with Drag-and-Drop  
- 📈 Resume Score History Dashboard  
- 🌐 Multi-Language Resume Generation  
- 🤝 Integration with LinkedIn & Indeed APIs  

---

## 👥 Contributors

| Name | Role | GitHub |
|------|------|---------|
| **Siddhi Pandya** | Project Lead / Full-Stack Developer | [@Siddhi1604](https://github.com/Siddhi1604) |
| **Vyom Pandya** | Content & Technical Documentation | [@vyompandya](https://github.com/vyompandya) |

---

## 🪪 License

This project is licensed under the [MIT License](LICENSE).  
Feel free to use, modify, and distribute it with attribution.

---

## 🧑‍💻 Built With ❤️ by

**Team CVision**  
Bridging AI and career growth — one resume at a time.

⭐ *If you like this project, please give it a star to support the development!*

---
