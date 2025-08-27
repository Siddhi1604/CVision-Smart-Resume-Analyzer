import React from 'react';
import { motion } from 'framer-motion';
import { 
  Github, 
  Linkedin, 
  Mail, 
  Users,
  Code,
  Zap,
  Shield,
  Heart
} from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Get instant analysis and feedback on your resume with our optimized AI algorithms.'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data is secure and never shared with third parties. We prioritize your privacy.'
    },
    {
      icon: Code,
      title: 'AI-Powered',
      description: 'Advanced machine learning models provide accurate and personalized recommendations.'
    },
    {
      icon: Users,
      title: 'User-Friendly',
      description: 'Intuitive interface designed for professionals at all technical levels.'
    }
  ];

  const stats = [
    { label: 'Resumes Analyzed', value: '10,000+' },
    { label: 'Happy Users', value: '5,000+' },
    { label: 'Success Rate', value: '95%' },
    { label: 'Countries', value: '50+' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About CVision</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Your intelligent career partner. We combine cutting-edge AI with intuitive design 
            to help job seekers at every career stage showcase their true potential.
          </p>
        </div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="card mb-12"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={32} className="text-green-400" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-gray-300 leading-relaxed max-w-4xl mx-auto">
              CVision represents our vision of democratizing career advancement through technology. 
              By combining cutting-edge AI with intuitive design, this platform empowers job seekers at 
              every career stage to showcase their true potential and stand out in today's competitive job market.
            </p>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="card text-center"
              >
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon size={24} className="text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {stats.map((stat, index) => (
            <div key={index} className="card text-center">
              <h3 className="text-3xl font-bold text-green-400 mb-2">{stat.value}</h3>
              <p className="text-gray-400">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="card text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Have questions, suggestions, or want to contribute? We'd love to hear from you!
          </p>
          <div className="flex justify-center gap-6">
            <a
              href="https://github.com/Siddhi1604/Smart-AI-Resume-Analyzer"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary flex items-center gap-2"
            >
              <Github size={16} />
              View on GitHub
            </a>
            <a
              href="mailto:22it084@charusat.edu.in"
              className="btn btn-primary flex items-center gap-2"
            >
              <Mail size={16} />
              Contact Us
            </a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default About; 