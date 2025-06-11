import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-blue-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">TaskFlow</h1>
        <p className="text-gray-600 mb-6">Your task management app is running!</p>
        <div className="space-y-2">
          <div className="bg-green-100 p-3 rounded">
            <span className="text-green-800">✅ React is working</span>
          </div>
          <div className="bg-blue-100 p-3 rounded">
            <span className="text-blue-800">✅ Tailwind CSS is working</span>
          </div>
          <div className="bg-purple-100 p-3 rounded">
            <span className="text-purple-800">✅ Development server is running</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 