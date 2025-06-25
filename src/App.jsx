import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Projects from './pages/Projects';
import Calendar from './pages/Calendar';
import Analytics from './pages/Analytics';
import TeamManagement from './pages/TeamManagement';
import AcceptInvite from './pages/AcceptInvite';

function App() {
  const { currentUser, loading, error } = useAuth();

  console.log('App render - currentUser:', currentUser, 'loading:', loading, 'error:', error);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Routes>
        {/* Public routes */}
        <Route 
          path="/login" 
          element={currentUser ? <Navigate to="/dashboard" /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={currentUser ? <Navigate to="/dashboard" /> : <Register />} 
        />
        <Route 
          path="/accept-invite/:token" 
          element={<AcceptInvite />} 
        />

        {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/tasks" 
          element={
            <PrivateRoute>
              <Tasks />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/projects" 
          element={
            <PrivateRoute>
              <Projects />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/calendar" 
          element={
            <PrivateRoute>
              <Calendar />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/analytics" 
          element={
            <PrivateRoute>
              <Analytics />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/team" 
          element={
            <PrivateRoute>
              <TeamManagement />
            </PrivateRoute>
          } 
        />

        {/* Default redirect */}
        <Route 
          path="/" 
          element={<Navigate to={currentUser ? "/dashboard" : "/login"} />} 
        />
        <Route 
          path="*" 
          element={<Navigate to={currentUser ? "/dashboard" : "/login"} />} 
        />
      </Routes>
    </div>
  );
}

export default App; 