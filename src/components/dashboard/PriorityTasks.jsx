import { useState, useEffect } from 'react';
import {
  FlagIcon,
  StarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

export default function PriorityTasks({ tasks, onTaskStatusChange }) {
  const [priorityTasks, setPriorityTasks] = useState([]);
  const [todaysTopTasks, setTodaysTopTasks] = useState([]);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get high priority tasks
    const highPriority = tasks
      .filter(task => 
        !task.completed && 
        task.priority === 'high' &&
        (!task.dueDate || new Date(task.dueDate) >= today)
      )
      .sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });

    // Get today's top tasks (due today or overdue)
    const topTasks = tasks
      .filter(task => 
        !task.completed && 
        task.dueDate && 
        new Date(task.dueDate).toDateString() === today.toDateString()
      )
      .sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      })
      .slice(0, 3);

    setPriorityTasks(highPriority);
    setTodaysTopTasks(topTasks);
  }, [tasks]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getDueDateColor = (dueDate) => {
    if (!dueDate) return 'text-gray-500';
    const today = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'text-red-600';
    if (diffDays <= 2) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* High Priority Tasks */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              High Priority Tasks
            </h3>
            <FlagIcon className="h-6 w-6 text-red-500" />
          </div>

          <div className="mt-6 space-y-4">
            {priorityTasks.length === 0 ? (
              <p className="text-gray-500 text-sm">No high priority tasks at the moment</p>
            ) : (
              priorityTasks.map(task => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => onTaskStatusChange(task.id)}
                      className={`p-1 rounded-full ${
                        task.completed
                          ? 'text-green-600 hover:text-green-700'
                          : 'text-gray-400 hover:text-gray-500'
                      }`}
                    >
                      {task.completed ? (
                        <CheckCircleIcon className="h-5 w-5" />
                      ) : (
                        <XCircleIcon className="h-5 w-5" />
                      )}
                    </button>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {task.title}
                      </h4>
                      {task.dueDate && (
                        <div className="flex items-center mt-1">
                          <ClockIcon className={`h-4 w-4 mr-1 ${getDueDateColor(task.dueDate)}`} />
                          <span className={`text-xs ${getDueDateColor(task.dueDate)}`}>
                            Due {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority} Priority
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Today's Top Tasks */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Today's Top Tasks
            </h3>
            <StarIcon className="h-6 w-6 text-yellow-500" />
          </div>

          <div className="mt-6 space-y-4">
            {todaysTopTasks.length === 0 ? (
              <p className="text-gray-500 text-sm">No tasks due today</p>
            ) : (
              todaysTopTasks.map((task, index) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center justify-center w-6 h-6 text-sm font-medium text-gray-500 bg-gray-200 rounded-full">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {task.title}
                      </h4>
                      <div className="flex items-center mt-1">
                        <span className={`text-xs ${getPriorityColor(task.priority)}`}>
                          {task.priority} Priority
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onTaskStatusChange(task.id)}
                    className={`p-1 rounded-full ${
                      task.completed
                        ? 'text-green-600 hover:text-green-700'
                        : 'text-gray-400 hover:text-gray-500'
                    }`}
                  >
                    {task.completed ? (
                      <CheckCircleIcon className="h-5 w-5" />
                    ) : (
                      <XCircleIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 