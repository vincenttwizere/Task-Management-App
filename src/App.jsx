import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Suspense, useEffect, useState } from 'react';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ProjectBoard from './pages/ProjectBoard';
import TeamManagement from './pages/TeamManagement';
import Analytics from './pages/Analytics';
import AcceptInvite from './pages/AcceptInvite';
import Navbar from './components/Navbar';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading component
function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your workspace...</p>
      </div>
    </div>
  );
}

function AppContent() {
  const { currentUser, loading, error } = useAuth();
  const navigate = useNavigate();
  const [initError, setInitError] = useState(null);

  useEffect(() => {
    console.log('AppContent mounted');
    console.log('Auth State:', { currentUser, loading, error });

    // Check if Firebase is properly initialized
    try {
      const firebaseConfig = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      };

      const missingVars = Object.entries(firebaseConfig).filter(([_, value]) => !value);
      if (missingVars.length > 0) {
        throw new Error('Missing Firebase configuration. Please check your environment variables.');
      }
    } catch (err) {
      console.error('Initialization error:', err);
      setInitError(err.message);
    }
  }, [currentUser, loading, error]);

  // Show initialization error
  if (initError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Configuration Error</h2>
          <p className="text-gray-600 mb-4">{initError}</p>
          <p className="text-sm text-gray-500 mb-4">Please check your environment variables and Firebase configuration.</p>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return <LoadingSpinner />;
  }

  // Show authentication error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Authentication Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ErrorBoundary>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/project/:projectId"
                element={
                  <PrivateRoute>
                    <ProjectBoard />
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
              <Route
                path="/team/accept-invite"
                element={
                  <PrivateRoute>
                    <AcceptInvite />
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
            </Routes>
          </Suspense>
        </div>
      </ErrorBoundary>
    </div>
  );
}

function App() {
  console.log('App component rendered');
  
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App; 