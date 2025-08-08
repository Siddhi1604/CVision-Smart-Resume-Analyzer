### CVision Smart Resume Analyzer — Frontend

React 18 single-page application with client-side routing, Tailwind CSS, and Firebase authentication. This folder contains only the frontend.

### Requirements
- Node.js 18+ and npm

### Install & run
```bash
cd frontend
npm ci   # or: npm install
npm start
```
- Dev server: http://localhost:3000
- API proxy: defined in `package.json` as `http://localhost:8000`

### Scripts (from package.json)
```bash
npm start      # start dev server
npm run build  # production build to frontend/build
npm test       # CRA test runner
npm run eject  # eject Create React App configuration
```

### Environment variables (Firebase)
Create `frontend/.env` with the following keys used by `src/firebase.js`:
```dotenv
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...
REACT_APP_FIREBASE_MEASUREMENT_ID=...
```
Notes:
- If these are not set, the app falls back to inline defaults in `src/firebase.js` and shows a console warning. Prefer env vars for security.

### Routing
Defined in `src/App.js`:
- `/` Home
- `/analyzer` Resume Analyzer
- `/builder` Resume Builder (protected)
- `/dashboard` Dashboard
- `/job-search` Job Search
- `/feedback` Feedback
- `/about` About
- `/auth` Login/Signup

Protected routes use `src/components/ProtectedRoute.js` and `src/context/AuthContext.js`.

### Data fetching
- `src/context/JobRolesContext.js` requests job roles from `/job-roles` (relative to the dev server/proxy) and provides helper selectors with a built-in fallback dataset.

### Styling
- Tailwind CSS configured via `tailwind.config.js` and `postcss.config.js`.
- Global styles and utility classes in `src/index.css`.

### Tech stack (from dependencies)
- React 18, React Router v6, Create React App (react-scripts)
- Tailwind CSS 3 (PostCSS + Autoprefixer)
- Framer Motion (animations)
- Lucide React (icons)
- React Toastify (toasts)
- Axios (HTTP)
- Chart.js + react-chartjs-2 (charts)
- React Dropzone (file uploads)

### Project structure
```
frontend/
  public/
    index.html
  src/
    components/
      Navbar.js
      ProtectedRoute.js
    context/
      AuthContext.js
      JobRolesContext.js
    pages/
      About.js
      Auth.js
      Dashboard.js
      Feedback.js
      Home.js
      JobSearch.js
      ResumeAnalyzer.js
      ResumeBuilder.js
    firebase.js
    index.css
    index.js
    App.js
  package.json
  postcss.config.js
  tailwind.config.js
  README.md
```

### Build
```bash
cd frontend
npm run build
# output: frontend/build
```

### Troubleshooting
- Env changes require restarting the dev server.
- If the backend isn’t available, pages relying on `/job-roles` will use a fallback dataset.
- If port 3000 is in use: `set PORT=3001 && npm start` (Windows) or `PORT=3001 npm start` (Unix).
