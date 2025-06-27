import React from 'react';

function App() {
  console.log('App component rendering...');
  
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f0f0f0',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#333', marginBottom: '1rem' }}>TaskFlow App</h1>
        <p style={{ color: '#666', marginBottom: '1rem' }}>React is working!</p>
        <p style={{ color: '#888', fontSize: '0.9rem' }}>If you can see this, the app is loading correctly.</p>
        <button 
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '1rem'
          }}
          onClick={() => alert('Button clicked! React is working properly.')}
        >
          Test Button
        </button>
      </div>
    </div>
  );
}

export default App; 