import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false); // Start with false to avoid loading state
  const [error, setError] = useState(null);

  console.log('AuthProvider render - currentUser:', currentUser, 'loading:', loading, 'error:', error);

  // Simple mock authentication functions
  async function signup(email, password, displayName) {
    console.log('Mock signup:', { email, displayName });
    try {
      setError(null);
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = {
        uid: 'user-' + Date.now(),
        email,
        displayName
      };
      
      setCurrentUser(mockUser);
      setLoading(false);
      return { user: mockUser };
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message);
      setLoading(false);
      throw error;
    }
  }

  async function login(email, password) {
    console.log('Mock login:', { email });
    try {
      setError(null);
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = {
        uid: 'user-' + Date.now(),
        email,
        displayName: email.split('@')[0]
      };
      
      setCurrentUser(mockUser);
      setLoading(false);
      return { user: mockUser };
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
      setLoading(false);
      throw error;
    }
  }

  async function logout() {
    console.log('Mock logout');
    try {
      setError(null);
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCurrentUser(null);
      setLoading(false);
    } catch (error) {
      console.error('Logout error:', error);
      setError(error.message);
      setLoading(false);
      throw error;
    }
  }

  const value = {
    currentUser,
    loading,
    error,
    signup,
    login,
    logout,
  };

  console.log('AuthProvider about to render children with value:', value);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 