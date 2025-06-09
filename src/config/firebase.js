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

// Check if we're in development mode and using dummy credentials
const isDevelopment = !process.env.VITE_FIREBASE_API_KEY || 
                     process.env.VITE_FIREBASE_API_KEY === "AIzaSyDummyKeyForDevelopment123456789";

// Initialize Firebase
let app;
let auth;
let db;
let storage;

try {
  if (isDevelopment) {
    console.warn('⚠️  Using development mode with mock Firebase services');
    console.warn('📝 To use real Firebase, create a .env.local file with your Firebase credentials');
    
    // Create mock services for development
    auth = {
      onAuthStateChanged: (callback) => {
        // Simulate a logged-out state initially
        callback(null);
        return () => {};
      },
      signInWithEmailAndPassword: async (auth, email, password) => {
        // Simulate successful login
        const mockUser = {
          uid: 'dev-user-123',
          email,
          displayName: 'Dev User',
          reload: async () => Promise.resolve()
        };
        return { user: mockUser };
      },
      createUserWithEmailAndPassword: async (auth, email, password) => {
        // Simulate successful signup
        const mockUser = {
          uid: 'dev-user-123',
          email,
          displayName: 'Dev User',
          reload: async () => Promise.resolve()
        };
        return { user: mockUser };
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
        }),
        addDoc: async () => Promise.resolve({ id: 'mock-doc-id' }),
        onSnapshot: (query, callback) => {
          // Simulate empty data
          callback({ docs: [] });
          return () => {};
        }
      })
    };
    
    storage = {
      ref: () => ({
        put: async () => Promise.resolve({ ref: { getDownloadURL: async () => 'mock-url' } })
      })
    };
    
    console.log('✅ Mock Firebase services initialized for development');
  } else {
    app = initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');
    
    auth = getAuth(app);
    console.log('Auth service initialized');
    
    db = getFirestore(app);
    console.log('Firestore service initialized');
    
    storage = getStorage(app);
    console.log('Storage service initialized');
  }
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