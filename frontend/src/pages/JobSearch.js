import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Building, 
  Clock,
  DollarSign,
  Filter,
  Star
} from 'lucide-react';

const JobSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [experience, setExperience] = useState('');

  // Mock job data
  const jobs = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$120,000 - $150,000',
      experience: '5+ years',
      description: 'We are looking for a Senior Software Engineer to join our growing team...',
      posted: '2 days ago',
      logo: 'TC'
    },
    {
      id: 2,
      title: 'Frontend Developer',
      company: 'StartupXYZ',
      location: 'Remote',
      type: 'Full-time',
      salary: '$80,000 - $100,000',
      experience: '2-4 years',
      description: 'Join our dynamic team as a Frontend Developer and help build amazing user experiences...',
      posted: '1 week ago',
      logo: 'SX'
    },
    {
      id: 3,
      title: 'Data Scientist',
      company: 'DataFlow Analytics',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '$110,000 - $130,000',
      experience: '3-5 years',
      description: 'We are seeking a talented Data Scientist to help us extract insights from large datasets...',
      posted: '3 days ago',
      logo: 'DF'
    },
    {
      id: 4,
      title: 'DevOps Engineer',
      company: 'CloudTech Solutions',
      location: 'Austin, TX',
      type: 'Full-time',
      salary: '$95,000 - $115,000',
      experience: '3+ years',
      description: 'Join our DevOps team and help us build scalable infrastructure solutions...',
      posted: '5 days ago',
      logo: 'CT'
    }
  ];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !location || job.location.toLowerCase().includes(location.toLowerCase());
    const matchesType = !jobType || job.type === jobType;
    const matchesExperience = !experience || job.experience.includes(experience);
    
    return matchesSearch && matchesLocation && matchesType && matchesExperience;
  });

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
            Find your next career opportunity
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
                  placeholder="Job title, company, or keywords"
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
                <option value="Entry">Entry Level</option>
                <option value="Mid">Mid Level</option>
                <option value="Senior">Senior Level</option>
                <option value="Lead">Lead</option>
              </select>
            </div>

            <div className="flex items-end">
              <button className="w-full btn btn-primary flex items-center justify-center gap-2">
                <Filter size={16} />
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          {filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card hover:border-green-400/30 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-green-400 font-bold">{job.logo}</span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{job.title}</h3>
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
                    <button className="text-gray-400 hover:text-yellow-400">
                      <Star size={16} />
                    </button>
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
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
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
        {filteredJobs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mt-8"
          >
            <button className="btn btn-secondary">
              Load More Jobs
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default JobSearch; 