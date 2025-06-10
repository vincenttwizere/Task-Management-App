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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Notifications */}
            <div className="relative">
            <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md"
              >
                <BellIcon className="h-6 w-6" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                    {unreadNotificationsCount}
                  </span>
                )}
            </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
          </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map(notification => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                            !notification.read ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => markNotificationAsReadHandler(notification.id)}
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              {notification.type === 'task' && <ClipboardDocumentListIcon className="h-5 w-5 text-blue-500" />}
                              {notification.type === 'project' && <FolderIcon className="h-5 w-5 text-green-500" />}
                              {notification.type === 'team' && <UserGroupIcon className="h-5 w-5 text-purple-500" />}
                            </div>
                            <div className="ml-3 w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </p>
                              <p className="mt-1 text-sm text-gray-500">
                                {notification.message}
                              </p>
                              <p className="mt-1 text-xs text-gray-400">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500">
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
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                New Task
              </button>
              <button
                onClick={handleAddProject}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
              >
                <FolderIcon className="h-5 w-5 mr-2" />
                New Project
              </button>
              <button
                onClick={handleAddTeamMember}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
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
            className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ClipboardDocumentListIcon className="h-8 w-8 text-blue-500" />
                <h2 className="ml-3 text-lg font-medium text-gray-900">Tasks</h2>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                12 Active
              </span>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Completion Rate</span>
                <span>75%</span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </Link>

          {/* Projects Overview */}
          <Link
            to="/projects"
            className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FolderIcon className="h-8 w-8 text-green-500" />
                <h2 className="ml-3 text-lg font-medium text-gray-900">Projects</h2>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                3 Active
              </span>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Overall Progress</span>
                <span>45%</span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
          </Link>

          {/* Calendar Overview */}
          <Link
            to="/calendar"
            className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200"
          >
                  <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CalendarIcon className="h-8 w-8 text-purple-500" />
                <h2 className="ml-3 text-lg font-medium text-gray-900">Calendar</h2>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                5 Today
              </span>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Upcoming Tasks</span>
                <span>12</span>
              </div>
              <div className="mt-2 space-y-2">
                <div className="flex items-center text-sm">
                  <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span>3 tasks due tomorrow</span>
                </div>
                <div className="flex items-center text-sm">
                  <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span>4 tasks this week</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Analytics Overview */}
          <Link
            to="/analytics"
            className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ChartBarIcon className="h-8 w-8 text-yellow-500" />
                <h2 className="ml-3 text-lg font-medium text-gray-900">Analytics</h2>
                      </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Updated
                          </span>
            </div>
            <div className="mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-semibold text-gray-900">85%</p>
                  <p className="text-sm text-gray-500">Productivity</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold text-gray-900">92%</p>
                  <p className="text-sm text-gray-500">On-time Delivery</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Team Overview */}
          <Link
            to="/projects"
            className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <UserGroupIcon className="h-8 w-8 text-red-500" />
                <h2 className="ml-3 text-lg font-medium text-gray-900">Team</h2>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                6 Members
                          </span>
                        </div>
            <div className="mt-4">
              <div className="flex -space-x-2">
                {['John', 'Jane', 'Mike', 'Sarah', 'Emily', 'David'].map((name, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 border-2 border-white"
                  >
                    <span className="text-xs font-medium text-gray-600">
                      {name[0]}
                            </span>
                          </div>
                ))}
              </div>
              <div className="mt-2 text-sm text-gray-500">
                <span>Active members in 3 projects</span>
                      </div>
                    </div>
          </Link>

          {/* Recent Activity */}
          <div className="block p-6 bg-white rounded-lg shadow">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-gray-500" />
              <h2 className="ml-3 text-lg font-medium text-gray-900">Recent Activity</h2>
            </div>
            <div className="mt-4 space-y-4">
              {[
                {
                  action: 'Task completed',
                  description: 'Design new homepage',
                  time: '2 hours ago',
                  icon: CheckCircleIcon,
                  color: 'text-green-500'
                },
                {
                  action: 'Project updated',
                  description: 'Website Redesign',
                  time: '4 hours ago',
                  icon: FolderIcon,
                  color: 'text-blue-500'
                },
                {
                  action: 'Team member joined',
                  description: 'Sarah Wilson',
                  time: '1 day ago',
                  icon: UserGroupIcon,
                  color: 'text-purple-500'
                }
              ].map((activity, index) => (
                <div key={index} className="flex items-start">
                  <activity.icon className={`h-5 w-5 ${activity.color} mt-0.5`} />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-500">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-400">
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