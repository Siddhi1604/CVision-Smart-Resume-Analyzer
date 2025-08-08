import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText,
  Target,
  Award,
  Activity
} from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/dashboard/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        // Mock data for demo
        setStats({
          totalResumes: 156,
          totalAnalyses: 89,
          averageScore: 78,
          topJobRoles: [
            { role: 'Software Engineer', count: 23 },
            { role: 'Data Scientist', count: 18 },
            { role: 'Frontend Developer', count: 15 },
            { role: 'Backend Developer', count: 12 }
          ],
          recentActivity: [
            { type: 'analysis', user: 'John Doe', score: 85, date: '2024-01-15' },
            { type: 'resume_built', user: 'Jane Smith', date: '2024-01-14' },
            { type: 'analysis', user: 'Mike Johnson', score: 72, date: '2024-01-13' }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
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
                <p className="text-3xl font-bold text-green-400">{stats?.totalResumes || 0}</p>
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
                <p className="text-3xl font-bold text-blue-400">{stats?.totalAnalyses || 0}</p>
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
                <p className="text-3xl font-bold text-purple-400">{stats?.averageScore || 0}%</p>
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
                <p className="text-sm text-gray-400 mb-1">Active Users</p>
                <p className="text-3xl font-bold text-orange-400">1,234</p>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Users size={24} className="text-orange-400" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Top Job Roles */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="card"
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Target size={20} />
              Top Job Roles
            </h3>
            <div className="space-y-4">
              {stats?.topJobRoles?.map((role, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-green-400">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{role.role}</p>
                      <p className="text-sm text-gray-400">{role.count} analyses</p>
                    </div>
                  </div>
                  <div className="w-16 h-2 bg-gray-700 rounded-full">
                    <div
                      className="h-2 bg-green-400 rounded-full"
                      style={{ width: `${(role.count / Math.max(...stats.topJobRoles.map(r => r.count))) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
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
              {stats?.recentActivity?.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-black/20 rounded-lg">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                    {activity.type === 'analysis' ? (
                      <BarChart3 size={16} className="text-blue-400" />
                    ) : (
                      <FileText size={16} className="text-green-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.user}</p>
                    <p className="text-sm text-gray-400">
                      {activity.type === 'analysis' ? 'Resume Analysis' : 'Resume Built'}
                      {activity.score && ` - Score: ${activity.score}%`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Performance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="card mt-8"
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp size={20} />
            Performance Overview
          </h3>
          <div className="h-64 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <BarChart3 size={48} className="mx-auto mb-4" />
              <p>Chart visualization would be implemented here</p>
              <p className="text-sm">Using Chart.js or similar library</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard; 