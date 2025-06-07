import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

console.log('Initializing Firebase...'); // Debug log

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Check if environment variables are properly loaded
const missingVars = Object.entries(firebaseConfig).filter(([_, value]) => !value);
if (missingVars.length > 0) {
  console.error('Missing Firebase configuration variables:', missingVars.map(([key]) => key));
  throw new Error('Firebase configuration is incomplete. Check your environment variables.');
}

console.log('Firebase configuration loaded');

// Initialize Firebase with error handling
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

// Initialize Firebase services with error handling
let auth;
let db;
let storage;

try {
  auth = getAuth(app);
  console.log('Auth service initialized');
  
  db = getFirestore(app);
  console.log('Firestore service initialized');
  
  storage = getStorage(app);
  console.log('Storage service initialized');
} catch (error) {
  console.error('Error initializing Firebase services:', error);
  throw error;
}

// Log the auth state to verify initialization
auth.onAuthStateChanged((user) => {
  console.log('Auth state changed:', user ? `User ${user.uid} logged in` : 'No user');
}, (error) => {
  console.error('Auth state change error:', error);
});

export { auth, db, storage }; 