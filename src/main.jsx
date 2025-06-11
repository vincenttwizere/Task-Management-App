import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// import './index.css';

console.log('main.jsx: Starting application');

const root = document.getElementById('root');

if (!root) {
  console.error('Root element not found!');
} else {
  try {
    console.log('Starting app render...');
    
    const reactRoot = ReactDOM.createRoot(root);
    reactRoot.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    console.log('App rendered successfully');
  } catch (error) {
    console.error('Error rendering app:', error);
    
    // Show error UI
    root.innerHTML = `
      <div style="
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: system-ui, -apple-system, sans-serif;
        background-color: #f9fafb;
        padding: 20px;
      ">
        <div style="
          max-width: 500px;
          padding: 24px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          text-align: center;
        ">
          <h1 style="
            font-size: 24px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 16px;
          ">Something went wrong</h1>
          <p style="
            color: #4b5563;
            margin-bottom: 16px;
          ">${error.message}</p>
          <button onclick="window.location.reload()" style="
            background: #0284c7;
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            border: none;
            cursor: pointer;
          ">Reload Page</button>
        </div>
      </div>
    `;
  }
}

// Add window error handlers
window.onerror = function(message, source, lineno, colno, error) {
  console.error('Global error:', { message, source, lineno, colno, error });
  return false;
};

window.onunhandledrejection = function(event) {
  console.error('Unhandled promise rejection:', event.reason);
};

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
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
} 