import React from 'react';
import { useAuth } from './contexts/AuthContext';

function App() {
  console.log('App component rendering');

  try {
    const { currentUser, loading, error } = useAuth();
    console.log('App got auth context - currentUser:', currentUser, 'loading:', loading, 'error:', error);

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
            <p className="mt-4 text-gray-600">Loading authentication...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">TaskFlow</h1>
          <p className="text-lg text-gray-600 mb-8">Task Management App</p>
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Authentication Working!</h2>
            <p className="text-gray-600 mb-4">
              Auth context is working properly.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Current user: {currentUser ? currentUser.email : 'None'}
            </p>
            <button 
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              onClick={() => alert('Auth is working!')}
            >
              Test Auth
            </button>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in App component:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">App Error</h1>
          <p className="text-gray-600 mb-4">Something went wrong with the app.</p>
          <p className="text-sm text-red-500 mb-4">{error.message}</p>
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
}

export default App; 