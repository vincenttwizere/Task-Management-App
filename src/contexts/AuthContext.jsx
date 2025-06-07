import { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../config/firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function signup(email, password, displayName) {
    console.log('Starting signup process...', { email, displayName });
    
    try {
      // For development, simulate successful signup
      const mockUser = {
        uid: 'dev-user-123',
        email,
        displayName,
        reload: async () => Promise.resolve()
      };
      
      setCurrentUser(mockUser);
      setError(null);
      return { user: mockUser };
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message);
      throw error;
    }
  }

  async function login(email, password) {
    try {
      // For development, simulate successful login
      const mockUser = {
        uid: 'dev-user-123',
        email,
        displayName: 'Dev User',
        reload: async () => Promise.resolve()
      };
      
      setCurrentUser(mockUser);
      setError(null);
      return { user: mockUser };
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
      throw error;
    }
  }

  async function logout() {
    try {
      setCurrentUser(null);
      setError(null);
      return Promise.resolve();
    } catch (error) {
      console.error('Logout error:', error);
      setError(error.message);
      throw error;
    }
  }

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    // For development, simulate initial auth state
    const mockUser = {
      uid: 'dev-user-123',
      email: 'dev@example.com',
      displayName: 'Dev User'
    };
    
    // Simulate a delay to show loading state
    setTimeout(() => {
      setCurrentUser(mockUser);
      setLoading(false);
      setError(null);
    }, 1000);

    return () => {};
  }, []);

  const value = {
    currentUser,
    loading,
    error,
    signup,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 