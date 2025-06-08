import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import {
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

export default function Analytics() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week'); // week, month, year

  // Mock tasks data (same as Dashboard for consistency)
  const mockTasks = [
    {
      id: '1',
      title: 'Complete project proposal',
      category: 'work',
      priority: 'high',
      completed: true,
      dueDate: new Date(Date.now() - 86400000), // yesterday
      createdAt: new Date(Date.now() - 172800000),
      completedAt: new Date(Date.now() - 43200000)
    },
    {
      id: '2',
      title: 'Buy groceries',
      category: 'shopping',
      priority: 'medium',
      completed: true,
      dueDate: new Date(Date.now() - 172800000),
      createdAt: new Date(Date.now() - 259200000),
      completedAt: new Date(Date.now() - 86400000)
    },
    {
      id: '3',
      title: 'Morning workout',
      category: 'health',
      priority: 'high',
      completed: false,
      dueDate: new Date(Date.now() + 43200000),
      createdAt: new Date(Date.now() - 86400000),
      completedAt: null
    },
    {
      id: '4',
      title: 'Read React documentation',
      category: 'education',
      priority: 'low',
      completed: true,
      dueDate: new Date(Date.now() - 259200000),
      createdAt: new Date(Date.now() - 345600000),
      completedAt: new Date(Date.now() - 172800000)
    },
    {
      id: '5',
      title: 'Team meeting',
      category: 'work',
      priority: 'high',
      completed: false,
      dueDate: new Date(),
      createdAt: new Date(Date.now() - 43200000),
      completedAt: null
    },
    {
      id: '6',
      title: 'Update portfolio',
      category: 'work',
      priority: 'medium',
      completed: true,
      dueDate: new Date(Date.now() - 172800000),
      createdAt: new Date(Date.now() - 259200000),
      completedAt: new Date(Date.now() - 86400000)
    }
  ];

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      setTasks(mockTasks);
      setLoading(false);
    }, 1000);
  }, []);

  const getCompletionRate = () => {
    const completed = tasks.filter(task => task.completed).length;
    return tasks.length > 0 ? (completed / tasks.length) * 100 : 0;
  };

  const getCategoryBreakdown = () => {
    const categories = {};
    tasks.forEach(task => {
      if (!categories[task.category]) {
        categories[task.category] = { total: 0, completed: 0 };
      }
      categories[task.category].total++;
      if (task.completed) {
        categories[task.category].completed++;
      }
    });
    return categories;
  };

  const getPriorityBreakdown = () => {
    const priorities = { high: 0, medium: 0, low: 0 };
    tasks.forEach(task => {
      priorities[task.priority]++;
    });
    return priorities;
  };

  const getTimeRangeData = () => {
    const now = new Date();
    const ranges = {
      week: 7,
      month: 30,
      year: 365
    };
    const days = ranges[timeRange];
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    return tasks.filter(task => 
      new Date(task.createdAt) >= startDate
    );
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

  const categoryBreakdown = getCategoryBreakdown();
  const priorityBreakdown = getPriorityBreakdown();
  const timeRangeData = getTimeRangeData();
  const completionRate = getCompletionRate();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setTimeRange('week')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                timeRange === 'week'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                timeRange === 'month'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setTimeRange('year')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                timeRange === 'year'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Year
            </button>
      </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 rounded-md p-3 bg-primary-100">
                  <ChartBarIcon className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Completion Rate
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {Math.round(completionRate)}%
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 rounded-md p-3 bg-green-100">
                  <CalendarIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Tasks Created
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {timeRangeData.length}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 rounded-md p-3 bg-yellow-100">
                  <ClockIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Average Completion Time
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        2.5 days
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 rounded-md p-3 bg-purple-100">
                  <ArrowUpIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Productivity Trend
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        +15%
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Category Breakdown
            </h3>
            <div className="mt-6 space-y-4">
              {Object.entries(categoryBreakdown).map(([category, data]) => (
                <div key={category}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {data.completed}/{data.total} completed
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{
                        width: `${(data.completed / data.total) * 100}%`
                      }}
                    ></div>
        </div>
      </div>
              ))}
            </div>
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Priority Distribution
            </h3>
            <div className="mt-6 grid grid-cols-3 gap-4">
              {Object.entries(priorityBreakdown).map(([priority, count]) => (
                <div
                  key={priority}
                  className={`p-4 rounded-lg ${
                    priority === 'high'
                      ? 'bg-red-50'
                      : priority === 'medium'
                      ? 'bg-yellow-50'
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="text-sm font-medium text-gray-500 capitalize">
                    {priority} Priority
                  </div>
                  <div className="mt-1 text-2xl font-semibold text-gray-900">
                    {count}
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    {Math.round((count / tasks.length) * 100)}% of total
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