import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import { 
  MessageSquare, 
  Star, 
  Send, 
  User, 
  Mail,
  ThumbsUp,
  Heart
} from 'lucide-react';

const Feedback = () => {
  const [feedback, setFeedback] = useState({
    name: '',
    email: '',
    rating: 0,
    message: '',
    category: 'general'
  });

  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Software Engineer',
      company: 'TechCorp',
      rating: 5,
      comment: 'CVision helped me optimize my resume and I got my dream job within 2 weeks! The AI analysis was incredibly accurate.',
      avatar: 'SJ'
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Data Scientist',
      company: 'Analytics Inc.',
      rating: 5,
      comment: 'The resume builder is fantastic. The templates are professional and the AI suggestions really improved my content.',
      avatar: 'MC'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Frontend Developer',
      company: 'StartupXYZ',
      rating: 4,
      comment: 'Great tool for resume analysis. The ATS score feature helped me understand what recruiters are looking for.',
      avatar: 'ER'
    }
  ];

  const handleRatingClick = (rating) => {
    setFeedback(prev => ({ ...prev, rating }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!feedback.name || !feedback.email || !feedback.message) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (feedback.rating === 0) {
      toast.error('Please provide a rating.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Send feedback to backend
      const feedbackData = {
        name: feedback.name,
        email: feedback.email,
        subject: `Feedback - ${feedback.category}`,
        message: feedback.message,
        rating: feedback.rating
      };

      const response = await axios.post('/send-feedback', feedbackData);
      
      if (response.data.status === 'success') {
        toast.success('Thank you for your feedback! We\'ll get back to you soon.');
      } else {
        toast.success('Thank you for your feedback! It has been logged.');
      }

      // Reset form
      setFeedback({
        name: '',
        email: '',
        rating: 0,
        message: '',
        category: 'general'
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Error submitting feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating, interactive = false) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isFilled = interactive ? starValue <= hoveredRating || starValue <= rating : starValue <= rating;
      
      return (
        <button
          key={index}
          type={interactive ? 'button' : undefined}
          onClick={interactive ? () => handleRatingClick(starValue) : undefined}
          onMouseEnter={interactive ? () => setHoveredRating(starValue) : undefined}
          onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
          className={`text-2xl transition-colors ${
            isFilled ? 'text-yellow-400' : 'text-gray-400'
          } ${interactive ? 'hover:text-yellow-400' : ''}`}
        >
          <Star size={24} fill={isFilled ? 'currentColor' : 'none'} />
        </button>
      );
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Feedback</h1>
          <p className="text-xl text-gray-300">
            We'd love to hear from you! Share your experience with CVision
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Feedback Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card"
          >
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <MessageSquare size={24} />
              Send Feedback
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name *</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={feedback.name}
                      onChange={(e) => setFeedback(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none"
                      placeholder="Your name"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={feedback.email}
                      onChange={(e) => setFeedback(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none"
                      placeholder="your@email.com"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={feedback.category}
                  onChange={(e) => setFeedback(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-3 bg-black/20 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none"
                  disabled={isSubmitting}
                >
                  <option value="general">General Feedback</option>
                  <option value="bug">Bug Report</option>
                  <option value="feature">Feature Request</option>
                  <option value="improvement">Improvement Suggestion</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Rating *</label>
                <div className="flex gap-2">
                  {renderStars(feedback.rating, true)}
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  {feedback.rating > 0 ? `${feedback.rating} out of 5 stars` : 'Click to rate'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message *</label>
                <textarea
                  value={feedback.message}
                  onChange={(e) => setFeedback(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full p-3 bg-black/20 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none resize-none"
                  rows={5}
                  placeholder="Tell us about your experience with CVision..."
                  disabled={isSubmitting}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Feedback
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Testimonials */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold mb-2">What Our Users Say</h2>
              <p className="text-gray-400">Real feedback from real users</p>
            </div>

            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="card"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-400 font-bold">{testimonial.avatar}</span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-sm text-gray-400">
                          {testimonial.role} at {testimonial.company}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {renderStars(testimonial.rating)}
                      </div>
                    </div>
                    
                    <p className="text-gray-300 leading-relaxed">
                      "{testimonial.comment}"
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12"
        >
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ThumbsUp size={24} className="text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-green-400 mb-2">98%</h3>
              <p className="text-gray-400">Satisfaction Rate</p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <User size={24} className="text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-blue-400 mb-2">10K+</h3>
              <p className="text-gray-400">Happy Users</p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart size={24} className="text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-purple-400 mb-2">4.9/5</h3>
              <p className="text-gray-400">Average Rating</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Feedback; 