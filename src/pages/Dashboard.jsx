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
import { subscribeToTasks, toggleTaskStatus } from '../services/taskService';
import { subscribeToNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../services/notificationService';

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
      console.log('Marking notification as read:', notificationId);
      await markNotificationAsRead(notificationId);
      
      // Optimistically update the local state for immediate UI feedback
      setNotifications(prevNotifications => {
        const updatedNotifications = prevNotifications.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true }
            : notification
        );
        return updatedNotifications;
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllNotificationsAsReadHandler = async () => {
    try {
      console.log('Marking all notifications as read');
      await markAllNotificationsAsRead(currentUser.uid);
      
      // Optimistically update the local state for immediate UI feedback
      setNotifications(prevNotifications => {
        const updatedNotifications = prevNotifications.map(notification => ({ ...notification, read: true }));
        return updatedNotifications;
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
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
      <div className="space-y-8">
        {/* Header with Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-6 sm:space-y-0">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 text-shadow">Dashboard</h1>
            <p className="text-lg text-gray-600 leading-relaxed">Welcome back! Here's what's happening with your projects.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-3 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-xl transition-all duration-200 hover:bg-gray-100 hover-lift"
              >
                <BellIcon className="h-6 w-6" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-error-500 rounded-full shadow-lg animate-pulse-slow">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl py-1 z-50 ring-1 ring-black ring-opacity-5 border border-gray-100">
                  <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-base font-semibold text-gray-900">Notifications</h3>
                    {unreadNotificationsCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsReadHandler}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center transition-colors duration-200"
                      >
                        <CheckIcon className="h-4 w-4 mr-1" />
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map(notification => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-all duration-200 ${
                            !notification.read ? 'bg-gradient-to-r from-primary-50 to-primary-100' : ''
                          }`}
                          onClick={() => markNotificationAsReadHandler(notification.id)}
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              {notification.type === 'task' && <ClipboardDocumentListIcon className="h-5 w-5 text-primary-500" />}
                              {notification.type === 'project' && <FolderIcon className="h-5 w-5 text-success-500" />}
                              {notification.type === 'team' && <UserGroupIcon className="h-5 w-5 text-warning-500" />}
                              {notification.type === 'task_assignment' && <ClipboardDocumentListIcon className="h-5 w-5 text-primary-500" />}
                              {notification.type === 'project_update' && <FolderIcon className="h-5 w-5 text-success-500" />}
                            </div>
                            <div className="ml-3 w-0 flex-1">
                              <div className="flex items-start justify-between">
                                <p className="text-base font-medium text-gray-900">
                                  {notification.title}
                                </p>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 ml-2"></div>
                                )}
                              </div>
                              <p className="mt-1 text-base text-gray-500">
                                {notification.message}
                              </p>
                              <p className="mt-1 text-sm text-gray-400">
                                {notification.createdAt ? 
                                  new Date(notification.createdAt).toLocaleString() : 
                                  notification.time || 'Just now'
                                }
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
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleAddTask}
                className="btn-primary hover-glow"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                New Task
              </button>
              <button
                onClick={handleAddProject}
                className="btn-secondary hover-lift"
              >
                <FolderIcon className="h-5 w-5 mr-2" />
                New Project
              </button>
              <button
                onClick={handleAddTeamMember}
                className="btn-outline hover-glow"
              >
                <UserPlusIcon className="h-5 w-5 mr-2" />
                Add Team Member
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Tasks Overview */}
          <Link
            to="/tasks"
            className="card group hover-lift"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center group-hover:from-primary-200 group-hover:to-primary-300 transition-all duration-300 shadow-soft">
                  <ClipboardDocumentListIcon className="h-7 w-7 text-primary-600" />
                </div>
                <h2 className="ml-4 text-xl font-bold text-gray-900">Tasks</h2>
              </div>
              <span className="badge-primary">
                12 Active
              </span>
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between text-base text-gray-600 mb-3">
                <span>Completion Rate</span>
                <span className="font-bold text-primary-600">75%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '75%' }}></div>
              </div>
            </div>
          </Link>

          {/* Projects Overview */}
          <Link
            to="/projects"
            className="card group hover-lift"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-gradient-to-br from-success-100 to-success-200 rounded-xl flex items-center justify-center group-hover:from-success-200 group-hover:to-success-300 transition-all duration-300 shadow-soft">
                  <FolderIcon className="h-7 w-7 text-success-600" />
                </div>
                <h2 className="ml-4 text-xl font-bold text-gray-900">Projects</h2>
              </div>
              <span className="badge-success">
                3 Active
              </span>
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between text-base text-gray-600 mb-3">
                <span>Overall Progress</span>
                <span className="font-bold text-success-600">45%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill bg-gradient-to-r from-success-500 to-success-600" style={{ width: '45%' }}></div>
              </div>
            </div>
          </Link>

          {/* Calendar Overview */}
          <Link
            to="/calendar"
            className="card group hover-lift"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-gradient-to-br from-warning-100 to-warning-200 rounded-xl flex items-center justify-center group-hover:from-warning-200 group-hover:to-warning-300 transition-all duration-300 shadow-soft">
                  <CalendarIcon className="h-7 w-7 text-warning-600" />
                </div>
                <h2 className="ml-4 text-xl font-bold text-gray-900">Calendar</h2>
              </div>
              <span className="badge-warning">
                5 Today
              </span>
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between text-base text-gray-600 mb-4">
                <span>Upcoming Tasks</span>
                <span className="font-bold text-warning-600">12</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-base text-gray-600">
                  <ClockIcon className="h-4 w-4 text-gray-400 mr-3" />
                  <span>3 tasks due tomorrow</span>
                </div>
                <div className="flex items-center text-base text-gray-600">
                  <ClockIcon className="h-4 w-4 text-gray-400 mr-3" />
                  <span>4 tasks this week</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Analytics Overview */}
          <Link
            to="/analytics"
            className="card group hover-lift"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-gradient-to-br from-error-100 to-error-200 rounded-xl flex items-center justify-center group-hover:from-error-200 group-hover:to-error-300 transition-all duration-300 shadow-soft">
                  <ChartBarIcon className="h-7 w-7 text-error-600" />
                </div>
                <h2 className="ml-4 text-xl font-bold text-gray-900">Analytics</h2>
              </div>
              <span className="badge-error">
                Updated
              </span>
            </div>
            <div className="mt-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900 mb-1">85%</p>
                  <p className="text-base text-gray-600">Productivity</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900 mb-1">92%</p>
                  <p className="text-base text-gray-600">On-time Delivery</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Team Overview */}
          <Link
            to="/projects"
            className="card group hover-lift"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-gradient-to-br from-accent-100 to-accent-200 rounded-xl flex items-center justify-center group-hover:from-accent-200 group-hover:to-accent-300 transition-all duration-300 shadow-soft">
                  <UserGroupIcon className="h-7 w-7 text-accent-600" />
                </div>
                <h2 className="ml-4 text-xl font-bold text-gray-900">Team</h2>
              </div>
              <span className="badge-gray">
                6 Members
              </span>
            </div>
            <div className="mt-6">
              <div className="flex -space-x-2 mb-4">
                {['John', 'Jane', 'Mike', 'Sarah', 'Emily', 'David'].map((name, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 border-2 border-white text-primary-700 font-semibold shadow-soft"
                  >
                    <span className="text-sm">
                      {name[0]}
                    </span>
                  </div>
                ))}
              </div>
              <div className="text-base text-gray-600">
                <span>Active members in 3 projects</span>
              </div>
            </div>
          </Link>

          {/* Recent Activity */}
          <div className="card hover-lift">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shadow-soft">
                <ClockIcon className="h-7 w-7 text-gray-600" />
              </div>
              <h2 className="ml-4 text-xl font-bold text-gray-900">Recent Activity</h2>
            </div>
            <div className="mt-6 space-y-5">
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
                <div key={index} className="flex items-start group/item">
                  <activity.icon className={`h-5 w-5 ${activity.color} mt-1 mr-3 group-hover/item:scale-110 transition-transform duration-200`} />
                  <div className="flex-1">
                    <p className="text-base font-semibold text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-base text-gray-600">
                      {activity.description}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
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