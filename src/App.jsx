import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Import pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// Import components
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

function AppContent() {
  const { currentUser, loading } = useAuth();

  console.log('AppContent render - currentUser:', currentUser, 'loading:', loading);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="loading-spinner h-12 w-12"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {currentUser && <Navbar />}
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={!currentUser ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!currentUser ? <Register /> : <Navigate to="/dashboard" />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to={currentUser ? "/dashboard" : "/login"} />} />
          <Route path="*" element={<Navigate to={currentUser ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  console.log('App component rendering...');
  
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App; 