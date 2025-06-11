import React from 'react';

function App() {
  console.log('App component rendering');
  
  return (
    <div style={{
      padding: '20px',
      backgroundColor: 'red',
      color: 'white',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>
        🎉 TEST - App is rendering!
      </h1>
      <p style={{ fontSize: '16px', marginBottom: '10px' }}>
        If you can see this red background with white text, React is working!
      </p>
      <p style={{ fontSize: '14px', marginBottom: '20px' }}>
        Current time: {new Date().toLocaleTimeString()}
      </p>
      
      <div style={{
        marginTop: '20px',
        padding: '20px',
        backgroundColor: 'blue',
        borderRadius: '8px'
      }}>
        <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>
          Simple Test - No Dependencies
        </h2>
        <p style={{ fontSize: '14px' }}>
          This test uses only inline styles and basic React.
        </p>
        <p style={{ fontSize: '14px', marginTop: '10px' }}>
          If you see this blue box, everything is working correctly.
        </p>
      </div>
      
      <div style={{
        marginTop: '20px',
        padding: '20px',
        backgroundColor: 'green',
        borderRadius: '8px'
      }}>
        <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>
          Browser Info
        </h2>
        <p style={{ fontSize: '14px' }}>
          User Agent: {navigator.userAgent.substring(0, 50)}...
        </p>
        <p style={{ fontSize: '14px' }}>
          Window Size: {window.innerWidth} x {window.innerHeight}
        </p>
      </div>
    </div>
  );
}

export default App; 