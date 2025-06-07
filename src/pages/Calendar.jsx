import { useState, useEffect } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths } from 'date-fns';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  ClockIcon,
  TagIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import DashboardLayout from '../components/DashboardLayout';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month'); // 'month' or 'week'
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock tasks data
  const mockTasks = [
    {
      id: '1',
      title: 'Design new homepage',
      description: 'Create wireframes and mockups',
      priority: 'high',
      category: 'design',
      status: 'completed',
      dueDate: new Date(Date.now() - 86400000),
      assignedTo: 'John Doe',
      project: 'Website Redesign'
    },
    {
      id: '2',
      title: 'Implement responsive design',
      description: 'Make the website responsive',
      priority: 'high',
      category: 'development',
      status: 'in-progress',
      dueDate: new Date(Date.now() + 172800000),
      assignedTo: 'Jane Smith',
      project: 'Website Redesign'
    },
    {
      id: '3',
      title: 'Set up development environment',
      description: 'Configure development tools',
      priority: 'medium',
      category: 'development',
      status: 'completed',
      dueDate: new Date(Date.now() - 172800000),
      assignedTo: 'Mike Johnson',
      project: 'Mobile App Development'
    },
    {
      id: '4',
      title: 'Design app wireframes',
      description: 'Create wireframes for mobile app',
      priority: 'high',
      category: 'design',
      status: 'todo',
      dueDate: new Date(Date.now() + 86400000),
      assignedTo: 'Sarah Wilson',
      project: 'Mobile App Development'
    }
  ];

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      setTasks(mockTasks);
      setLoading(false);
    }, 1000);
  }, []);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const getWeekDays = (date) => {
    const days = [];
    const currentDay = date.getDay();
    const startDate = new Date(date);
    startDate.setDate(date.getDate() - currentDay);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }

    return days;
  };

  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'todo':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };

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
        {/* Calendar Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
            </button>
            <h2 className="text-xl font-semibold text-gray-900">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <ChevronRightIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setView('month')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                view === 'month'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                view === 'week'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Week
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div
                key={day}
                className="bg-gray-50 py-2 text-center text-sm font-medium text-gray-500"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {(view === 'month' ? getDaysInMonth(currentDate) : getWeekDays(currentDate)).map((date, index) => (
              <div
                key={index}
                className={`min-h-[120px] bg-white p-2 ${
                  date && date.getMonth() === currentDate.getMonth()
                    ? ''
                    : 'bg-gray-50'
                }`}
              >
                {date && (
                  <>
                    <div className="text-sm font-medium text-gray-900">
                      {date.getDate()}
                    </div>
                    <div className="mt-1 space-y-1">
                      {getTasksForDate(date).map(task => (
                        <div
                          key={task.id}
                          className="p-1 text-xs rounded-md bg-gray-50 hover:bg-gray-100 cursor-pointer"
                        >
                          <div className="font-medium text-gray-900">
                            {task.title}
                          </div>
                          <div className="flex items-center space-x-1 mt-1">
                            <span className={`px-1 py-0.5 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                            <span className={`px-1 py-0.5 rounded-full text-xs ${getStatusColor(task.status)}`}>
                              {task.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Task Details Modal (to be implemented) */}
        {/* This would show when clicking on a task */}
      </div>
    </DashboardLayout>
  );
} 