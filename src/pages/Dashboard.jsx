import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import TaskOverview from '../components/dashboard/TaskOverview';
import ProgressSummary from '../components/dashboard/ProgressSummary';
import PriorityTasks from '../components/dashboard/PriorityTasks';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Mock tasks data
  const mockTasks = [
    {
      id: '1',
      title: 'Complete project proposal',
      category: 'work',
      priority: 'high',
      completed: false,
      dueDate: new Date(Date.now() + 86400000), // tomorrow
      createdAt: new Date(),
      completedAt: null
    },
    {
      id: '2',
      title: 'Buy groceries',
      category: 'shopping',
      priority: 'medium',
      completed: true,
      dueDate: new Date(Date.now() - 86400000), // yesterday
      createdAt: new Date(Date.now() - 172800000),
      completedAt: new Date(Date.now() - 43200000) // 12 hours ago
    },
    {
      id: '3',
      title: 'Morning workout',
      category: 'health',
      priority: 'high',
      completed: false,
      dueDate: new Date(Date.now() + 43200000), // 12 hours from now
      createdAt: new Date(Date.now() - 86400000),
      completedAt: null
    },
    {
      id: '4',
      title: 'Read React documentation',
      category: 'education',
      priority: 'low',
      completed: false,
      dueDate: new Date(Date.now() + 172800000), // 2 days from now
      createdAt: new Date(Date.now() - 259200000),
      completedAt: null
    },
    {
      id: '5',
      title: 'Team meeting',
      category: 'work',
      priority: 'high',
      completed: false,
      dueDate: new Date(), // today
      createdAt: new Date(Date.now() - 43200000),
      completedAt: null
    },
    {
      id: '6',
      title: 'Update portfolio',
      category: 'work',
      priority: 'medium',
      completed: true,
      dueDate: new Date(Date.now() - 172800000), // 2 days ago
      createdAt: new Date(Date.now() - 259200000),
      completedAt: new Date(Date.now() - 86400000) // yesterday
    }
  ];

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      setTasks(mockTasks);
      setLoading(false);
    }, 1000);
  }, []);

  const handleTaskStatusChange = (taskId) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed ? new Date() : null
            }
          : task
      )
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Task Overview Cards */}
        <TaskOverview tasks={tasks} />

        {/* Progress Summary */}
        <ProgressSummary tasks={tasks} />

        {/* Priority Tasks and Today's Top Tasks */}
        <PriorityTasks
          tasks={tasks}
          onTaskStatusChange={handleTaskStatusChange}
        />
      </div>
    </DashboardLayout>
  );
} 