import { useState, useEffect } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths } from 'date-fns';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import DashboardLayout from '../components/DashboardLayout';

export default function Calendar({ tasks = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month'); // 'day', 'week', 'month'
  const [selectedDate, setSelectedDate] = useState(new Date());

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date) => {
    const start = startOfWeek(date, { weekStartsOn: 0 });
    const end = endOfWeek(date, { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  };

  const getTasksForDate = (date) => {
    return tasks.filter(task => 
      task.dueDate && isSameDay(new Date(task.dueDate), date)
    );
  };

  const getTasksForWeek = (date) => {
    const start = startOfWeek(date, { weekStartsOn: 0 });
    const end = endOfWeek(date, { weekStartsOn: 0 });
    return tasks.filter(task => 
      task.dueDate && 
      new Date(task.dueDate) >= start && 
      new Date(task.dueDate) <= end
    );
  };

  const getTasksForMonth = (date) => {
    return tasks.filter(task => 
      task.dueDate && isSameMonth(new Date(task.dueDate), date)
    );
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => 
      direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1)
    );
  };

  const renderDayView = () => {
    const dayTasks = getTasksForDate(selectedDate);
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </h2>
        </div>
        <div className="p-4">
          {dayTasks.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No tasks scheduled for this day</p>
          ) : (
            <div className="space-y-4">
              {dayTasks.map(task => (
                <div
                  key={task.id}
                  className={`p-3 rounded-lg ${
                    task.priority === 'high'
                      ? 'bg-red-50 border border-red-100'
                      : task.priority === 'medium'
                      ? 'bg-yellow-50 border border-yellow-100'
                      : 'bg-gray-50 border border-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      task.priority === 'high'
                        ? 'bg-red-100 text-red-800'
                        : task.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {task.priority} Priority
                    </span>
                  </div>
                  {task.category && (
                    <p className="mt-1 text-sm text-gray-500">
                      Category: {task.category}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekTasks = getTasksForWeek(currentDate);
    const weekDays = eachDayOfInterval({
      start: startOfWeek(currentDate, { weekStartsOn: 0 }),
      end: endOfWeek(currentDate, { weekStartsOn: 0 }),
    });

    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {format(startOfWeek(currentDate), 'MMM d')} - {format(endOfWeek(currentDate), 'MMM d, yyyy')}
          </h2>
        </div>
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {weekDays.map(day => {
            const dayTasks = weekTasks.filter(task => 
              isSameDay(new Date(task.dueDate), day)
            );
            return (
              <div
                key={day.toString()}
                className={`bg-white p-2 min-h-[150px] ${
                  isSameDay(day, selectedDate) ? 'bg-primary-50' : ''
                }`}
                onClick={() => setSelectedDate(day)}
              >
                <div className="text-sm font-medium text-gray-900">
                  {format(day, 'EEE d')}
                </div>
                <div className="mt-2 space-y-2">
                  {dayTasks.map(task => (
                    <div
                      key={task.id}
                      className={`p-2 text-xs rounded ${
                        task.priority === 'high'
                          ? 'bg-red-100 text-red-800'
                          : task.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {task.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const monthTasks = getTasksForMonth(currentDate);
    const days = getDaysInMonth(currentDate);

    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
        </div>
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {days.map(day => {
            const dayTasks = monthTasks.filter(task => 
              isSameDay(new Date(task.dueDate), day)
            );
            return (
              <div
                key={day.toString()}
                className={`bg-white p-2 min-h-[120px] ${
                  !isSameMonth(day, currentDate)
                    ? 'bg-gray-50 text-gray-400'
                    : isSameDay(day, selectedDate)
                    ? 'bg-primary-50'
                    : ''
                }`}
                onClick={() => setSelectedDate(day)}
              >
                <div className="text-sm font-medium">
                  {format(day, 'd')}
                </div>
                <div className="mt-1 space-y-1">
                  {dayTasks.slice(0, 3).map(task => (
                    <div
                      key={task.id}
                      className={`p-1 text-xs rounded truncate ${
                        task.priority === 'high'
                          ? 'bg-red-100 text-red-800'
                          : task.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {task.title}
                    </div>
                  ))}
                  {dayTasks.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{dayTasks.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <ChevronLeftIcon className="h-5 w-5 text-gray-500" />
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <ChevronRightIcon className="h-5 w-5 text-gray-500" />
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">
              {format(currentDate, 'MMMM yyyy')}
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setView('day')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                view === 'day'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                view === 'week'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setView('month')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                view === 'month'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Month
            </button>
          </div>
        </div>

        {/* Calendar View */}
        <div className="mt-6">
          {view === 'day' && renderDayView()}
          {view === 'week' && renderWeekView()}
          {view === 'month' && renderMonthView()}
        </div>
      </div>
    </DashboardLayout>
  );
} 