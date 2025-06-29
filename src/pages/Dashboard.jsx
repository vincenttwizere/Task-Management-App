import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import {
  PlusIcon,
  UserPlusIcon,
  BellIcon,
  ClipboardDocumentListIcon,
  FolderIcon,
  CalendarIcon,
  ChartBarIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    // Mock data for testing
    setTasks([
      {
        id: '1',
        title: 'Welcome to TaskFlow!',
        description: 'This is your first task. Click to mark it complete.',
        priority: 'high',
        status: 'todo',
        dueDate: new Date(Date.now() + 86400000),
        project: 'Getting Started'
      },
      {
        id: '2',
        title: 'Explore the dashboard',
        description: 'Take a look around and see what TaskFlow can do for you.',
        priority: 'medium',
        status: 'todo',
        dueDate: new Date(Date.now() + 172800000),
        project: 'Getting Started'
      }
    ]);
    setLoading(false);
  }, [currentUser]);

  const handleTaskStatusChange = async (taskId) => {
    try {
      const updatedTasks = tasks.map(task => 
        task.id === taskId 
          ? { ...task, status: task.status === 'completed' ? 'todo' : 'completed' }
          : task
      );
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleAddTask = () => {
    navigate('/dashboard');
  };

  const handleAddProject = () => {
    navigate('/dashboard');
  };

  const handleAddTeamMember = () => {
    navigate('/dashboard');
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

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
      <div className="space-y-8">
        {/* Header with Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-6 sm:space-y-0">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-lg text-gray-600 leading-relaxed">Welcome back! Here's what's happening with your projects.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-3 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl transition-all duration-200 hover:bg-gray-100"
              >
                <BellIcon className="h-6 w-6" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full shadow-lg">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handleAddTask}
                className="btn-primary"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Task
              </button>
              <button
                onClick={handleAddProject}
                className="btn-secondary"
              >
                <FolderIcon className="h-5 w-5 mr-2" />
                New Project
              </button>
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <CheckCircleIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to TaskFlow!</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Your task management app is now running successfully. You can start creating tasks, 
              managing projects, and collaborating with your team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleAddTask}
                className="btn-primary"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Create Your First Task
              </button>
              <button
                onClick={handleAddProject}
                className="btn-outline"
              >
                <FolderIcon className="h-5 w-5 mr-2" />
                Start a Project
              </button>
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="bg-white rounded-2xl shadow-soft border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Tasks</h3>
          </div>
          <div className="p-6">
            {tasks.length > 0 ? (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleTaskStatusChange(task.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          task.status === 'completed'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600'
                        }`}
                      >
                        <CheckCircleIcon className="h-5 w-5" />
                      </button>
                      <div>
                        <h4 className={`font-medium ${
                          task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
                        }`}>
                          {task.title}
                        </h4>
                        <p className="text-sm text-gray-500">{task.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        task.priority === 'high' ? 'bg-red-100 text-red-800' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No tasks yet. Create your first task to get started!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 