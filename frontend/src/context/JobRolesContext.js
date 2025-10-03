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
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobRoles = async () => {
      try {
        console.log('Fetching job categories and roles...');
        
        // Fetch categories explicitly to populate the dropdown
        const [catsRes, rolesRes] = await Promise.all([
          axios.get('/job-categories'),
          axios.get('/job-roles'), // nested category -> role -> { description, required_skills }
        ]);

        console.log('Categories response:', catsRes.data);
        console.log('Roles response:', rolesRes.data);

        if (Array.isArray(catsRes.data?.categories)) {
          setCategories(catsRes.data.categories);
        }

        // Accept either nested object or { roles_by_category } shape
        const data = rolesRes.data || {};
        const nested = data.roles_by_category
          ? Object.fromEntries(
              Object.entries(data.roles_by_category).map(([cat, roles]) => [
                cat,
                Object.fromEntries((roles || []).map((r) => [r, { description: '', required_skills: [] }]))
              ])
            )
          : data;
        
        console.log('Processed job roles:', nested);
        setJobRoles(nested || {});
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

  const getCategories = () => (categories.length ? categories : Object.keys(jobRoles));
  
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