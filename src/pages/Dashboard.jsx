import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PlusIcon, CalendarIcon, TagIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('work');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, active, completed
  const { currentUser } = useAuth();

  const categories = [
    { id: 'work', name: 'Work', color: 'bg-blue-100 text-blue-800' },
    { id: 'personal', name: 'Personal', color: 'bg-green-100 text-green-800' },
    { id: 'shopping', name: 'Shopping', color: 'bg-purple-100 text-purple-800' },
    { id: 'health', name: 'Health', color: 'bg-red-100 text-red-800' },
  ];

  // Mock tasks data
  const mockTasks = [
    {
      id: '1',
      title: 'Complete project proposal',
      category: 'work',
      completed: false,
      dueDate: new Date(Date.now() + 86400000), // tomorrow
      createdAt: new Date()
    },
    {
      id: '2',
      title: 'Buy groceries',
      category: 'shopping',
      completed: true,
      dueDate: new Date(Date.now() - 86400000), // yesterday
      createdAt: new Date(Date.now() - 172800000)
    },
    {
      id: '3',
      title: 'Morning workout',
      category: 'health',
      completed: false,
      dueDate: new Date(Date.now() + 43200000), // 12 hours from now
      createdAt: new Date(Date.now() - 86400000)
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
      completed: false,
      dueDate: newTaskDueDate ? new Date(newTaskDueDate) : null,
      createdAt: new Date()
    };

    setTasks(prevTasks => [newTaskObj, ...prevTasks]);
    setNewTask('');
    setNewTaskDueDate('');
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

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const getCategoryColor = (categoryId) => {
    return categories.find(c => c.id === categoryId)?.color || 'bg-gray-100 text-gray-800';
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
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
        <p className="mt-2 text-lg text-gray-600">
          {currentUser.displayName || 'User'}, here's your task overview
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <form onSubmit={addTask} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <select
              value={newTaskCategory}
              onChange={(e) => setNewTaskCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Task
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Your Tasks</h2>
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
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No tasks found. Add a new task to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map(task => (
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