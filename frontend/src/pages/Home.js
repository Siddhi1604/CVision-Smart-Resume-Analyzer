import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  FileText, 
  BarChart3, 
  Briefcase, 
  Zap, 
  Shield, 
  Users,
  ArrowRight
} from 'lucide-react';
import BeamsBackground from '../components/BeamsBackground';
import { TypingHero } from '../components/TypingHero';

const Home = () => {
  const features = [
    {
      icon: Search,
      title: 'AI-Powered Analysis',
      description: 'Get detailed insights and recommendations to optimize your resume for ATS systems.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: FileText,
      title: 'Smart Resume Builder',
      description: 'Create professional resumes with customizable templates and AI-powered suggestions.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Track your resume performance and get insights into your career progress.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Briefcase,
      title: 'Job Search Integration',
      description: 'Find relevant job opportunities and match your resume to specific positions.',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const benefits = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Get instant analysis and feedback on your resume'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data is secure and never shared with third parties'
    },
    {
      icon: Users,
      title: 'Expert Insights',
      description: 'Powered by advanced AI models and industry expertise'
    }
  ];

  return (
    <div className="min-h-screen relative">
      {/* Animated Beams Background - Full Page */}
      <BeamsBackground intensity="medium" />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                CVision
              </span>
            </h1>
            <TypingHero />
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/analyzer"
                className="btn btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2"
              >
                <Search size={20} />
                Resume Analyzer
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/builder"
                className="btn btn-secondary text-lg px-8 py-4 flex items-center justify-center gap-2"
              >
                <FileText size={20} />
                Resume Builder
              </Link>
              <Link
                to="/job-search"
                className="btn btn-secondary text-lg px-8 py-4 flex items-center justify-center gap-2"
              >
                <Briefcase size={20} />
                Job Search
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Background decoration - reduced opacity to work with beams */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to create a standout resume and advance your career
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="card hover:border-green-500/30 transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-black/20 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Why Choose CVision?</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Built with cutting-edge technology to give you the competitive edge
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Icon size={32} className="text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                  <p className="text-gray-300">{benefit.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Career?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have already optimized their resumes 
              and landed their dream jobs with CVision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/analyzer"
                className="btn btn-primary text-lg px-8 py-4 inline-flex items-center gap-2"
              >
                <Search size={20} />
                Resume Analyzer
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/builder"
                className="btn btn-secondary text-lg px-8 py-4 inline-flex items-center gap-2"
              >
                <FileText size={20} />
                Resume Builder
              </Link>
              <Link
                to="/job-search"
                className="btn btn-secondary text-lg px-8 py-4 inline-flex items-center gap-2"
              >
                <Briefcase size={20} />
                Job Search
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home; 