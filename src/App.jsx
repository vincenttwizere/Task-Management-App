import React from 'react';

function App() {
  console.log('App component rendering');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">TaskFlow</h1>
        <p className="text-lg text-gray-600 mb-8">Task Management App</p>
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">App is Working!</h2>
          <p className="text-gray-600 mb-4">
            If you can see this, React is rendering properly.
          </p>
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            onClick={() => alert('Button clicked!')}
          >
            Test Button
          </button>
        </div>
      </div>
    </div>
  );
}

export default App; 