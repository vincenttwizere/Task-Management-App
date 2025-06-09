import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

console.log('Initializing Firebase...');

// Firebase configuration - Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForDevelopment123456789",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "taskflow-dev.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "taskflow-dev",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "taskflow-dev.appspot.com",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:abcdef1234567890"
};

// Initialize Firebase
let app;
let auth;
let db;
let storage;

try {
  app = initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');
  
  auth = getAuth(app);
  console.log('Auth service initialized');
  
  db = getFirestore(app);
  console.log('Firestore service initialized');
  
  storage = getStorage(app);
  console.log('Storage service initialized');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

// Log the auth state to verify initialization
auth.onAuthStateChanged((user) => {
  console.log('Auth state changed:', user ? `User ${user.uid} logged in` : 'No user');
}, (error) => {
  console.error('Auth state change error:', error);
});

export { auth, db, storage }; 