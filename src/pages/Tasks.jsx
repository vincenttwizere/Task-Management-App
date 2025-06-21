import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import TaskDetails from '../components/TaskDetails';
import {
  PlusIcon,
  FunnelIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  ClockIcon,
  CalendarIcon,
  TagIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  ChatBubbleLeftIcon,
  PaperClipIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  subscribeToTasks, 
  createTask, 
  toggleTaskStatus,
  updateTask 
} from '../services/taskService';
import { createTaskAssignmentNotification } from '../services/notificationService';
import { getAllUsers } from '../services/userService';

export default function Tasks() {
  const location = useLocation();
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    category: 'all',
    dueDate: 'all',
    assignedTo: 'all'
  });
  const [sortBy, setSortBy] = useState('dueDate');
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'development',
    dueDate: '',
    project: '',
    assignedTo: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if we should show the new task modal
    if (location.state?.showNewTaskModal) {
      setIsNewTaskModalOpen(true);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    if (!currentUser) return;

    // Subscribe to real-time tasks
    const unsubscribe = subscribeToTasks(currentUser.uid, (tasksData) => {
      setTasks(tasksData);
      setLoading(false);
    });

    // Load users for assignment
    const loadUsers = async () => {
      try {
        const usersData = await getAllUsers();
        setUsers(usersData);
      } catch (error) {
        console.error('Error loading users:', error);
      }
    };
    loadUsers();

    return () => unsubscribe();
  }, [currentUser]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-error-100 text-error-800';
      case 'medium':
        return 'bg-warning-100 text-warning-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-success-100 text-success-800';
      case 'in-progress':
        return 'bg-primary-100 text-primary-800';
      case 'todo':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'development':
        return 'bg-purple-100 text-purple-800';
      case 'design':
        return 'bg-pink-100 text-pink-800';
      case 'marketing':
        return 'bg-green-100 text-green-800';
      case 'work':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Advanced filtering with search
  const filteredTasks = tasks.filter(task => {
    // Search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        task.title.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower) ||
        task.category?.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
    }

    // Status filter
    if (filters.status !== 'all' && task.status !== filters.status) return false;
    
    // Priority filter
    if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
    
    // Category filter
    if (filters.category !== 'all' && task.category !== filters.category) return false;
    
    // Assigned to filter
    if (filters.assignedTo !== 'all' && task.assignedTo !== filters.assignedTo) return false;
    
    // Due date filter
    if (filters.dueDate !== 'all') {
      const today = new Date();
      const taskDate = new Date(task.dueDate);
      
      switch (filters.dueDate) {
        case 'today':
          return taskDate.toDateString() === today.toDateString();
        case 'tomorrow':
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          return taskDate.toDateString() === tomorrow.toDateString();
        case 'week':
          const weekFromNow = new Date(today);
          weekFromNow.setDate(weekFromNow.getDate() + 7);
          return taskDate <= weekFromNow && taskDate >= today;
        case 'overdue':
          return taskDate < today && !task.completed;
        default:
          return true;
      }
    }
    
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        return new Date(a.dueDate) - new Date(b.dueDate);
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'status':
        const statusOrder = { todo: 1, 'in-progress': 2, completed: 3 };
        return statusOrder[a.status] - statusOrder[b.status];
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const handleNewTaskSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const taskData = {
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        category: newTask.category,
        dueDate: newTask.dueDate,
        projectId: newTask.project,
        assignedTo: newTask.assignedTo || currentUser.uid
      };

      const createdTask = await createTask(taskData, currentUser.uid);
      
      // Create notification if task is assigned to someone else
      if (newTask.assignedTo && newTask.assignedTo !== currentUser.uid) {
        await createTaskAssignmentNotification(
          createdTask.id,
          newTask.assignedTo,
          newTask.title,
          currentUser.uid
        );
      }

      setIsNewTaskModalOpen(false);
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        category: 'development',
        dueDate: '',
        project: '',
        assignedTo: ''
      });
    } catch (error) {
      console.error('Error creating task:', error);
      setError('Failed to create task. Please try again.');
    }
  };

  const handleTaskStatusToggle = async (taskId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'completed' ? 'todo' : 'completed';
      await toggleTaskStatus(taskId, newStatus === 'completed');
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsTaskDetailsOpen(true);
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      priority: 'all',
      category: 'all',
      dueDate: 'all',
      assignedTo: 'all'
    });
    setSearchTerm('');
  };

  const getUserDisplayName = (userId) => {
    const user = users.find(u => u.uid === userId || u.id === userId);
    return user ? user.displayName : 'Unknown User';
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="loading-spinner h-12 w-12"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Tasks</h1>
            <p className="text-lg text-gray-600">Manage and track your tasks efficiently</p>
          </div>
          <button
            onClick={() => setIsNewTaskModalOpen(true)}
            className="btn-primary hover-glow"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            New Task
          </button>
        </div>

        {/* Search and Filters */}
        <div className="card">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Filters Toggle */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-outline btn-sm"
              >
                <FunnelIcon className="h-4 w-4 mr-2" />
                Filters
                <ChevronDownIcon className={`h-4 w-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input text-sm"
              >
                <option value="dueDate">Sort by Due Date</option>
                <option value="priority">Sort by Priority</option>
                <option value="status">Sort by Status</option>
                <option value="title">Sort by Title</option>
              </select>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                    className="input text-sm"
                  >
                    <option value="all">All Statuses</option>
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={filters.priority}
                    onChange={(e) => setFilters({...filters, priority: e.target.value})}
                    className="input text-sm"
                  >
                    <option value="all">All Priorities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({...filters, category: e.target.value})}
                    className="input text-sm"
                  >
                    <option value="all">All Categories</option>
                    <option value="development">Development</option>
                    <option value="design">Design</option>
                    <option value="marketing">Marketing</option>
                    <option value="work">Work</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <select
                    value={filters.dueDate}
                    onChange={(e) => setFilters({...filters, dueDate: e.target.value})}
                    className="input text-sm"
                  >
                    <option value="all">All Dates</option>
                    <option value="today">Today</option>
                    <option value="tomorrow">Tomorrow</option>
                    <option value="week">This Week</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
                  <select
                    value={filters.assignedTo}
                    onChange={(e) => setFilters({...filters, assignedTo: e.target.value})}
                    className="input text-sm"
                  >
                    <option value="all">All Users</option>
                    {users.map(user => (
                      <option key={user.id} value={user.uid || user.id}>
                        {user.displayName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="btn-secondary btn-sm"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {sortedTasks.length > 0 ? (
            sortedTasks.map((task) => (
              <div
                key={task.id}
                className="card hover-lift cursor-pointer"
                onClick={() => handleTaskClick(task)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTaskStatusToggle(task.id, task.status);
                        }}
                        className={`p-1 rounded-full transition-colors ${
                          task.status === 'completed' 
                            ? 'text-success-600 hover:text-success-700' 
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        <CheckCircleIcon className={`h-5 w-5 ${task.status === 'completed' ? 'fill-current' : ''}`} />
                      </button>
                      
                      <h3 className={`text-lg font-semibold text-gray-900 ${
                        task.status === 'completed' ? 'line-through text-gray-500' : ''
                      }`}>
                        {task.title}
                      </h3>
                    </div>

                    {task.description && (
                      <p className="text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`badge ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className={`badge ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                      {task.category && (
                        <span className={`badge ${getCategoryColor(task.category)}`}>
                          {task.category}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        {task.dueDate && (
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </div>
                        )}
                        <div className="flex items-center">
                          <UserGroupIcon className="h-4 w-4 mr-1" />
                          {getUserDisplayName(task.assignedTo)}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center text-gray-400">
                          <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                          <span className="text-xs">0</span>
                        </div>
                        <div className="flex items-center text-gray-400">
                          <PaperClipIcon className="h-4 w-4 mr-1" />
                          <span className="text-xs">0</span>
                        </div>
                        <EyeIcon className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="card text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClockIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || Object.values(filters).some(f => f !== 'all') 
                  ? 'Try adjusting your search or filters' 
                  : 'Get started by creating your first task'
                }
              </p>
              {!searchTerm && Object.values(filters).every(f => f === 'all') && (
                <button
                  onClick={() => setIsNewTaskModalOpen(true)}
                  className="btn-primary"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Create Task
                </button>
              )}
            </div>
          )}
        </div>

        {/* Task Details Modal */}
        {selectedTask && (
          <TaskDetails
            isOpen={isTaskDetailsOpen}
            onClose={() => {
              setIsTaskDetailsOpen(false);
              setSelectedTask(null);
            }}
            task={selectedTask}
            onTaskUpdate={(updatedTask) => {
              // Handle task updates if needed
              console.log('Task updated:', updatedTask);
            }}
          />
        )}

        {/* New Task Modal */}
        <Transition appear show={isNewTaskModalOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={() => setIsNewTaskModalOpen(false)}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                    <div className="bg-gradient-to-r from-primary-50 to-primary-100 px-6 py-4 border-b border-primary-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-primary-500 rounded-lg">
                            <PlusIcon className="h-6 w-6 text-white" />
                          </div>
                          <Dialog.Title className="text-xl font-bold text-gray-900">
                            Create New Task
                          </Dialog.Title>
                        </div>
                        <button
                          onClick={() => setIsNewTaskModalOpen(false)}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white/50 transition-colors"
                        >
                          <XMarkIcon className="h-6 w-6" />
                        </button>
                      </div>
                    </div>

                    <form onSubmit={handleNewTaskSubmit} className="p-6 space-y-6">
                      {error && (
                        <div className="bg-error-50 border border-error-200 rounded-lg p-4">
                          <p className="text-error-800">{error}</p>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Task Title</label>
                        <input
                          type="text"
                          value={newTask.title}
                          onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                          className="input"
                          placeholder="Enter task title"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                        <textarea
                          value={newTask.description}
                          onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                          className="input resize-none"
                          placeholder="Enter task description"
                          rows="3"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                          <select
                            value={newTask.priority}
                            onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                            className="input"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                          <select
                            value={newTask.category}
                            onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                            className="input"
                          >
                            <option value="development">Development</option>
                            <option value="design">Design</option>
                            <option value="marketing">Marketing</option>
                            <option value="work">Work</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date</label>
                        <input
                          type="datetime-local"
                          value={newTask.dueDate}
                          onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                          className="input"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Assign To</label>
                        <select
                          value={newTask.assignedTo}
                          onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                          className="input"
                        >
                          <option value="">Assign to yourself</option>
                          {users.map(user => (
                            <option key={user.id} value={user.uid || user.id}>
                              {user.displayName}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center justify-end space-x-3 pt-4">
                        <button
                          type="button"
                          onClick={() => setIsNewTaskModalOpen(false)}
                          className="btn-secondary"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn-primary hover-glow"
                        >
                          Create Task
                        </button>
                      </div>
                    </form>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </DashboardLayout>
  );
} 