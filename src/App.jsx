import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  HomeIcon,
  CalendarIcon,
  ChartBarIcon,
  FlagIcon,
  FolderIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

// Dashboard Component
function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Total Tasks</h3>
          <p className="text-3xl font-bold text-blue-600">24</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Completed</h3>
          <p className="text-3xl font-bold text-green-600">18</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600">6</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
          <p className="text-3xl font-bold text-purple-600">4</p>
        </div>
      </div>
    </div>
  );
}

// Tasks Component
function Tasks() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Tasks</h1>
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Tasks</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
              <div>
                <h3 className="font-medium text-gray-900">Complete project proposal</h3>
                <p className="text-sm text-gray-500">Due: Today</p>
              </div>
              <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">High Priority</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
              <div>
                <h3 className="font-medium text-gray-900">Review code changes</h3>
                <p className="text-sm text-gray-500">Due: Tomorrow</p>
              </div>
              <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">Medium Priority</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Projects Component
function Projects() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Website Redesign</h3>
          <p className="text-gray-600 mb-4">Redesign the company website with modern UI/UX</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Progress: 75%</span>
            <div className="w-16 bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Mobile App</h3>
          <p className="text-gray-600 mb-4">Develop a mobile app for iOS and Android</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Progress: 45%</span>
            <div className="w-16 bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Calendar Component
function Calendar() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Calendar</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Events</h2>
        <div className="space-y-4">
          <div className="flex items-center p-4 bg-blue-50 rounded">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-4"></div>
            <div>
              <h3 className="font-medium text-gray-900">Team Meeting</h3>
              <p className="text-sm text-gray-500">Today at 2:00 PM</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-green-50 rounded">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-4"></div>
            <div>
              <h3 className="font-medium text-gray-900">Project Deadline</h3>
              <p className="text-sm text-gray-500">Tomorrow at 5:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Analytics Component
function Analytics() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Completion Rate</h3>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">85%</div>
            <p className="text-gray-600">This month</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Productivity Score</h3>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">92</div>
            <p className="text-gray-600">Out of 100</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main App Component
function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Tasks', href: '/tasks', icon: FlagIcon },
    { name: 'Projects', href: '/projects', icon: FolderIcon },
    { name: 'Calendar', href: '/calendar', icon: CalendarIcon },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  ];

  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-gray-200 transition-all duration-300`}>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
              {!isSidebarCollapsed && (
                <h1 className="text-xl font-bold text-blue-600">TaskFlow</h1>
              )}
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-1 rounded-lg hover:bg-gray-100"
              >
                {isSidebarCollapsed ? (
                  <ChevronRightIcon className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronLeftIcon className="w-5 h-5 text-gray-500" />
                )}
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-2 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  <item.icon className="mr-3 h-5 w-5 text-gray-400" />
                  {!isSidebarCollapsed && <span>{item.name}</span>}
                </a>
              ))}
            </nav>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <header className="bg-white border-b border-gray-200">
            <div className="flex items-center justify-between h-16 px-6">
              <h1 className="text-2xl font-semibold text-gray-900">TaskFlow</h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Welcome back!</span>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/analytics" element={<Analytics />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App; 