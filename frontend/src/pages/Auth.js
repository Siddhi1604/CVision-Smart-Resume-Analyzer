import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, ArrowLeft, Chrome } from 'lucide-react';

const Auth = () => {
  const { login, register, loginWithGoogle } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/builder';

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form.email, form.password, form.name);
      }
      navigate(redirectTo, { replace: true });
    } catch (err) {
      alert(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate(redirectTo, { replace: true });
    } catch (err) {
      alert(err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="card"
        >
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
            <Link to="/" className="text-sm text-gray-400 hover:text-white flex items-center gap-1">
              <ArrowLeft size={16} /> Home
            </Link>
          </div>

          <div className="grid grid-cols-2 mb-6 p-1 bg-black/20 rounded-lg">
            <button
              onClick={() => setMode('login')}
              className={`px-4 py-2 rounded-md ${mode === 'login' ? 'bg-green-500 text-white' : 'text-gray-300 hover:text-white'}`}
            >
              Login
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`px-4 py-2 rounded-md ${mode === 'signup' ? 'bg-green-500 text-white' : 'text-gray-300 hover:text-white'}`}
            >
              Sign up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm mb-2">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none"
                    required
                  />
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm mb-2">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary py-3"
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-gray-400 text-sm">or</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full btn btn-secondary py-3 flex items-center justify-center gap-2"
          >
            <Chrome size={18} /> Continue with Google
          </button>

          <p className="text-center text-sm text-gray-400 mt-6">
            By continuing you agree to our Terms of Service and Privacy Policy.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
