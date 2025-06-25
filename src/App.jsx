import React from 'react';

function App() {
  console.log('App component rendering - minimal test');

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f3f4f6', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
          TaskFlow Test
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
          If you can see this, the basic React app is working.
        </p>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '2rem', 
          borderRadius: '0.5rem', 
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          maxWidth: '400px'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
            Basic Test Working!
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
            This is a minimal test without any external dependencies.
          </p>
          <button 
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: 'pointer'
            }}
            onClick={() => alert('Button clicked! React is working!')}
          >
            Test Button
          </button>
        </div>
      </div>
    </div>
  );
}

export default App; 