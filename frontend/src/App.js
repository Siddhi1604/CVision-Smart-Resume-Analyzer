import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import ResumeBuilder from './pages/ResumeBuilder';
import Dashboard from './pages/Dashboard';
import JobSearch from './pages/JobSearch';
import Feedback from './pages/Feedback';
import About from './pages/About';
import Auth from './pages/Auth';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';

// Context
import { JobRolesProvider } from './context/JobRolesContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <JobRolesProvider>
          <Navbar />
          <main className="min-h-screen pt-20">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/analyzer" element={<ResumeAnalyzer />} />
              <Route
                path="/builder"
                element={
                  <ProtectedRoute>
                    <ResumeBuilder />
                  </ProtectedRoute>
                }
              />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={<Profile />} />
              <Route path="/job-search" element={<JobSearch />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/about" element={<About />} />
              <Route path="/auth" element={<Auth />} />
            </Routes>
          </main>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </JobRolesProvider>
      </AuthProvider>
    </div>
  );
}

export default App; 