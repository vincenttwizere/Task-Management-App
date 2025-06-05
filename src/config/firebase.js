import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

console.log('Initializing Firebase...'); // Debug log

const firebaseConfig = {
  apiKey: "AIzaSyDku9xAggMUfcdRXXbUk9RLA3IU8ge6QW4",
  authDomain: "task-management-app-34479.firebaseapp.com",
  projectId: "task-management-app-34479",
  storageBucket: "task-management-app-34479.appspot.com",
  messagingSenderId: "691969416725",
  appId: "1:691969416725:web:6102e1b6ac864d8905f81c" // This is a temporary appId, you'll need to replace it
};

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

export { auth, db, storage };

// Log the auth state to verify initialization
auth.onAuthStateChanged((user) => {
  console.log('Auth state:', user ? 'User is signed in' : 'No user');
}); 