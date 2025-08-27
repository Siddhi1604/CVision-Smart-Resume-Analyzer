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
        setJobRoles({});
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