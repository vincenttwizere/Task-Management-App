import { Fragment, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { useAuth } from '../contexts/AuthContext';
import { ChartBarIcon, UserGroupIcon, ViewBoardsIcon, BellIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const [notifications] = useState([
    { id: 1, text: 'New team invitation', isNew: true },
    { id: 2, text: 'Task deadline approaching', isNew: true }
  ]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-400 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">T</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                  TaskFlow
                </span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActivePath('/') 
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-900 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                <ViewBoardsIcon className="w-5 h-5 mr-1.5" />
                Dashboard
              </Link>
              <Link
                to="/team"
                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActivePath('/team')
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-900 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                <UserGroupIcon className="w-5 h-5 mr-1.5" />
                Team
              </Link>
              <Link
                to="/analytics"
                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActivePath('/analytics')
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-900 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                <ChartBarIcon className="w-5 h-5 mr-1.5" />
                Analytics
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {currentUser && (
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center text-gray-400 hover:text-gray-600">
                  <span className="sr-only">View notifications</span>
                  <div className="relative">
                    <BellIcon className="h-6 w-6" />
                    {notifications.some(n => n.isNew) && (
                      <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></div>
                    )}
                  </div>
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {notifications.map((notification) => (
                        <Menu.Item key={notification.id}>
                          {({ active }) => (
                            <a
                              href="#"
                              className={`${
                                active ? 'bg-gray-100' : ''
                              } block px-4 py-2 text-sm text-gray-700`}
                            >
                              <div className="flex items-center">
                                <span className="flex-grow">{notification.text}</span>
                                {notification.isNew && (
                                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                                    New
                                  </span>
                                )}
                              </div>
                            </a>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            )}
            
            {currentUser ? (
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center space-x-3 focus:outline-none">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-r from-primary-600 to-primary-400 flex items-center justify-center text-white font-medium text-lg shadow-md hover:shadow-lg transition-shadow">
                    {currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0)}
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700">
                    {currentUser.displayName || currentUser.email?.split('@')[0]}
                  </span>
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/profile"
                          className={`${
                            active ? 'bg-gray-100' : ''
                          } block px-4 py-2 text-sm text-gray-700`}
                        >
                          Your Profile
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/settings"
                          className={`${
                            active ? 'bg-gray-100' : ''
                          } block px-4 py-2 text-sm text-gray-700`}
                        >
                          Settings
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`${
                            active ? 'bg-gray-100' : ''
                          } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                        >
                          Sign out
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 