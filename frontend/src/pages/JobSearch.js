import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Clock, 
  DollarSign,
  ExternalLink
} from 'lucide-react';
import axios from 'axios';

const JobSearch = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('All Types');
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMoreJobs, setHasMoreJobs] = useState(false);

  // Fetch jobs from API
  const fetchJobs = useCallback(async (page = 0, resetJobs = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        page: page.toString()
      });

      // Add search filters for GitHub Jobs API
      if (searchTerm) params.append('keyword', searchTerm);
      if (location) params.append('location', location);
      if (jobType && jobType !== 'All Types') {
        // Convert job type to GitHub Jobs format
        const jobTypeMap = {
          'Full-time': 'full_time',
          'Part-time': 'part_time',
          'Contract': 'contract',
          'Internship': 'internship'
        };
        params.append('job_type', jobTypeMap[jobType] || 'full_time');
      }

      const response = await axios.get(`/api/jobs?${params}`);
      console.log('Job search response:', response.data);
      
      if (!response.data || !response.data.jobs) {
        throw new Error('Invalid response format from server');
      }
      
      const { jobs: newJobs, page_count } = response.data;
      
      if (resetJobs) {
        setJobs(newJobs);
      } else {
        setJobs(prevJobs => [...prevJobs, ...newJobs]);
      }
      
      setCurrentPage(page);
      setHasMoreJobs(page < page_count - 1);
      
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError(err.response?.data?.detail || 'Failed to fetch jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, location, jobType]);

  // Initial load
  useEffect(() => {
    fetchJobs(0, true);
  }, [fetchJobs]);

  // Handle search
  const handleSearch = () => {
    fetchJobs(0, true);
  };

  // Load more jobs
  const loadMoreJobs = () => {
    if (!loading && hasMoreJobs) {
      fetchJobs(currentPage + 1, false);
    }
  };

  // Handle job click to open external link
  const handleJobClick = (job) => {
    if (job.landing_page) {
      window.open(job.landing_page, '_blank');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Find Your Dream Job</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover opportunities that match your skills and career goals
          </p>
        </div>

        {/* Search Filters */}
        <div className="card mb-8">
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Keywords</label>
              <input
                type="text"
                placeholder="e.g., Software Engineer"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                placeholder="e.g., San Francisco, CA"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Job Type</label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="All Types">All Types</option>
                <option value="Full-time">Full Time</option>
                <option value="Part-time">Part Time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                disabled={loading}
                className="btn btn-primary w-full flex items-center justify-center gap-2"
              >
                <Search size={16} />
                {loading ? 'Searching...' : 'Search Jobs'}
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="card mb-6 bg-red-500/10 border-red-500/20">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Jobs List */}
        <div className="space-y-6">
          {jobs && jobs.length > 0 && jobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="card hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => handleJobClick(job)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-green-400 font-bold text-lg">
                        {job.logo || job.company?.charAt(0) || 'J'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{job.title}</h3>
                      <p className="text-gray-400">{job.company}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-300 mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase size={14} />
                      {job.type}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {job.posted}
                    </div>
                    {job.salary && (
                      <div className="flex items-center gap-1">
                        <DollarSign size={14} />
                        {job.salary}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-300 mb-4 line-clamp-2">
                    {job.description}
                  </p>
                  
                  {job.tags && job.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.tags.slice(0, 5).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <a
                    href={job.landing_page}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary flex items-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink size={14} />
                    Apply Now
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More Button */}
        {hasMoreJobs && jobs.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={loadMoreJobs}
              disabled={loading}
              className="btn btn-secondary"
            >
              {loading ? 'Loading...' : 'Load More Jobs'}
            </button>
          </div>
        )}

        {/* No Jobs Message */}
        {!loading && jobs.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
            <p className="text-gray-400">
              Try adjusting your search criteria or check back later for new opportunities.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default JobSearch;