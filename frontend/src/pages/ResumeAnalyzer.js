import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { 
  Upload, 
  Search, 
  FileText, 
  CheckCircle, 
  TrendingUp,
  Target,
  Lightbulb
} from 'lucide-react';
import { useJobRoles } from '../context/JobRolesContext';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ResumeAnalyzer = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [jobCategory, setJobCategory] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [customJobDescription, setCustomJobDescription] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysisType, setAnalysisType] = useState('standard'); // 'standard' or 'ai'
  
  const { getCategories, getRolesByCategory, getRoleInfo, loading: rolesLoading } = useJobRoles();
  const { user } = useAuth();
  const userId = (user?.uid) || (user?.email) || (user?.displayName) || (JSON.parse(localStorage.getItem('authUser') || 'null')?.uid) || 'Vyom1184';

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      setSelectedFile(file);
      toast.success('File uploaded successfully!');
    } else {
      toast.error('Please upload a PDF or DOCX file.');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false
  });

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast.error('Please upload a resume file.');
      return;
    }

    if (!jobCategory || !jobRole) {
      toast.error('Please select a job category and role.');
      return;
    }

    setLoading(true);
    
    // For now, send JSON data instead of FormData since we don't have file upload handling
    const requestData = {
      job_category: jobCategory,
      job_role: jobRole,
      user_id: userId
    };
    
    if (customJobDescription) {
      requestData.custom_job_description = customJobDescription;
    }

    try {
      const endpoint = analysisType === 'ai' ? '/ai-analyze-resume' : '/analyze-resume';
      console.log('Sending analysis request to:', endpoint, requestData);
      
      const response = await axios.post(endpoint, requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Analysis response:', response.data);
      setAnalysis(response.data);
      toast.success('Analysis completed successfully!');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error(error.response?.data?.error || error.response?.data?.detail || 'Error analyzing resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreStatus = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Resume Analyzer</h1>
          <p className="text-xl text-gray-300">
            Get instant AI-powered feedback to optimize your resume
          </p>
        </div>

        {/* Analysis Type Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-black/20 rounded-lg p-1">
            <button
              onClick={() => setAnalysisType('standard')}
              className={`px-6 py-2 rounded-md transition-all ${
                analysisType === 'standard'
                  ? 'bg-green-500 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Standard Analyzer
            </button>
            <button
              onClick={() => setAnalysisType('ai')}
              className={`px-6 py-2 rounded-md transition-all ${
                analysisType === 'ai'
                  ? 'bg-green-500 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              AI Analyzer
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Upload and Settings */}
          <div className="space-y-6">
            {/* File Upload */}
            <div className="card">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Upload size={20} />
                Upload Resume
              </h3>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                  isDragActive
                    ? 'border-green-400 bg-green-500/10'
                    : 'border-gray-600 hover:border-green-400 hover:bg-green-500/5'
                }`}
              >
                <input {...getInputProps()} />
                <Upload size={48} className="mx-auto mb-4 text-gray-400" />
                {selectedFile ? (
                  <div>
                    <p className="text-green-400 font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-gray-400 mt-2">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-lg font-medium mb-2">
                      {isDragActive ? 'Drop the file here' : 'Drag & drop your resume here'}
                    </p>
                    <p className="text-gray-400">or click to browse</p>
                    <p className="text-sm text-gray-500 mt-2">Supports PDF and DOCX files</p>
                  </div>
                )}
              </div>
            </div>

            {/* Job Selection */}
            <div className="card">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Target size={20} />
                Job Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Job Category</label>
                  <select
                    value={jobCategory}
                    onChange={(e) => {
                      setJobCategory(e.target.value);
                      setJobRole('');
                    }}
                    className="w-full p-3 bg-black/20 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none"
                    disabled={rolesLoading}
                  >
                    <option value="">Select Category</option>
                    {getCategories().map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Job Role</label>
                  <select
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    className="w-full p-3 bg-black/20 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none"
                    disabled={!jobCategory || rolesLoading}
                  >
                    <option value="">Select Role</option>
                    {getRolesByCategory(jobCategory).map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

                {jobRole && (
                  <div className="p-4 bg-black/20 rounded-lg">
                    <h4 className="font-medium mb-2">{jobRole}</h4>
                    <p className="text-sm text-gray-300 mb-2">
                      {getRoleInfo(jobCategory, jobRole)?.description}
                    </p>
                    <div>
                      <p className="text-sm font-medium mb-1">Required Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {getRoleInfo(jobCategory, jobRole)?.required_skills?.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded"
                          >
                            {skill}
                          </span>
                        )) || <span className="text-gray-400 text-xs">No skills data available</span>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Custom Job Description */}
            {analysisType === 'ai' && (
              <div className="card">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Lightbulb size={20} />
                  Custom Job Description (Optional)
                </h3>
                <textarea
                  value={customJobDescription}
                  onChange={(e) => setCustomJobDescription(e.target.value)}
                  placeholder="Paste the job description here for more targeted analysis..."
                  className="w-full p-3 bg-black/20 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none resize-none"
                  rows={4}
                />
                <p className="text-sm text-gray-400 mt-2">
                  Including the actual job description significantly improves analysis accuracy.
                </p>
              </div>
            )}

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={loading || !selectedFile || !jobCategory || !jobRole}
              className="w-full btn btn-primary text-lg py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full loading"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Search size={20} />
                  Analyze Resume
                </>
              )}
            </button>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {analysis ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                {/* ATS Score */}
                <div className="card">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp size={20} />
                    ATS Score
                  </h3>
                  <div className="text-center">
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                        <circle
                          cx="60"
                          cy="60"
                          r="54"
                          fill="none"
                          stroke="#1a1a2e"
                          strokeWidth="8"
                        />
                        <circle
                          cx="60"
                          cy="60"
                          r="54"
                          fill="none"
                          stroke={analysis.ats_score >= 80 ? '#4CAF50' : analysis.ats_score >= 60 ? '#FFA500' : '#FF4444'}
                          strokeWidth="8"
                          strokeDasharray={`${(analysis.ats_score / 100) * 339.292} 339.292`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-2xl font-bold ${getScoreColor(analysis.ats_score)}`}>
                          {analysis.ats_score}%
                        </span>
                      </div>
                    </div>
                    <p className={`text-lg font-medium ${getScoreColor(analysis.ats_score)}`}>
                      {getScoreStatus(analysis.ats_score)}
                    </p>
                  </div>
                </div>

                {/* Skills Match */}
                <div className="card">
                  <h3 className="text-xl font-semibold mb-4">Skills Match</h3>
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span>Keyword Match</span>
                      <span className="text-green-400 font-medium">
                        {analysis.keyword_match?.score || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${analysis.keyword_match?.score || 0}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {analysis.missing_skills && analysis.missing_skills.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2 text-yellow-400">Missing Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {analysis.missing_skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Format Analysis */}
                <div className="card">
                  <h3 className="text-xl font-semibold mb-4">Format Analysis</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Format Score</p>
                      <p className="text-2xl font-bold text-green-400">
                        {analysis.format_score || 0}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Section Score</p>
                      <p className="text-2xl font-bold text-green-400">
                        {analysis.section_score || 0}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Suggestions */}
                {analysis.suggestions && analysis.suggestions.length > 0 && (
                  <div className="card">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <CheckCircle size={20} />
                      Improvement Suggestions
                    </h3>
                    <div className="space-y-3">
                      {analysis.suggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle size={16} className="text-green-400 mt-1 flex-shrink-0" />
                          <p className="text-sm text-gray-300">{suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="card h-full flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <FileText size={48} className="mx-auto mb-4" />
                  <p>Upload a resume and select job details to see analysis results</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResumeAnalyzer; 