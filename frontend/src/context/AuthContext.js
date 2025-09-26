import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider } from '../firebase';
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGoogleSignInLoading, setIsGoogleSignInLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u || null);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const register = async (email, password, displayName) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }
    return cred;
  };
  
  const loginWithGoogle = async () => {
    // Prevent multiple simultaneous popup requests
    if (isGoogleSignInLoading) {
      throw new Error('Google sign-in is already in progress');
    }
    
    setIsGoogleSignInLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result;
    } catch (error) {
      // Handle specific Firebase errors
      if (error.code === 'auth/cancelled-popup-request') {
        // User cancelled the popup or another popup is already open
        throw new Error('Sign-in was cancelled or another sign-in is in progress');
      } else if (error.code === 'auth/popup-closed-by-user') {
        // User closed the popup
        throw new Error('Sign-in popup was closed');
      } else if (error.code === 'auth/popup-blocked') {
        // Popup was blocked by browser
        throw new Error('Sign-in popup was blocked. Please allow popups for this site.');
      } else {
        // Other errors
        throw error;
      }
    } finally {
      setIsGoogleSignInLoading(false);
    }
  };
  
  const logout = () => signOut(auth);

  const value = { user, loading, login, register, loginWithGoogle, logout, isGoogleSignInLoading };
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
