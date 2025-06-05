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
    console.log('Starting signup process...', { email, displayName }); // Debug log
    
    if (!auth) {
      console.error('Auth is not initialized!');
      throw new Error('Authentication service is not initialized');
    }

    try {
      console.log('Creating user account...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User account created successfully:', userCredential.user.uid);

      console.log('Updating user profile...');
      await updateProfile(userCredential.user, {
        displayName: displayName
      });
      console.log('Profile updated successfully');

      // Refresh the user object
      await userCredential.user.reload();
      setCurrentUser(userCredential.user);
      setError(null);
      return userCredential;
    } catch (error) {
      console.error('Signup error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      setError(error.message);
      throw error;
    }
  }

  async function login(email, password) {
    if (!auth) {
      throw new Error('Authentication service is not initialized');
    }
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setError(null);
      return result;
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
      throw error;
    }
  }

  async function logout() {
    if (!auth) {
      throw new Error('Authentication service is not initialized');
    }
    try {
      await signOut(auth);
      setError(null);
    } catch (error) {
      console.error('Logout error:', error);
      setError(error.message);
      throw error;
    }
  }

  useEffect(() => {
    if (!auth) {
      console.error('Auth is not initialized in useEffect');
      return;
    }

    console.log('Setting up auth state listener...');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user ? `User ${user.uid} logged in` : 'No user');
      setCurrentUser(user);
      setLoading(false);
      setError(null);
    }, (error) => {
      console.error('Auth state change error:', error);
      setError(error.message);
      setLoading(false);
    });

    return unsubscribe;
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