import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import {
  HomeIcon,
  CalendarIcon,
  ChartBarIcon,
  FlagIcon,
  FolderIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserIcon,
  LockClosedIcon,
  EnvelopeIcon,
  PlusIcon,
  BellIcon,
  XMarkIcon,
  CheckIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

// Notification Component
function Notification({ notification, onDismiss }) {
  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckIcon className="w-5 h-5 text-green-500" />;
      case 'warning': return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'error': return <XMarkIcon className="w-5 h-5 text-red-500" />;
      default: return <BellIcon className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'error': return 'bg-red-50 border-red-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className={`${getBgColor(notification.type)} border rounded-lg p-4 mb-3 flex items-start justify-between`}>
      <div className="flex items-start space-x-3">
        {getIcon(notification.type)}
        <div>
          <h4 className="font-medium text-gray-900">{notification.title}</h4>
          <p className="text-sm text-gray-600">{notification.message}</p>
        </div>
      </div>
      <button
        onClick={() => onDismiss(notification.id)}
        className="text-gray-400 hover:text-gray-600"
      >
        <XMarkIcon className="w-4 h-4" />
      </button>
    </div>
  );
}

// Task Creation Modal
function TaskModal({ isOpen, onClose, onSave, projects }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    projectId: '',
    status: 'pending'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    
    onSave({
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString(),
      completed: false
    });
    
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      projectId: '',
      status: 'pending'
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Create New Task</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter task title"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter task description"
              rows="3"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
            <select
              value={formData.projectId}
              onChange={(e) => setFormData({...formData, projectId: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">No Project</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Project Creation Modal
function ProjectModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    onSave({
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString(),
      tasks: []
    });
    
    setFormData({
      name: '',
      description: '',
      color: '#3B82F6'
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Create New Project</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter project name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter project description"
              rows="3"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({...formData, color: e.target.value})}
              className="w-full h-10 border border-gray-300 rounded-md"
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Combined Auth Page Component
function AuthPage({ onLogin, onSignup, users }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      // Login logic
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields');
        return;
      }
      
      // Debug: Log the users array and attempted login
      console.log('Available users:', users);
      console.log('Attempting login with:', formData.email);
      
      // Simple validation - in real app, this would connect to backend
      const user = users.find(u => u.email === formData.email && u.password === formData.password);
      
      if (user) {
        console.log('Login successful for:', user.name);
        onLogin(user);
      } else {
        console.log('Login failed - user not found or password incorrect');
        setError('Invalid credentials. Use demo@taskflow.com / password or create a new account.');
      }
    } else {
      // Signup logic
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      
      // Check if user already exists
      const existingUser = users.find(u => u.email === formData.email);
      if (existingUser) {
        setError('An account with this email already exists. Please login instead.');
        return;
      }
      
      // Pass the password along with other user data
      onSignup({ 
        email: formData.email, 
        name: formData.name,
        password: formData.password
      });
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-center text-blue-600">TaskFlow</h1>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="mt-1 relative">
                  <UserIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required={!isLogin}
                    className="pl-10 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <EnvelopeIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="pl-10 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <LockClosedIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="pl-10 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>
            
            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="mt-1 relative">
                  <LockClosedIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required={!isLogin}
                    className="pl-10 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isLogin ? 'Sign in' : 'Create Account'}
            </button>
          </div>

          <div className="text-center space-y-2">
            {isLogin && (
              <p className="text-sm text-gray-600">
                Demo credentials: demo@taskflow.com / password
              </p>
            )}
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button
                type="button"
                onClick={toggleMode}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                {isLogin ? 'Sign up here' : 'Sign in here'}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

// Enhanced Dashboard Component
function Dashboard({ tasks, projects, onTaskToggle, onTaskDelete }) {
  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);
  const overdueTasks = tasks.filter(task => 
    !task.completed && task.dueDate && new Date(task.dueDate) < new Date()
  );

  const recentTasks = tasks
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Total Tasks</h3>
          <p className="text-3xl font-bold text-blue-600">{tasks.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Completed</h3>
          <p className="text-3xl font-bold text-green-600">{completedTasks.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600">{pendingTasks.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
          <p className="text-3xl font-bold text-purple-600">{projects.length}</p>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Tasks</h2>
        <div className="space-y-3">
          {recentTasks.length > 0 ? (
            recentTasks.map(task => (
              <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => onTaskToggle(task.id)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      task.completed 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : 'border-gray-300 hover:border-green-500'
                    }`}
                  >
                    {task.completed && <CheckIcon className="w-3 h-3" />}
                  </button>
                  <div>
                    <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-500">{task.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    task.priority === 'high' ? 'bg-red-100 text-red-800' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.priority}
                  </span>
                  {task.dueDate && (
                    <span className="text-sm text-gray-500">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No tasks yet. Create your first task!</p>
          )}
        </div>
      </div>

      {/* Overdue Tasks Warning */}
      {overdueTasks.length > 0 && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
            <h3 className="font-medium text-red-900">Overdue Tasks</h3>
          </div>
          <p className="text-sm text-red-700 mt-1">
            You have {overdueTasks.length} overdue task{overdueTasks.length > 1 ? 's' : ''}.
          </p>
        </div>
      )}
    </div>
  );
}

// Enhanced Tasks Component
function Tasks({ tasks, projects, onTaskToggle, onTaskDelete, onTaskEdit }) {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = 
      filter === 'all' ||
      (filter === 'completed' && task.completed) ||
      (filter === 'pending' && !task.completed) ||
      (filter === 'overdue' && !task.completed && task.dueDate && new Date(task.dueDate) < new Date());
    
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'No Project';
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex space-x-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <div key={task.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <button
                    onClick={() => onTaskToggle(task.id)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-1 ${
                      task.completed 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : 'border-gray-300 hover:border-green-500'
                    }`}
                  >
                    {task.completed && <CheckIcon className="w-3 h-3" />}
                  </button>
                  <div className="flex-1">
                    <h3 className={`font-medium text-lg ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className={`text-gray-600 mt-1 ${task.completed ? 'line-through' : ''}`}>
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 mt-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      {task.projectId && (
                        <span className="text-sm text-gray-500">
                          Project: {getProjectName(task.projectId)}
                        </span>
                      )}
                      {task.dueDate && (
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <ClockIcon className="w-4 h-4" />
                          <span>
                            {new Date(task.dueDate).toLocaleDateString()}
                            {!task.completed && new Date(task.dueDate) < new Date() && (
                              <span className="text-red-500 ml-1">(Overdue)</span>
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onTaskEdit(task)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onTaskDelete(task.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No tasks found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Enhanced Projects Component
function Projects({ projects, tasks, onProjectDelete, onProjectEdit }) {
  const getProjectStats = (projectId) => {
    const projectTasks = tasks.filter(task => task.projectId === projectId);
    const completed = projectTasks.filter(task => task.completed).length;
    const total = projectTasks.length;
    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Projects</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length > 0 ? (
          projects.map(project => {
            const stats = getProjectStats(project.id);
            return (
              <div key={project.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: project.color }}
                    ></div>
                    <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onProjectEdit(project)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onProjectDelete(project.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                {project.description && (
                  <p className="text-gray-600 mb-4">{project.description}</p>
                )}
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-medium">{stats.completed}/{stats.total} tasks</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${stats.percentage}%`,
                        backgroundColor: project.color 
                      }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500">{stats.percentage}% complete</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">No projects yet. Create your first project!</p>
          </div>
        )}
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

// Protected Route Component
function ProtectedRoute({ children, isAuthenticated }) {
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Main App Component
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [users, setUsers] = useState([
    { email: 'demo@taskflow.com', password: 'password', name: 'Demo User' }
  ]);

  // New state for enhanced functionality
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Complete project proposal',
      description: 'Finish the initial project proposal document',
      priority: 'high',
      dueDate: '2024-01-15',
      projectId: 1,
      status: 'pending',
      completed: false,
      createdAt: '2024-01-10T10:00:00Z'
    },
    {
      id: 2,
      title: 'Review code changes',
      description: 'Review and approve recent code changes',
      priority: 'medium',
      dueDate: '2024-01-20',
      projectId: 1,
      status: 'pending',
      completed: false,
      createdAt: '2024-01-11T14:30:00Z'
    }
  ]);

  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'Website Redesign',
      description: 'Complete redesign of the company website',
      color: '#3B82F6',
      createdAt: '2024-01-01T09:00:00Z'
    },
    {
      id: 2,
      name: 'Mobile App Development',
      description: 'Develop a new mobile application',
      color: '#10B981',
      createdAt: '2024-01-05T11:00:00Z'
    }
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'info',
      title: 'Welcome to TaskFlow!',
      message: 'Start by creating your first task or project.',
      timestamp: new Date().toISOString()
    }
  ]);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editingProject, setEditingProject] = useState(null);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Tasks', href: '/tasks', icon: FlagIcon },
    { name: 'Projects', href: '/projects', icon: FolderIcon },
    { name: 'Calendar', href: '/calendar', icon: CalendarIcon },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  ];

  // Task management functions
  const handleCreateTask = (taskData) => {
    setTasks(prev => [...prev, taskData]);
    addNotification('success', 'Task Created', 'New task has been created successfully!');
  };

  const handleTaskToggle = (taskId) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ));
  };

  const handleTaskDelete = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    addNotification('info', 'Task Deleted', 'Task has been removed.');
  };

  const handleTaskEdit = (task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  // Project management functions
  const handleCreateProject = (projectData) => {
    setProjects(prev => [...prev, projectData]);
    addNotification('success', 'Project Created', 'New project has been created successfully!');
  };

  const handleProjectDelete = (projectId) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
    // Remove project from tasks
    setTasks(prev => prev.map(task => 
      task.projectId === projectId 
        ? { ...task, projectId: '' }
        : task
    ));
    addNotification('info', 'Project Deleted', 'Project has been removed.');
  };

  const handleProjectEdit = (project) => {
    setEditingProject(project);
    setShowProjectModal(true);
  };

  // Notification functions
  const addNotification = (type, title, message) => {
    const newNotification = {
      id: Date.now(),
      type,
      title,
      message,
      timestamp: new Date().toISOString()
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const dismissNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  // Authentication functions
  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    addNotification('success', 'Welcome Back!', `Hello ${userData.name}, welcome to TaskFlow!`);
  };

  const handleSignup = (userData) => {
    const newUser = {
      email: userData.email,
      password: userData.password,
      name: userData.name
    };
    
    setUsers(prevUsers => [...prevUsers, newUser]);
    setUser(userData);
    setIsAuthenticated(true);
    addNotification('success', 'Account Created', `Welcome ${userData.name}! Your account has been created successfully.`);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setNotifications([]);
  };

  if (!isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<AuthPage onLogin={handleLogin} onSignup={handleSignup} users={users} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

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
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center px-2 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  <item.icon className="mr-3 h-5 w-5 text-gray-400" />
                  {!isSidebarCollapsed && <span>{item.name}</span>}
                </Link>
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
                {/* Quick Actions */}
                <button
                  onClick={() => setShowTaskModal(true)}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>New Task</span>
                </button>
                <button
                  onClick={() => setShowProjectModal(true)}
                  className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>New Project</span>
                </button>
                
                {/* Notifications */}
                <div className="relative">
                  <button className="relative p-2 text-gray-600 hover:text-gray-800">
                    <BellIcon className="w-6 h-6" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {notifications.length}
                      </span>
                    )}
                  </button>
                </div>
                
                <span className="text-sm text-gray-600">Welcome, {user?.name}!</span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Logout
                </button>
              </div>
            </div>
          </header>

          {/* Notifications Panel */}
          {notifications.length > 0 && (
            <div className="bg-white border-b border-gray-200 p-4 max-h-64 overflow-y-auto">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Notifications</h3>
              <div className="space-y-2">
                {notifications.slice(0, 3).map(notification => (
                  <Notification
                    key={notification.id}
                    notification={notification}
                    onDismiss={dismissNotification}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Dashboard 
                    tasks={tasks} 
                    projects={projects} 
                    onTaskToggle={handleTaskToggle}
                    onTaskDelete={handleTaskDelete}
                  />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Dashboard 
                    tasks={tasks} 
                    projects={projects} 
                    onTaskToggle={handleTaskToggle}
                    onTaskDelete={handleTaskDelete}
                  />
                </ProtectedRoute>
              } />
              <Route path="/tasks" element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Tasks 
                    tasks={tasks} 
                    projects={projects}
                    onTaskToggle={handleTaskToggle}
                    onTaskDelete={handleTaskDelete}
                    onTaskEdit={handleTaskEdit}
                  />
                </ProtectedRoute>
              } />
              <Route path="/projects" element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Projects 
                    projects={projects}
                    tasks={tasks}
                    onProjectDelete={handleProjectDelete}
                    onProjectEdit={handleProjectEdit}
                  />
                </ProtectedRoute>
              } />
              <Route path="/calendar" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Calendar /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Analytics /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>

      {/* Modals */}
      <TaskModal
        isOpen={showTaskModal}
        onClose={() => {
          setShowTaskModal(false);
          setEditingTask(null);
        }}
        onSave={handleCreateTask}
        projects={projects}
      />
      
      <ProjectModal
        isOpen={showProjectModal}
        onClose={() => {
          setShowProjectModal(false);
          setEditingProject(null);
        }}
        onSave={handleCreateProject}
      />
    </Router>
  );
}

export default App; 