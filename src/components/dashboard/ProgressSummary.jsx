import { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';

export default function ProgressSummary({ tasks }) {
  const [completionRate, setCompletionRate] = useState(0);
  const [trend, setTrend] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    // Calculate completion rate
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const rate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    setCompletionRate(Math.round(rate));

    // Calculate trend (comparing this week to last week)
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const startOfLastWeek = new Date(startOfWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

    const thisWeekCompleted = tasks.filter(task => 
      task.completed && 
      new Date(task.completedAt) >= startOfWeek
    ).length;

    const lastWeekCompleted = tasks.filter(task => 
      task.completed && 
      new Date(task.completedAt) >= startOfLastWeek &&
      new Date(task.completedAt) < startOfWeek
    ).length;

    const trendValue = lastWeekCompleted > 0 
      ? ((thisWeekCompleted - lastWeekCompleted) / lastWeekCompleted) * 100 
      : 0;
    setTrend(Math.round(trendValue));

    // Calculate streak
    let currentStreak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    while (true) {
      const tasksCompletedToday = tasks.filter(task => 
        task.completed && 
        new Date(task.completedAt).toDateString() === currentDate.toDateString()
      ).length;

      if (tasksCompletedToday > 0) {
        currentStreak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    setStreak(currentStreak);
  }, [tasks]);

  const getStatusColor = (value) => {
    if (value >= 70) return 'text-green-600';
    if (value >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (value) => {
    if (value > 0) return <ArrowUpIcon className="h-5 w-5 text-green-500" />;
    if (value < 0) return <ArrowDownIcon className="h-5 w-5 text-red-500" />;
    return null;
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Progress Summary
          </h3>
          <ChartBarIcon className="h-6 w-6 text-gray-400" />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Completion Rate */}
          <div>
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-500">Completion Rate</h4>
              <span className={`text-lg font-semibold ${getStatusColor(completionRate)}`}>
                {completionRate}%
              </span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${
                  completionRate >= 70
                    ? 'bg-green-600'
                    : completionRate >= 40
                    ? 'bg-yellow-600'
                    : 'bg-red-600'
                }`}
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </div>

          {/* Weekly Trend */}
          <div>
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-500">Weekly Trend</h4>
              <div className="flex items-center">
                {getTrendIcon(trend)}
                <span
                  className={`ml-1 text-lg font-semibold ${
                    trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}
                >
                  {Math.abs(trend)}%
                </span>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {trend > 0
                ? 'More tasks completed compared to last week'
                : trend < 0
                ? 'Fewer tasks completed compared to last week'
                : 'Same completion rate as last week'}
            </p>
          </div>

          {/* Streak */}
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-500">Current Streak</h4>
              <span className="text-lg font-semibold text-primary-600">
                {streak} {streak === 1 ? 'day' : 'days'}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {streak > 0
                ? 'Keep up the good work!'
                : 'Start your streak by completing tasks today'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 