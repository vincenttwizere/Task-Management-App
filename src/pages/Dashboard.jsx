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
} from '@heroicons/react/24/outline';
import { subscribeToTasks, toggleTaskStatus } from '../services/taskService';
import { subscribeToNotifications, markNotificationAsRead } from '../services/notificationService';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    // Subscribe to real-time tasks
    const unsubscribeTasks = subscribeToTasks(currentUser.uid, (tasksData) => {
      setTasks(tasksData);
      setLoading(false);
    });

    // Subscribe to real-time notifications
    const unsubscribeNotifications = subscribeToNotifications(currentUser.uid, (notificationsData) => {
      setNotifications(notificationsData);
    });

    return () => {
      unsubscribeTasks();
      unsubscribeNotifications();
    };
  }, [currentUser]);

  const handleTaskStatusChange = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const newStatus = task.status === 'completed' ? 'todo' : 'completed';
      await toggleTaskStatus(taskId, newStatus === 'completed');
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleAddTask = () => {
    navigate('/tasks', { state: { showNewTaskModal: true } });
  };

  const handleAddProject = () => {
    navigate('/projects', { state: { showNewProjectModal: true } });
  };

  const handleAddTeamMember = () => {
    navigate('/projects', { state: { showAddTeamModal: true } });
  };

  const markNotificationAsReadHandler = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
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
      <div className="space-y-6">
        {/* Header with Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-lg text-gray-600">Welcome back! Here's what's happening with your projects.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg transition-colors"
              >
                <BellIcon className="h-6 w-6" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-error-500 rounded-full">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-strong py-1 z-10 ring-1 ring-black ring-opacity-5">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <h3 className="text-base font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map(notification => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                            !notification.read ? 'bg-primary-50' : ''
                          }`}
                          onClick={() => markNotificationAsReadHandler(notification.id)}
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              {notification.type === 'task' && <ClipboardDocumentListIcon className="h-5 w-5 text-primary-500" />}
                              {notification.type === 'project' && <FolderIcon className="h-5 w-5 text-success-500" />}
                              {notification.type === 'team' && <UserGroupIcon className="h-5 w-5 text-warning-500" />}
                            </div>
                            <div className="ml-3 w-0 flex-1">
                              <p className="text-base font-medium text-gray-900">
                                {notification.title}
                              </p>
                              <p className="mt-1 text-base text-gray-500">
                                {notification.message}
                              </p>
                              <p className="mt-1 text-sm text-gray-400">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-base text-gray-500">
                        No notifications
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleAddTask}
                className="btn-primary"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                New Task
              </button>
              <button
                onClick={handleAddProject}
                className="btn-secondary"
              >
                <FolderIcon className="h-5 w-5 mr-2" />
                New Project
              </button>
              <button
                onClick={handleAddTeamMember}
                className="btn-outline"
              >
                <UserPlusIcon className="h-5 w-5 mr-2" />
                Add Team Member
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Tasks Overview */}
          <Link
            to="/tasks"
            className="card group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                  <ClipboardDocumentListIcon className="h-6 w-6 text-primary-600" />
                </div>
                <h2 className="ml-3 text-xl font-semibold text-gray-900">Tasks</h2>
              </div>
              <span className="badge-primary">
                12 Active
              </span>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-base text-gray-600">
                <span>Completion Rate</span>
                <span className="font-semibold">75%</span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary-500 h-2 rounded-full transition-all duration-300" style={{ width: '75%' }}></div>
              </div>
            </div>
          </Link>

          {/* Projects Overview */}
          <Link
            to="/projects"
            className="card group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-success-100 rounded-lg flex items-center justify-center group-hover:bg-success-200 transition-colors">
                  <FolderIcon className="h-6 w-6 text-success-600" />
                </div>
                <h2 className="ml-3 text-xl font-semibold text-gray-900">Projects</h2>
              </div>
              <span className="badge-success">
                3 Active
              </span>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-base text-gray-600">
                <span>Overall Progress</span>
                <span className="font-semibold">45%</span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div className="bg-success-500 h-2 rounded-full transition-all duration-300" style={{ width: '45%' }}></div>
              </div>
            </div>
          </Link>

          {/* Calendar Overview */}
          <Link
            to="/calendar"
            className="card group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-warning-100 rounded-lg flex items-center justify-center group-hover:bg-warning-200 transition-colors">
                  <CalendarIcon className="h-6 w-6 text-warning-600" />
                </div>
                <h2 className="ml-3 text-xl font-semibold text-gray-900">Calendar</h2>
              </div>
              <span className="badge-warning">
                5 Today
              </span>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-base text-gray-600">
                <span>Upcoming Tasks</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="mt-2 space-y-2">
                <div className="flex items-center text-base text-gray-600">
                  <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span>3 tasks due tomorrow</span>
                </div>
                <div className="flex items-center text-base text-gray-600">
                  <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span>4 tasks this week</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Analytics Overview */}
          <Link
            to="/analytics"
            className="card group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-error-100 rounded-lg flex items-center justify-center group-hover:bg-error-200 transition-colors">
                  <ChartBarIcon className="h-6 w-6 text-error-600" />
                </div>
                <h2 className="ml-3 text-xl font-semibold text-gray-900">Analytics</h2>
              </div>
              <span className="badge-error">
                Updated
              </span>
            </div>
            <div className="mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">85%</p>
                  <p className="text-base text-gray-600">Productivity</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">92%</p>
                  <p className="text-base text-gray-600">On-time Delivery</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Team Overview */}
          <Link
            to="/projects"
            className="card group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-accent-100 rounded-lg flex items-center justify-center group-hover:bg-accent-200 transition-colors">
                  <UserGroupIcon className="h-6 w-6 text-accent-600" />
                </div>
                <h2 className="ml-3 text-xl font-semibold text-gray-900">Team</h2>
              </div>
              <span className="badge-gray">
                6 Members
              </span>
            </div>
            <div className="mt-4">
              <div className="flex -space-x-2">
                {['John', 'Jane', 'Mike', 'Sarah', 'Emily', 'David'].map((name, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 border-2 border-white text-primary-700 font-medium"
                  >
                    <span className="text-xs">
                      {name[0]}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-base text-gray-600">
                <span>Active members in 3 projects</span>
              </div>
            </div>
          </Link>

          {/* Recent Activity */}
          <div className="card">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <ClockIcon className="h-6 w-6 text-gray-600" />
              </div>
              <h2 className="ml-3 text-xl font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <div className="mt-4 space-y-4">
              {[
                {
                  action: 'Task completed',
                  description: 'Design new homepage',
                  time: '2 hours ago',
                  icon: CheckCircleIcon,
                  color: 'text-success-500'
                },
                {
                  action: 'Project updated',
                  description: 'Website Redesign',
                  time: '4 hours ago',
                  icon: FolderIcon,
                  color: 'text-primary-500'
                },
                {
                  action: 'Team member joined',
                  description: 'Sarah Wilson',
                  time: '1 day ago',
                  icon: UserGroupIcon,
                  color: 'text-warning-500'
                }
              ].map((activity, index) => (
                <div key={index} className="flex items-start">
                  <activity.icon className={`h-5 w-5 ${activity.color} mt-0.5`} />
                  <div className="ml-3">
                    <p className="text-base font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-base text-gray-600">
                      {activity.description}
                    </p>
                    <p className="text-sm text-gray-400">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 