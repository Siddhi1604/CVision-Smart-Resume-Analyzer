# 🚀 CVision Smart Resume Analyzer

**An AI-powered resume analysis and career advancement platform built with React, Node.js, and Supabase**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-green?style=for-the-badge)](https://c-vision-smart-resume-analyzer-327s.vercel.app)
[![Tech Stack](https://img.shields.io/badge/Tech%20Stack-React%20%7C%20Node.js%20%7C%20Supabase-blue?style=for-the-badge)](https://github.com/Siddhi1604/CVision-Smart-Resume-Analyzer)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

---

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Quick Start](#-quick-start)
- [⚙️ Configuration](#️-configuration)
- [🔧 Development](#-development)
- [📚 API Documentation](#-api-documentation)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📞 Contact](#-contact)

---

## 🎯 Overview

**CVision Smart Resume Analyzer** is a comprehensive career advancement platform that combines cutting-edge AI technology with intuitive design to help job seekers optimize their resumes and advance their careers. The platform offers both standard algorithmic analysis and advanced AI-powered insights to provide personalized feedback and recommendations.

### Mission Statement

CVision represents our vision of democratizing career advancement through technology. By combining cutting-edge AI with intuitive design, this platform empowers job seekers at every career stage to showcase their true potential and stand out in today's competitive job market.

### Key Highlights

- 🤖 **AI-Powered Analysis**: GPT-4 integration via OpenRouter API  
- 📊 **Real-time Dashboard**: Track your resume performance over time  
- 🔍 **Job Search Integration**: Live job listings from The Muse and Adzuna APIs  
- 📝 **Smart Resume Builder**: Create professional resumes with multiple templates  
- 🔐 **Secure Authentication**: Firebase Auth with Google Sign-in  
- 💾 **Persistent Storage**: Supabase PostgreSQL database for data persistence  
- 🚀 **Serverless Architecture**: Deployed on Vercel with serverless functions  

---

## ✨ Features

### 🔍 Resume Analysis
- Dual analysis modes: standard algorithmic + AI-powered insights  
- ATS optimization and keyword matching  
- Format, structure, and section analysis  
- File support for PDF and DOCX  

### 🤖 AI-Powered Insights
- GPT-4 integration for personalized recommendations  
- Skill gap analysis and job description matching  
- Industry-specific insights and content optimization  

### 📝 Resume Builder
- Multiple professional templates  
- Real-time preview and export options  
- Categorized skills and editable sections  

### 🔍 Job Search Integration
- Live listings via The Muse and Adzuna APIs  
- Filtering, pagination, and external job links  

### 📊 Dashboard & Analytics
- Historical analysis tracking and progress visualization  

### 🔐 User Authentication
- Firebase Auth + Google Sign-in  
- Protected routes and user profiles  

### 💬 Feedback System
- User feedback, ratings, and testimonial collection  

---

## 🏗️ Architecture

### System Architecture

```mermaid
graph TB
    subgraph "Frontend (React + Vercel)"
        A[UI] --> B[Firebase Auth]
        A --> C[Resume Analyzer]
        A --> D[Resume Builder]
        A --> E[Job Search]
        A --> F[Dashboard]
        A --> G[Feedback]
    end

    subgraph "Backend (Node.js + Serverless)"
        H[API Gateway] --> I[Resume Analysis Engine]
        H --> J[OpenRouter Integration]
        H --> K[File Processing]
        H --> L[Job Search APIs]
        H --> M[Gmail SMTP]
        H --> N[Supabase]
    end

    subgraph "External Services"
        O[OpenRouter GPT-4]
        P[The Muse API]
        Q[Adzuna API]
        R[Gmail SMTP]
        S[Firebase Auth]
        T[Supabase DB]
    end

    A --> H
    I --> O
    L --> P
    L --> Q
    M --> R
    B --> S
    N --> T
