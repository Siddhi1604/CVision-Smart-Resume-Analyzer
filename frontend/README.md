# Smart Resume AI - React Frontend

A modern, responsive React frontend for the Smart Resume AI application. This frontend provides an intuitive user interface for resume analysis, building, and job search functionality.

## 🚀 Features

- **Modern UI/UX**: Clean, responsive design with smooth animations
- **Resume Analyzer**: Upload and analyze resumes with AI-powered insights
- **Resume Builder**: Create professional resumes with customizable templates
- **Job Search**: Browse and filter job opportunities
- **Dashboard**: Analytics and performance tracking
- **Feedback System**: User feedback and testimonials
- **Mobile Responsive**: Works perfectly on all devices

## 🛠️ Tech Stack

- **React 18**: Modern React with hooks and functional components
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions
- **Lucide React**: Beautiful icons
- **Axios**: HTTP client for API calls
- **React Dropzone**: File upload functionality
- **React Toastify**: Toast notifications

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Hunterdii/Smart-AI-Resume-Analyzer.git
   cd Smart-AI-Resume-Analyzer/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### Backend API
The frontend is configured to connect to the backend API running on `http://localhost:8000`. You can modify this in the `package.json` proxy setting or by updating the API base URL in the axios configuration.

### Environment Variables
Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENVIRONMENT=development
```

## 📁 Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   └── Navbar.js
│   ├── context/
│   │   └── JobRolesContext.js
│   ├── pages/
│   │   ├── Home.js
│   │   ├── ResumeAnalyzer.js
│   │   ├── ResumeBuilder.js
│   │   ├── Dashboard.js
│   │   ├── JobSearch.js
│   │   ├── Feedback.js
│   │   └── About.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
├── tailwind.config.js
└── README.md
```

## 🎨 Design System

### Colors
- **Primary**: Green (`#4CAF50`, `#45a049`)
- **Background**: Dark gradient (`#0f0f23` to `#1a1a2e`)
- **Cards**: Semi-transparent white (`rgba(255, 255, 255, 0.05)`)
- **Text**: White and gray variations

### Components
- **Cards**: Glassmorphism effect with backdrop blur
- **Buttons**: Gradient backgrounds with hover effects
- **Forms**: Dark theme with green focus states
- **Animations**: Smooth transitions using Framer Motion

## 🔌 API Integration

The frontend communicates with the backend through REST APIs:

### Resume Analysis
- `POST /analyze-resume` - Standard resume analysis
- `POST /ai-analyze-resume` - AI-powered analysis

### Resume Building
- `POST /build-resume` - Generate resume from form data

### Job Roles
- `GET /job-roles` - Fetch available job roles and categories

### Dashboard
- `GET /dashboard/stats` - Fetch analytics and statistics

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`

### Deploy to Netlify
1. Build the project: `npm run build`
2. Upload the `build` folder to Netlify

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: 1200px+ (Full layout with sidebar)
- **Tablet**: 768px - 1199px (Adaptive grid layouts)
- **Mobile**: < 768px (Stacked layouts, mobile navigation)

## 🎯 Key Features

### Resume Analyzer
- Drag & drop file upload
- PDF and DOCX support
- Job role selection
- ATS score calculation
- Skills gap analysis
- Improvement suggestions

### Resume Builder
- Multiple template options
- Form-based resume creation
- Real-time preview
- Export to DOCX format

### Dashboard
- Analytics overview
- Performance metrics
- Recent activity tracking
- User statistics

### Job Search
- Advanced filtering
- Location-based search
- Job type filtering
- Experience level matching

## 🔒 Security

- Input validation on all forms
- File type restrictions
- XSS protection
- CORS configuration
- Secure API communication

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🙏 Acknowledgments

- **Het Patel** - Original developer and project creator
- **React Team** - Amazing framework
- **Tailwind CSS** - Beautiful utility-first CSS
- **Framer Motion** - Smooth animations
- **Lucide** - Beautiful icons

## 📞 Support

- **Email**: hunterdii9879@gmail.com
- **GitHub**: [@Hunterdii](https://github.com/Hunterdii)
- **LinkedIn**: [Het Patel](https://www.linkedin.com/in/patel-hetkumar-sandipbhai-8b110525a/)

---

Made with ❤️ by Het Patel 