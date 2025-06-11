import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Projects from './pages/Projects';
import Calendar from './pages/Calendar';
import Analytics from './pages/Analytics';
import PrivateRoute from './components/PrivateRoute';

function AppContent() {
  const { currentUser, loading } = useAuth();

  console.log('AppContent render:', { currentUser, loading });

  if (loading) {
    console.log('Showing loading state');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  console.log('Rendering main app content');
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={currentUser ? <Navigate to="/dashboard" /> : <Login />}
      />
      <Route
        path="/register"
        element={currentUser ? <Navigate to="/dashboard" /> : <Register />}
      />

      {/* Protected Routes */}
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

      {/* Catch all route */}
      <Route path="*" element={<Navigate to={currentUser ? "/dashboard" : "/login"} />} />
    </Routes>
  );
}

function App() {
  console.log('App component rendering');
  return (
    <div style={{ padding: '20px', backgroundColor: 'red', color: 'white', minHeight: '100vh' }}>
      <h1>TEST - App is rendering!</h1>
      <p>If you can see this, React is working.</p>
      <p>Current time: {new Date().toLocaleTimeString()}</p>
      
      {/* Temporarily bypass authentication for testing */}
      <div style={{ marginTop: '20px', padding: '20px', backgroundColor: 'blue' }}>
        <h2>Simple Test - No Auth</h2>
        <p>This should show if basic React is working.</p>
      </div>
      
      {/* Original app (commented out for testing) */}
      {/*
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
      */}
    </div>
  );
}

export default App; 