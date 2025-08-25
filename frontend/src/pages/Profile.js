import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, LogIn } from 'lucide-react';

const Profile = () => {
  const { user, loginWithGoogle, logout } = useAuth();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-xl mx-auto card text-center"
        >
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
            <User size={40} className="text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold mb-2">You are not logged in</h1>
          <p className="text-gray-300 mb-6">Sign in to view your profile and manage your resumes.</p>
          <button
            onClick={loginWithGoogle}
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <LogIn size={18} />
            Sign in with Google
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto card"
      >
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-green-500/30 to-blue-500/30 flex items-center justify-center border border-white/10 overflow-hidden">
            {user.photoURL ? (
              <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-bold text-white">{(user.displayName || user.email || 'U').charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-1">{user.displayName || 'User'}</h1>
            <p className="text-gray-300">{user.email}</p>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Mail size={18} className="text-green-400" />
              <h3 className="font-semibold">Email</h3>
            </div>
            <p className="text-gray-300 break-all">{user.email}</p>
          </div>

          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Calendar size={18} className="text-green-400" />
              <h3 className="font-semibold">Member since</h3>
            </div>
            <p className="text-gray-300">{user.metadata?.creationTime ? new Date(user.metadata.creationTime).toDateString() : 'N/A'}</p>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-end">
          <button onClick={logout} className="btn btn-secondary">Log out</button>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
