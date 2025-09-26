import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import ResumeChart from '../components/ResumeChart';
import axios from 'axios';
import { 
  BarChart3, 
  TrendingUp, 
  FileText,
  Award,
  Activity,
  Download,
  Calendar,
  CheckCircle,
  Clock
} from 'lucide-react';const Dashboard = () => {
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

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch real analyses from backend (current user and fallback legacy default_user)
      const currentUserId = (user?.uid) || (user?.email) || (user?.displayName) || (JSON.parse(localStorage.getItem('authUser') || 'null')?.uid) || 'Vyom1184';
      const [respPrimary, respFallback] = await Promise.all([
        axios.get(`/user-analyses/${currentUserId}`),
        axios.get(`/user-analyses/default_user`).catch(() => ({ data: { analyses: [] } }))
      ]);
      const analyses = [...(respPrimary.data.analyses || []), ...(respFallback?.data?.analyses || [])];
      
      // Transform backend data to frontend format
      const transformedAnalyses = analyses.map((analysis, index) => ({
        id: analysis.id,
        resumeId: analysis.id,
        score: analysis.analysis_result.ats_score,
        atsScore: analysis.analysis_result.ats_score,
        keywordMatch: analysis.analysis_result.keyword_match.score,
        formatScore: analysis.analysis_result.format_score,
        sectionScore: analysis.analysis_result.section_score,
        date: new Date(analysis.created_at).toLocaleDateString(),
        recommendations: analysis.analysis_result.suggestions || [],
        analysis_type: analysis.analysis_type
      }));

      // Create resume list from analyses
      const resumes = analyses.map((analysis, index) => ({
        id: analysis.id,
        title: analysis.resume_name || `Resume ${index + 1}`,
        jobRole: analysis.job_role,
        createdAt: new Date(analysis.created_at).toLocaleDateString(),
        updatedAt: new Date(analysis.created_at).toLocaleDateString(),
        template: analysis.analysis_type === 'ai' ? 'AI Enhanced' : 'Standard',
        status: 'active'
      }));

      setUserResumes(resumes);
      setResumeAnalyses(transformedAnalyses);

      // Calculate stats
      const totalResumes = resumes.length;
      const totalAnalyses = transformedAnalyses.length;
      const scores = transformedAnalyses.map(a => a.score);
      const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
      const bestScore = scores.length > 0 ? Math.max(...scores) : 0;

      // Sort analyses by date (newest first) for recent activity
      const sortedAnalyses = [...transformedAnalyses].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA; // Newest first
      });

      setStats({ 
        totalResumes, 
        totalAnalyses, 
        averageScore, 
        bestScore, 
        recentActivity: sortedAnalyses.slice(0, 3) 
      });

    } catch (error) {
      console.error('Error fetching user data:', error);
      // Fallback to empty state
      setUserResumes([]);
      setResumeAnalyses([]);
      setStats({
        totalResumes: 0,
        totalAnalyses: 0,
        averageScore: 0,
        bestScore: 0,
        recentActivity: []
      });
    } finally {
      setLoading(false);
    }
  }, [user?.uid, user?.email, user?.displayName]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Welcome back, {user?.displayName || 'User'}!</h1>
          <p className="text-xl text-gray-300">Track your resume performance and analytics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="card">
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

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="card">
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

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Average Score</p>
                <p className={`text-3xl font-bold ${getScoreColor(stats.averageScore)}`}>{stats.averageScore}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp size={24} className="text-purple-400" />
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Best Score</p>
                <p className={`text-3xl font-bold ${getScoreColor(stats.bestScore)}`}>{stats.bestScore}%</p>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Award size={24} className="text-orange-400" />
              </div>
            </div>
          </motion.div>
        </div>

        {userResumes.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="card text-center py-12">
            <FileText size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">No Resumes Analyzed Yet</h3>
            <p className="text-gray-400 mb-6">Start by analyzing your first resume to see your dashboard data here.</p>
            <a href="/analyzer" className="btn btn-primary">Analyze Resume</a>
          </motion.div>
        ) : (
          <>
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Resume List */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="card">
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
                            <span className={`px-2 py-1 rounded-full text-xs ${resume.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{resume.status}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                          <span className="flex items-center gap-1"><Calendar size={14} />Created: {resume.createdAt}</span>
                          <span className="flex items-center gap-1"><Clock size={14} />Updated: {resume.updatedAt}</span>
                        </div>
                        {analysis && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-400">Score:</span>
                              <span className={`font-semibold ${getScoreColor(analysis.score)}`}>{analysis.score}%</span>
                              <span className={`px-2 py-1 rounded-full text-xs ${getScoreBadge(analysis.score).color}`}>{getScoreBadge(analysis.score).text}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button onClick={async () => {
                                try {
                                  const res = await axios.get(`/download-resume/${resume.id}`, { responseType: 'blob' });
                                  const blob = new Blob([res.data]);
                                  const url = window.URL.createObjectURL(blob);
                                  const link = document.createElement('a');
                                  const safeName = (resume.title || 'resume').toString().replace(/\s+/g, '_');
                                  link.href = url;
                                  link.setAttribute('download', safeName);
                                  document.body.appendChild(link);
                                  link.click();
                                  link.remove();
                                  window.URL.revokeObjectURL(url);
                                } catch (e) {
                                  console.error('Download failed', e);
                                }
                              }} className="p-2 bg-green-500/20 rounded-lg hover:bg-green-500/30 transition-colors"><Download size={16} className="text-green-400" /></button>
                            </div>
                          </div>
                        )}
                        <div className="mt-3 pt-3 border-t border-white/10">
                          <span className="text-xs text-gray-500">Type: {resume.template}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.6 }} className="card">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Activity size={20} />
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {stats.recentActivity.map((activity, index) => {
                    const resume = userResumes.find(r => r.id === activity.resumeId);
                    return (
                      <div key={index} className="flex items-center gap-3 p-3 bg-black/20 rounded-lg">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center"><BarChart3 size={16} className="text-blue-400" /></div>
                        <div className="flex-1">
                          <p className="font-medium text-white">{resume?.title || 'Resume'} analyzed</p>
                          <p className="text-sm text-gray-400">Score: {activity.score}% • {activity.date}</p>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs ${getScoreBadge(activity.score).color}`}>{getScoreBadge(activity.score).text}</div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Job Role Distribution within Recent Activity */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <Award size={16} />
                    Job Role Distribution
                  </h4>
                  <div className="h-48">
                    <ResumeChart 
                      type="doughnut" 
                      data={{
                        labels: [...new Set(userResumes.map(r => r.jobRole))],
                        datasets: [{
                          data: [...new Set(userResumes.map(r => r.jobRole))].map(role => 
                            userResumes.filter(r => r.jobRole === role).length
                          ),
                          backgroundColor: [
                            'rgba(59, 130, 246, 0.8)',   // Blue
                            'rgba(34, 197, 94, 0.8)',    // Green
                            'rgba(234, 179, 8, 0.8)',    // Yellow
                            'rgba(249, 115, 22, 0.8)',   // Orange
                            'rgba(168, 85, 247, 0.8)',   // Purple
                            'rgba(236, 72, 153, 0.8)'    // Pink
                          ],
                          borderColor: [
                            'rgb(59, 130, 246)',
                            'rgb(34, 197, 94)',
                            'rgb(234, 179, 8)',
                            'rgb(249, 115, 22)',
                            'rgb(168, 85, 247)',
                            'rgb(236, 72, 153)'
                          ],
                          borderWidth: 2
                        }]
                      }}
                      options={{
                        plugins: {
                          title: {
                            display: false
                          },
                          legend: {
                            position: 'bottom',
                            labels: {
                              color: '#ffffff',
                              padding: 15,
                              usePointStyle: true,
                              font: { size: 12 }
                            }
                          }
                        },
                        responsive: true,
                        maintainAspectRatio: false
                      }}
                    />
                  </div>
                </div>

                {/* Performance Insights */}
                <div className="mt-12 pt-12 border-t border-white/10">
                  <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <TrendingUp size={16} />
                    Performance Insights
                  </h4>
                  
                  {/* Keyword Impact Analysis */}
                  <div className="mb-6 p-4 bg-black/20 rounded-lg">
                    <h5 className="text-md font-medium mb-3 text-blue-400 flex items-center gap-2">
                      <BarChart3 size={14} />
                      Keyword Impact Analysis
                    </h5>
                    {resumeAnalyses.length > 0 && (() => {
                      const latestAnalysis = resumeAnalyses[0];
                      const keywordImpact = latestAnalysis.keywordMatch > 60 ? 'positive' : 'negative';
                      const impactText = keywordImpact === 'positive' 
                        ? `Your ${latestAnalysis.keywordMatch}% keyword match is contributing well to your ${latestAnalysis.atsScore}% ATS score.`
                        : `Your ${latestAnalysis.keywordMatch}% keyword match is limiting your ATS score potential. Consider adding more role-specific keywords.`;
                      return (
                        <p className="text-sm text-gray-300">{impactText}</p>
                      );
                    })()}
                  </div>

                  {/* Section Performance Breakdown */}
                  <div className="mb-6 p-4 bg-black/20 rounded-lg">
                    <h5 className="text-md font-medium mb-3 text-green-400 flex items-center gap-2">
                      <Award size={14} />
                      Section Performance
                    </h5>
                    {resumeAnalyses.length > 0 && (() => {
                      const latestAnalysis = resumeAnalyses[0];
                      const sections = [
                        { name: 'ATS Score', score: latestAnalysis.atsScore },
                        { name: 'Keyword Match', score: latestAnalysis.keywordMatch },
                        { name: 'Format Score', score: latestAnalysis.formatScore },
                        { name: 'Section Score', score: latestAnalysis.sectionScore }
                      ];
                      const bestSection = sections.reduce((best, current) => current.score > best.score ? current : best);
                      const worstSection = sections.reduce((worst, current) => current.score < worst.score ? current : worst);
                      
                      return (
                        <div className="text-sm text-gray-300">
                          <p className="mb-2">Strongest: <span className="text-green-400">{bestSection.name} ({bestSection.score}%)</span></p>
                          <p>Needs improvement: <span className="text-yellow-400">{worstSection.name} ({worstSection.score}%)</span></p>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Resume Length Analysis */}
                  <div className="mb-4 p-4 bg-black/20 rounded-lg">
                    <h5 className="text-md font-medium mb-3 text-yellow-400 flex items-center gap-2">
                      <FileText size={14} />
                      Length Optimization
                    </h5>
                    {resumeAnalyses.length > 0 && (() => {
                      const latestAnalysis = resumeAnalyses[0];
                      const estimatedWords = 300 + (latestAnalysis.score * 5);
                      const lengthStatus = estimatedWords > 500 ? 'long' : estimatedWords < 300 ? 'short' : 'optimal';
                      const lengthAdvice = lengthStatus === 'long' 
                        ? `Your resume appears to be around ${estimatedWords} words, which might be too lengthy. Consider condensing to 400-500 words for better ATS performance.`
                        : lengthStatus === 'short'
                        ? `Your resume appears to be around ${estimatedWords} words, which might be too brief. Consider adding more details to reach 400-500 words.`
                        : `Your resume length appears optimal at around ${estimatedWords} words, contributing to your ${latestAnalysis.score}% score.`;
                      
                      return (
                        <p className="text-sm text-gray-300">{lengthAdvice}</p>
                      );
                    })()}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Performance Charts */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.7 }} className="card mb-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><TrendingUp size={20} />Performance Overview</h3>
              <div className="mb-6">
                <h4 className="text-lg font-medium mb-4">Score Distribution</h4>
                <ResumeChart type="bar" data={{ labels: ['90-100','80-89','70-79','60-69','0-59'], datasets: [{ label: 'Number of Resumes', data: [resumeAnalyses.filter(a=>a.score>=90).length,resumeAnalyses.filter(a=>a.score>=80&&a.score<90).length,resumeAnalyses.filter(a=>a.score>=70&&a.score<80).length,resumeAnalyses.filter(a=>a.score>=60&&a.score<70).length,resumeAnalyses.filter(a=>a.score<60).length], backgroundColor:['rgba(34, 197, 94, 0.8)','rgba(59, 130, 246, 0.8)','rgba(234, 179, 8, 0.8)','rgba(249, 115, 22, 0.8)','rgba(239, 68, 68, 0.8)'], borderColor:['rgb(34, 197, 94)','rgb(59, 130, 246)','rgb(234, 179, 8)','rgb(249, 115, 22)','rgb(239, 68, 68)'], borderWidth:2 }] }} options={{ plugins:{ title:{ display:true, text:'Resume Score Distribution', color:'#ffffff', font:{ size:16 } } } }} />
              </div>
              <div className="mb-6">
                <h4 className="text-lg font-medium mb-4">Score Trend Over Time</h4>
                <ResumeChart type="line" data={{ labels: resumeAnalyses.map(a=>a.date).reverse(), datasets:[{ label:'Resume Score', data: resumeAnalyses.map(a=>a.score).reverse(), borderColor:'rgb(59, 130, 246)', backgroundColor:'rgba(59, 130, 246, 0.1)', borderWidth:3, fill:true, tension:0.4 }] }} options={{ plugins:{ title:{ display:true, text:'Score Progression', color:'#ffffff', font:{ size:16 } } }, scales:{ y:{ beginAtZero:true, max:100 } } }} />
              </div>
              <div className="mb-6">
                <h4 className="text-lg font-medium mb-4">Score Categories Breakdown</h4>
                <ResumeChart type="radar" data={{ labels:['ATS Score','Keyword Match','Format Score','Section Score'], datasets:[{ label:'Average Scores', data:[ Math.round(resumeAnalyses.reduce((s,a)=>s+a.atsScore,0)/resumeAnalyses.length), Math.round(resumeAnalyses.reduce((s,a)=>s+a.keywordMatch,0)/resumeAnalyses.length), Math.round(resumeAnalyses.reduce((s,a)=>s+a.formatScore,0)/resumeAnalyses.length), Math.round(resumeAnalyses.reduce((s,a)=>s+a.sectionScore,0)/resumeAnalyses.length) ], backgroundColor:'rgba(34, 197, 94, 0.2)', borderColor:'rgb(34, 197, 94)', borderWidth:2, pointBackgroundColor:'rgb(34, 197, 94)', pointBorderColor:'#ffffff', pointBorderWidth:2 }] }} options={{ plugins:{ title:{ display:true, text:'Performance by Category', color:'#ffffff', font:{ size:16 } } }, scales:{ r:{ beginAtZero:true, max:100, ticks:{ color:'#9ca3af', backdropColor:'transparent' }, grid:{ color:'rgba(255,255,255,0.1)' }, pointLabels:{ color:'#ffffff' } } } }} />
              </div>

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
                            <p className={`font-bold ${getScoreColor(analysis.score)}`}>{analysis.score}%</p>
                            <div className="flex items-center gap-2 text-xs text-gray-400"><span>ATS: {analysis.atsScore}%</span><span>Keywords: {analysis.keywordMatch}%</span></div>
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
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard; 

