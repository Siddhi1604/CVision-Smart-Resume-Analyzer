import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const JobRolesContext = createContext();

export const useJobRoles = () => {
  const context = useContext(JobRolesContext);
  if (!context) {
    throw new Error('useJobRoles must be used within a JobRolesProvider');
  }
  return context;
};

export const JobRolesProvider = ({ children }) => {
  const [jobRoles, setJobRoles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobRoles = async () => {
      try {
        const response = await axios.get('/job-roles');
        setJobRoles(response.data);
      } catch (err) {
        console.error('Error fetching job roles:', err);
        setError('Failed to load job roles');
        // Fallback to default job roles
        setJobRoles({
          "Technology": {
            "Software Engineer": {
              "description": "Develop software applications and systems",
              "required_skills": ["JavaScript", "Python", "React", "Node.js", "Git"]
            },
            "Data Scientist": {
              "description": "Analyze and interpret complex data",
              "required_skills": ["Python", "R", "SQL", "Machine Learning", "Statistics"]
            },
            "Frontend Developer": {
              "description": "Build user interfaces and web applications",
              "required_skills": ["HTML", "CSS", "JavaScript", "React", "Vue.js"]
            },
            "Backend Developer": {
              "description": "Develop server-side applications and APIs",
              "required_skills": ["Python", "Java", "Node.js", "SQL", "REST APIs"]
            }
          },
          "Healthcare": {
            "Nurse": {
              "description": "Provide patient care and support",
              "required_skills": ["Patient Care", "Medical Procedures", "Communication", "Teamwork"]
            },
            "Doctor": {
              "description": "Diagnose and treat patients",
              "required_skills": ["Medical Knowledge", "Diagnosis", "Patient Care", "Communication"]
            }
          },
          "Finance": {
            "Financial Analyst": {
              "description": "Analyze financial data and trends",
              "required_skills": ["Excel", "Financial Modeling", "Analysis", "Accounting"]
            },
            "Accountant": {
              "description": "Manage financial records and transactions",
              "required_skills": ["Accounting", "Tax Preparation", "Financial Reporting", "Excel"]
            }
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchJobRoles();
  }, []);

  const getCategories = () => Object.keys(jobRoles);
  
  const getRolesByCategory = (category) => {
    return jobRoles[category] ? Object.keys(jobRoles[category]) : [];
  };
  
  const getRoleInfo = (category, role) => {
    return jobRoles[category]?.[role] || null;
  };

  const value = {
    jobRoles,
    loading,
    error,
    getCategories,
    getRolesByCategory,
    getRoleInfo
  };

  return (
    <JobRolesContext.Provider value={value}>
      {children}
    </JobRolesContext.Provider>
  );
}; 