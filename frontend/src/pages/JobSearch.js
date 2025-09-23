import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Building, 
  Clock,
  DollarSign,
  Filter,
  Star,
  Loader2,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import axios from 'axios';

const JobSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [experience, setExperience] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMoreJobs, setHasMoreJobs] = useState(false);

  // Fetch jobs from API
  const fetchJobs = async (page = 0, resetJobs = false) => {
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
      const { jobs: newJobs, page_count } = response.data;
      
      if (resetJobs) {
        setJobs(newJobs);
      } else {
        setJobs(prevJobs => [...prevJobs, ...newJobs]);
      }
      
      setTotalPages(page_count);
      setCurrentPage(page);
      setHasMoreJobs(page < page_count - 1);
      
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError(err.response?.data?.detail || 'Failed to fetch jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchJobs(0, true);
  }, []);

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
      window.open(job.landing_page, '_blank', 'noopener,noreferrer');
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
          <h1 className="text-4xl font-bold mb-4">Job Search</h1>
          <p className="text-xl text-gray-300">
            Find your next career opportunity with our curated job listings
          </p>
        </div>

        {/* Search Filters */}
        <div className="card mb-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search Jobs</label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Job title or keywords"
                  className="w-full pl-10 pr-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, state, or remote"
                  className="w-full pl-10 pr-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Job Type</label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full p-3 bg-black/20 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none"
              >
                <option value="">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Experience Level</label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full p-3 bg-black/20 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none"
              >
                <option value="">All Levels</option>
                <option value="Entry Level">Entry Level</option>
                <option value="Mid Level">Mid Level</option>
                <option value="Senior Level">Senior Level</option>
                <option value="Lead">Lead</option>
              </select>
            </div>

            <div className="flex items-end">
              <button 
                onClick={handleSearch}
                disabled={loading}
                className="w-full btn btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Filter size={16} />}
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card border-red-500/30 bg-red-500/10 mb-8"
          >
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="text-red-400" />
              <div>
                <h3 className="text-red-400 font-semibold">Error</h3>
                <p className="text-red-300">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Job Listings */}
        <div className="space-y-6">
          {jobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card hover:border-green-400/30 transition-all duration-300 cursor-pointer group"
              onClick={() => handleJobClick(job)}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-green-400 font-bold">{job.logo}</span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-semibold mb-1 group-hover:text-green-400 transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Building size={14} />
                          {job.company}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          {job.location}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                    <button className="text-gray-400 hover:text-yellow-400">
                      <Star size={16} />
                    </button>
                      {job.landing_page && (
                        <ExternalLink size={16} className="text-gray-400 group-hover:text-green-400 transition-colors" />
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-4 line-clamp-2">{job.description}</p>
                  
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-1 text-green-400">
                      <Briefcase size={14} />
                      {job.type}
                    </div>
                    <div className="flex items-center gap-1 text-blue-400">
                      <DollarSign size={14} />
                      {job.salary}
                    </div>
                    <div className="flex items-center gap-1 text-purple-400">
                      <Clock size={14} />
                      {job.experience}
                    </div>
                    <div className="text-gray-400">
                      {job.posted}
                    </div>
                  </div>

                  {/* Job Categories/Tags */}
                  {(job.categories?.length > 0 || job.tags?.length > 0) && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {job.categories?.slice(0, 3).map((category, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                          {category}
                        </span>
                      ))}
                      {job.tags?.slice(0, 2).map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Loading State */}
        {loading && jobs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Loader2 size={48} className="mx-auto mb-4 text-green-400 animate-spin" />
            <h3 className="text-xl font-semibold mb-2">Loading jobs...</h3>
            <p className="text-gray-400">Please wait while we fetch the latest opportunities</p>
          </motion.div>
        )}

        {/* No Jobs Found */}
        {!loading && jobs.length === 0 && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Search size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
            <p className="text-gray-400">Try adjusting your search criteria</p>
          </motion.div>
        )}

        {/* Load More Button */}
        {hasMoreJobs && jobs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mt-8"
          >
            <button 
              onClick={loadMoreJobs}
              disabled={loading}
              className="btn btn-secondary disabled:opacity-50 flex items-center gap-2 mx-auto"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Loading...
                </>
              ) : (
                'Load More Jobs'
              )}
            </button>
          </motion.div>
        )}

        {/* Pagination Info */}
        {jobs.length > 0 && (
          <div className="text-center mt-6 text-sm text-gray-400">
            Showing {jobs.length} jobs • Page {currentPage + 1} of {totalPages}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default JobSearch; 