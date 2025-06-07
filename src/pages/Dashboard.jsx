import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  PlusIcon,
  CalendarIcon,
  TagIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('work');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, active, completed
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('dueDate'); // dueDate, priority, createdAt
  const [showFilters, setShowFilters] = useState(false);
  const { currentUser } = useAuth();

  const categories = [
    { id: 'work', name: 'Work', color: 'bg-blue-100 text-blue-800' },
    { id: 'personal', name: 'Personal', color: 'bg-green-100 text-green-800' },
    { id: 'shopping', name: 'Shopping', color: 'bg-purple-100 text-purple-800' },
    { id: 'health', name: 'Health', color: 'bg-red-100 text-red-800' },
    { id: 'education', name: 'Education', color: 'bg-yellow-100 text-yellow-800' },
  ];

  const priorities = [
    { id: 'low', name: 'Low', color: 'bg-gray-100 text-gray-800' },
    { id: 'medium', name: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'high', name: 'High', color: 'bg-red-100 text-red-800' },
  ];

  // Mock tasks data
  const mockTasks = [
    {
      id: '1',
      title: 'Complete project proposal',
      category: 'work',
      priority: 'high',
      completed: false,
      dueDate: new Date(Date.now() + 86400000), // tomorrow
      createdAt: new Date()
    },
    {
      id: '2',
      title: 'Buy groceries',
      category: 'shopping',
      priority: 'medium',
      completed: true,
      dueDate: new Date(Date.now() - 86400000), // yesterday
      createdAt: new Date(Date.now() - 172800000)
    },
    {
      id: '3',
      title: 'Morning workout',
      category: 'health',
      priority: 'high',
      completed: false,
      dueDate: new Date(Date.now() + 43200000), // 12 hours from now
      createdAt: new Date(Date.now() - 86400000)
    },
    {
      id: '4',
      title: 'Read React documentation',
      category: 'education',
      priority: 'low',
      completed: false,
      dueDate: new Date(Date.now() + 172800000), // 2 days from now
      createdAt: new Date(Date.now() - 259200000)
    }
  ];

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      setTasks(mockTasks);
      setLoading(false);
    }, 1000);
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const newTaskObj = {
      id: Date.now().toString(),
      title: newTask,
      category: newTaskCategory,
      priority: newTaskPriority,
      completed: false,
      dueDate: newTaskDueDate ? new Date(newTaskDueDate) : null,
      createdAt: new Date()
    };

    setTasks(prevTasks => [newTaskObj, ...prevTasks]);
    setNewTask('');
    setNewTaskDueDate('');
    setNewTaskPriority('medium');
  };

  const toggleTaskStatus = async (taskId) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const deleteTask = async (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const filteredAndSortedTasks = tasks
    .filter(task => {
      // Apply search filter
      if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Apply status filter
      if (filter === 'active') return !task.completed;
      if (filter === 'completed') return task.completed;
      return true;
    })
    .sort((a, b) => {
      // Apply sorting
      switch (sortBy) {
        case 'dueDate':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'priority':
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'createdAt':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

  const getCategoryColor = (categoryId) => {
    return categories.find(c => c.id === categoryId)?.color || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priorityId) => {
    return priorities.find(p => p.id === priorityId)?.color || 'bg-gray-100 text-gray-800';
  };

  const getTaskStatusColor = (dueDate) => {
    if (!dueDate) return '';
    const today = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'text-red-600';
    if (diffDays <= 2) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {currentUser.displayName || 'User'}</h1>
        <p className="mt-2 text-lg text-gray-600">Here's an overview of your tasks</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FunnelIcon className="h-5 w-5 mr-2" />
            Filters
            <ChevronDownIcon className={`h-5 w-5 ml-2 transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="block w-40 pl-3 pr-10 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="dueDate">Sort by Due Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="createdAt">Sort by Created</option>
          </select>
        </div>
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                  filter === 'all' 
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                  filter === 'active'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                  filter === 'completed'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Completed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <form onSubmit={addTask} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <select
              value={newTaskCategory}
              onChange={(e) => setNewTaskCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {priorities.map(priority => (
                <option key={priority.id} value={priority.id}>
                  {priority.name} Priority
                </option>
              ))}
            </select>
            <input
              type="date"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Task
            </button>
          </div>
        </form>
      </div>

      {/* Task List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : filteredAndSortedTasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No tasks found. Add a new task to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAndSortedTasks.map(task => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className={`p-1 rounded-full ${
                        task.completed
                          ? 'text-green-600 hover:text-green-700'
                          : 'text-gray-400 hover:text-gray-500'
                      }`}
                    >
                      {task.completed ? (
                        <CheckCircleIcon className="h-6 w-6" />
                      ) : (
                        <XCircleIcon className="h-6 w-6" />
                      )}
                    </button>
                    <div>
                      <h3 className={`text-lg font-medium ${
                        task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                      }`}>
                        {task.title}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(task.category)}`}>
                          {categories.find(c => c.id === task.category)?.name}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                          {priorities.find(p => p.id === task.priority)?.name} Priority
                        </span>
                        {task.dueDate && (
                          <span className={`text-sm ${getTaskStatusColor(task.dueDate)}`}>
                            <CalendarIcon className="h-4 w-4 inline mr-1" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <XCircleIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 