import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import ResumeChart from '../components/ResumeChart';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText,
  Target,
  Award,
  Activity,
  Download,
  Eye,
  Star,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [userResumes, setUserResumes] = useState([]);
  const [resumeAnalyses, setResumeAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalResumes: 0,
    totalAnalyses: 0,
    averageScore: 0,
    bestScore: 0,
    recentActivity: []
  });

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch user's resumes and analyses
      // For now, using mock data since we don't have a backend API
      const mockResumes = [
        {
          id: 1,
          title: 'Software Engineer Resume',
          jobRole: 'Software Engineer',
          createdAt: '2024-01-15',
          updatedAt: '2024-01-20',
          template: 'Modern',
          status: 'active'
        },
        {
          id: 2,
          title: 'Data Scientist Resume',
          jobRole: 'Data Scientist',
          createdAt: '2024-01-10',
          updatedAt: '2024-01-18',
          template: 'Professional',
          status: 'active'
        },
        {
          id: 3,
          title: 'Frontend Developer Resume',
          jobRole: 'Frontend Developer',
          createdAt: '2024-01-05',
          updatedAt: '2024-01-12',
          template: 'Creative',
          status: 'draft'
        }
      ];

      const mockAnalyses = [
        {
          id: 1,
          resumeId: 1,
          score: 85,
          atsScore: 88,
          keywordMatch: 82,
          formatScore: 90,
          sectionScore: 87,
          date: '2024-01-20',
          recommendations: [
            'Add more quantifiable achievements',
            'Include relevant certifications',
            'Optimize for ATS keywords'
          ]
        },
        {
          id: 2,
          resumeId: 2,
          score: 78,
          atsScore: 75,
          keywordMatch: 80,
          formatScore: 85,
          sectionScore: 72,
          date: '2024-01-18',
          recommendations: [
            'Strengthen summary section',
            'Add more technical skills',
            'Improve experience descriptions'
          ]
        },
        {
          id: 3,
          resumeId: 3,
          score: 92,
          atsScore: 95,
          keywordMatch: 90,
          formatScore: 88,
          sectionScore: 94,
          date: '2024-01-12',
          recommendations: [
            'Excellent resume structure',
            'Strong keyword optimization',
            'Consider adding certifications'
          ]
        }
      ];

      setUserResumes(mockResumes);
      setResumeAnalyses(mockAnalyses);

      // Calculate stats
      const totalResumes = mockResumes.length;
      const totalAnalyses = mockAnalyses.length;
      const scores = mockAnalyses.map(a => a.score);
      const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
      const bestScore = scores.length > 0 ? Math.max(...scores) : 0;

      setStats({
        totalResumes,
        totalAnalyses,
        averageScore,
        bestScore,
        recentActivity: mockAnalyses.slice(0, 3)
      });

    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-blue-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBadge = (score) => {
    if (score >= 90) return { text: 'Excellent', color: 'bg-green-500/20 text-green-400' };
    if (score >= 80) return { text: 'Good', color: 'bg-blue-500/20 text-blue-400' };
    if (score >= 70) return { text: 'Fair', color: 'bg-yellow-500/20 text-yellow-400' };
    return { text: 'Needs Work', color: 'bg-red-500/20 text-red-400' };
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full loading"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Welcome back, {user?.displayName || 'User'}!</h1>
          <p className="text-xl text-gray-300">
            Track your resume performance and analytics
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Resumes</p>
                <p className="text-3xl font-bold text-green-400">{stats.totalResumes}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <FileText size={24} className="text-green-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Analyses</p>
                <p className="text-3xl font-bold text-blue-400">{stats.totalAnalyses}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <BarChart3 size={24} className="text-blue-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Average Score</p>
                <p className={`text-3xl font-bold ${getScoreColor(stats.averageScore)}`}>
                  {stats.averageScore}%
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp size={24} className="text-purple-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Best Score</p>
                <p className={`text-3xl font-bold ${getScoreColor(stats.bestScore)}`}>
                  {stats.bestScore}%
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Award size={24} className="text-orange-400" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Resume List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="card"
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText size={20} />
              Your Resumes
            </h3>
            <div className="space-y-4">
              {userResumes.map((resume) => {
                const analysis = resumeAnalyses.find(a => a.resumeId === resume.id);
                return (
                  <div key={resume.id} className="p-4 bg-black/20 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-white">{resume.title}</h4>
                        <p className="text-sm text-gray-400">{resume.jobRole}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          resume.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {resume.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        Created: {resume.createdAt}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        Updated: {resume.updatedAt}
                      </span>
                    </div>

                    {analysis && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-400">Score:</span>
                          <span className={`font-semibold ${getScoreColor(analysis.score)}`}>
                            {analysis.score}%
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${getScoreBadge(analysis.score).color}`}>
                            {getScoreBadge(analysis.score).text}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 bg-blue-500/20 rounded-lg hover:bg-blue-500/30 transition-colors">
                            <Eye size={16} className="text-blue-400" />
                          </button>
                          <button className="p-2 bg-green-500/20 rounded-lg hover:bg-green-500/30 transition-colors">
                            <Download size={16} className="text-green-400" />
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="mt-3 pt-3 border-t border-white/10">
                      <span className="text-xs text-gray-500">Template: {resume.template}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="card"
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Activity size={20} />
              Recent Activity
            </h3>
            <div className="space-y-4">
              {stats.recentActivity.map((activity, index) => {
                const resume = userResumes.find(r => r.id === activity.resumeId);
                return (
                  <div key={index} className="flex items-center gap-3 p-3 bg-black/20 rounded-lg">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <BarChart3 size={16} className="text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white">
                        {resume?.title || 'Resume'} analyzed
                      </p>
                      <p className="text-sm text-gray-400">
                        Score: {activity.score}% • {activity.date}
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs ${getScoreBadge(activity.score).color}`}>
                      {getScoreBadge(activity.score).text}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Performance Charts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="card mb-8"
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp size={20} />
            Performance Overview
          </h3>
          
          {/* Score Distribution Chart */}
          <div className="mb-6">
            <h4 className="text-lg font-medium mb-4">Score Distribution</h4>
            <ResumeChart
              type="bar"
              data={{
                labels: ['90-100', '80-89', '70-79', '60-69', '0-59'],
                datasets: [{
                  label: 'Number of Resumes',
                  data: [
                    resumeAnalyses.filter(a => a.score >= 90).length,
                    resumeAnalyses.filter(a => a.score >= 80 && a.score < 90).length,
                    resumeAnalyses.filter(a => a.score >= 70 && a.score < 80).length,
                    resumeAnalyses.filter(a => a.score >= 60 && a.score < 70).length,
                    resumeAnalyses.filter(a => a.score < 60).length
                  ],
                  backgroundColor: [
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(234, 179, 8, 0.8)',
                    'rgba(249, 115, 22, 0.8)',
                    'rgba(239, 68, 68, 0.8)'
                  ],
                  borderColor: [
                    'rgb(34, 197, 94)',
                    'rgb(59, 130, 246)',
                    'rgb(234, 179, 8)',
                    'rgb(249, 115, 22)',
                    'rgb(239, 68, 68)'
                  ],
                  borderWidth: 2
                }]
              }}
              options={{
                plugins: {
                  title: {
                    display: true,
                    text: 'Resume Score Distribution',
                    color: '#ffffff',
                    font: { size: 16 }
                  }
                }
              }}
            />
          </div>

          {/* Score Trend Chart */}
          <div className="mb-6">
            <h4 className="text-lg font-medium mb-4">Score Trend Over Time</h4>
            <ResumeChart
              type="line"
              data={{
                labels: resumeAnalyses.map(a => a.date).reverse(),
                datasets: [{
                  label: 'Resume Score',
                  data: resumeAnalyses.map(a => a.score).reverse(),
                  borderColor: 'rgb(59, 130, 246)',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  borderWidth: 3,
                  fill: true,
                  tension: 0.4
                }]
              }}
              options={{
                plugins: {
                  title: {
                    display: true,
                    text: 'Score Progression',
                    color: '#ffffff',
                    font: { size: 16 }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100
                  }
                }
              }}
            />
          </div>

          {/* Score Categories Radar Chart */}
          <div className="mb-6">
            <h4 className="text-lg font-medium mb-4">Score Categories Breakdown</h4>
            <ResumeChart
              type="radar"
              data={{
                labels: ['ATS Score', 'Keyword Match', 'Format Score', 'Section Score'],
                datasets: [{
                  label: 'Average Scores',
                  data: [
                    Math.round(resumeAnalyses.reduce((sum, a) => sum + a.atsScore, 0) / resumeAnalyses.length),
                    Math.round(resumeAnalyses.reduce((sum, a) => sum + a.keywordMatch, 0) / resumeAnalyses.length),
                    Math.round(resumeAnalyses.reduce((sum, a) => sum + a.formatScore, 0) / resumeAnalyses.length),
                    Math.round(resumeAnalyses.reduce((sum, a) => sum + a.sectionScore, 0) / resumeAnalyses.length)
                  ],
                  backgroundColor: 'rgba(34, 197, 94, 0.2)',
                  borderColor: 'rgb(34, 197, 94)',
                  borderWidth: 2,
                  pointBackgroundColor: 'rgb(34, 197, 94)',
                  pointBorderColor: '#ffffff',
                  pointBorderWidth: 2
                }]
              }}
              options={{
                plugins: {
                  title: {
                    display: true,
                    text: 'Performance by Category',
                    color: '#ffffff',
                    font: { size: 16 }
                  }
                },
                scales: {
                  r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                      color: '#9ca3af',
                      backdropColor: 'transparent'
                    },
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)'
                    },
                    pointLabels: {
                      color: '#ffffff'
                    }
                  }
                }
              }}
            />
          </div>

          {/* Score Breakdown */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-medium mb-4">Score Breakdown</h4>
              <div className="space-y-3">
                {resumeAnalyses.map((analysis) => {
                  const resume = userResumes.find(r => r.id === analysis.resumeId);
                  return (
                    <div key={analysis.id} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                      <div>
                        <p className="font-medium text-white">{resume?.title || 'Resume'}</p>
                        <p className="text-sm text-gray-400">{analysis.date}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${getScoreColor(analysis.score)}`}>
                          {analysis.score}%
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <span>ATS: {analysis.atsScore}%</span>
                          <span>Keywords: {analysis.keywordMatch}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4">Top Recommendations</h4>
              <div className="space-y-3">
                {resumeAnalyses.flatMap(a => a.recommendations).slice(0, 5).map((rec, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-black/20 rounded-lg">
                    <CheckCircle size={16} className="text-green-400 mt-1 flex-shrink-0" />
                    <p className="text-sm text-gray-300">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard; 