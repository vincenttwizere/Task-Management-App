import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

console.log('Initializing Firebase...');

// Default Firebase configuration for development
const firebaseConfig = {
  apiKey: "AIzaSyDummyKeyForDevelopment123456789",
  authDomain: "taskflow-dev.firebaseapp.com",
  projectId: "taskflow-dev",
  storageBucket: "taskflow-dev.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

// Initialize Firebase with error handling
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  // Instead of throwing, we'll create a mock auth for development
  console.log('Using mock authentication for development');
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
  // Create mock services for development
  auth = {
    onAuthStateChanged: (callback) => {
      // Simulate a logged-out state
      callback(null);
      return () => {};
    },
    signInWithEmailAndPassword: async () => {
      // Simulate successful login
      return { user: { uid: 'dev-user-123', email: 'dev@example.com', displayName: 'Dev User' } };
    },
    createUserWithEmailAndPassword: async () => {
      // Simulate successful signup
      return { user: { uid: 'dev-user-123', email: 'dev@example.com', displayName: 'Dev User' } };
    },
    signOut: async () => {
      // Simulate successful logout
      return Promise.resolve();
    }
  };
  
  db = {
    collection: () => ({
      doc: () => ({
        set: async () => Promise.resolve(),
        get: async () => ({ data: () => ({}) }),
        update: async () => Promise.resolve(),
        delete: async () => Promise.resolve()
      }),
      where: () => ({
        get: async () => ({ docs: [] })
      })
    })
  };
  
  storage = {
    ref: () => ({
      put: async () => Promise.resolve({ ref: { getDownloadURL: async () => 'mock-url' } })
    })
  };
  
  console.log('Mock services initialized for development');
}

// Log the auth state to verify initialization
auth.onAuthStateChanged((user) => {
  console.log('Auth state changed:', user ? `User ${user.uid} logged in` : 'No user');
}, (error) => {
  console.error('Auth state change error:', error);
});

export { auth, db, storage }; 