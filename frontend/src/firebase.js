// Firebase initialization
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const cfg = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'AIzaSyDTAXoGkaY_hUPeZ8Ue4-FdB_fI3dUKGTc',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'cvision-70048.firebaseapp.com',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'cvision-70048',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'cvision-70048.firebasestorage.app',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '180997017976',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '1:180997017976:web:f74146ac6d1520ac02388d',
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || 'G-NWSBE41FYR',
};

if (!process.env.REACT_APP_FIREBASE_API_KEY) {
  // eslint-disable-next-line no-console
  console.warn('Firebase env vars not found. Falling back to inline config. Ensure you have frontend/.env set and restart dev server.');
}

const app = initializeApp(cfg);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
