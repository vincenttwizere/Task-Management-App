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
  SparklesIcon,
  FireIcon,
  TrophyIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';

// Enhanced Notification Component
function Notification({ notification, onDismiss }) {
  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckIcon className="w-5 h-5 text-emerald-500" />;
      case 'warning': return <ExclamationTriangleIcon className="w-5 h-5 text-amber-500" />;
      case 'error': return <XMarkIcon className="w-5 h-5 text-red-500" />;
      default: return <BellIcon className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'success': return 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200';
      case 'warning': return 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200';
      case 'error': return 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200';
      default: return 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200';
    }
  };

  return (
    <div className={`${getBgColor(notification.type)} border rounded-xl p-4 mb-3 flex items-start justify-between backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200`}>
      <div className="flex items-start space-x-3">
        <div className="p-1.5 bg-white rounded-lg shadow-sm">
          {getIcon(notification.type)}
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-1">{notification.title}</h4>
          <p className="text-sm text-gray-600 leading-relaxed">{notification.message}</p>
        </div>
      </div>
      <button
        onClick={() => onDismiss(notification.id)}
        className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-white/50 transition-colors duration-200"
      >
        <XMarkIcon className="w-4 h-4" />
      </button>
    </div>
  );
}

// Enhanced Task Creation Modal
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <PlusIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Create New Task</h3>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/20 transition-colors duration-200">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Task Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
              placeholder="Enter task title"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
              placeholder="Enter task description"
              rows="3"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Project</label>
            <select
              value={formData.projectId}
              onChange={(e) => setFormData({...formData, projectId: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
            >
              <option value="">No Project</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-all duration-200 hover:shadow-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-105"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Enhanced Project Creation Modal
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
      createdAt: new Date().toISOString()
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-t-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <FolderIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Create New Project</h3>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/20 transition-colors duration-200">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Project Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
              placeholder="Enter project name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
              placeholder="Enter project description"
              rows="3"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Project Color</label>
            <div className="flex space-x-2">
              {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'].map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({...formData, color})}
                  className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 ${
                    formData.color === color ? 'border-gray-400 scale-110' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-all duration-200 hover:shadow-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl hover:from-emerald-700 hover:to-green-700 font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-105"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Enhanced Auth Page
function AuthPage({ onLogin, onSignup, users }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isLogin) {
      const user = users.find(u => u.email === formData.email && u.password === formData.password);
      if (user) {
        onLogin(user);
      } else {
        alert('Invalid credentials. Try demo@taskflow.com / password');
      }
    } else {
      if (formData.name && formData.email && formData.password) {
        onSignup(formData);
      } else {
        alert('Please fill in all fields');
      }
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ email: '', password: '', name: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4">
            <RocketLaunchIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">TaskFlow</h1>
          <p className="text-gray-600">Your productivity companion</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                placeholder="Enter your full name"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
              placeholder="Enter your password"
            />
          </div>
          
          <button
            type="submit"
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-105"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={toggleMode}
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>

        {isLogin && (
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm text-blue-800 text-center">
              <strong>Demo Account:</strong><br />
              Email: demo@taskflow.com<br />
              Password: password
            </p>
          </div>
        )}
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
    <div className="p-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-full">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600 text-lg">Welcome back! Here's your productivity overview.</p>
        </div>
        
        {/* Enhanced Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Tasks</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{tasks.length}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
                <FlagIcon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Completed</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">{completedTasks.length}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl">
                <CheckIcon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Pending</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">{pendingTasks.length}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl">
                <ClockIcon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Projects</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{projects.length}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                <FolderIcon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Recent Tasks */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Tasks</h2>
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="space-y-4">
            {recentTasks.length > 0 ? (
              recentTasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-100">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => onTaskToggle(task.id)}
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                        task.completed 
                          ? 'bg-gradient-to-r from-emerald-500 to-green-500 border-emerald-500 text-white shadow-lg' 
                          : 'border-gray-300 hover:border-emerald-500 hover:shadow-md'
                      }`}
                    >
                      {task.completed && <CheckIcon className="w-4 h-4" />}
                    </button>
                    <div>
                      <h3 className={`font-semibold text-lg ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className={`text-gray-600 mt-1 ${task.completed ? 'line-through' : ''}`}>
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                      task.priority === 'high' ? 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800' :
                      task.priority === 'medium' ? 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800' :
                      'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800'
                    }`}>
                      {task.priority}
                    </span>
                    {task.dueDate && (
                      <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FlagIcon className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-gray-500 text-lg">No tasks yet. Create your first task to get started!</p>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Overdue Tasks Warning */}
        {overdueTasks.length > 0 && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl">
                <ExclamationTriangleIcon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-red-900 text-lg">Overdue Tasks</h3>
            </div>
            <p className="text-red-700">
              You have <span className="font-semibold">{overdueTasks.length}</span> overdue task{overdueTasks.length > 1 ? 's' : ''} that need your attention.
            </p>
          </div>
        )}
      </div>
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
  const [showNotifications, setShowNotifications] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Tasks', href: '/tasks', icon: FlagIcon },
    { name: 'Projects', href: '/projects', icon: FolderIcon },
    { name: 'Calendar', href: '/calendar', icon: CalendarIcon },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  ];

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.notifications-dropdown')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

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
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-gray-600 hover:text-gray-800"
                  >
                    <BellIcon className="w-6 h-6" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {notifications.length}
                      </span>
                    )}
                  </button>
                  
                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="notifications-dropdown absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                          <button
                            onClick={() => setShowNotifications(false)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <XMarkIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <div className="p-2">
                        {notifications.length > 0 ? (
                          <div className="space-y-2">
                            {notifications.map(notification => (
                              <Notification
                                key={notification.id}
                                notification={notification}
                                onDismiss={dismissNotification}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <BellIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-500">No notifications</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
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