import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { format, subDays } from 'date-fns';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Analytics() {
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
  });
  const [dailyProgress, setDailyProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchTaskStats = async () => {
      try {
        const tasksQuery = query(
          collection(db, 'tasks'),
          where('userId', '==', currentUser.uid)
        );
        const snapshot = await getDocs(tasksQuery);
        
        let total = 0;
        let completed = 0;
        
        snapshot.forEach((doc) => {
          total++;
          if (doc.data().completed) {
            completed++;
          }
        });

        setTaskStats({
          total,
          completed,
          pending: total - completed,
        });

        // Generate daily progress data for the last 7 days
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = subDays(new Date(), i);
          return format(date, 'MMM dd');
        }).reverse();

        // Mock data for daily completed tasks
        const mockCompletedTasks = last7Days.map(() => 
          Math.floor(Math.random() * 5)
        );

        setDailyProgress({
          labels: last7Days,
          datasets: [
            {
              label: 'Completed Tasks',
              data: mockCompletedTasks,
              fill: false,
              borderColor: 'rgb(14, 165, 233)',
              tension: 0.1,
            },
          ],
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching task stats:', error);
        setLoading(false);
      }
    };

    fetchTaskStats();
  }, [currentUser]);

  const doughnutData = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [taskStats.completed, taskStats.pending],
        backgroundColor: ['rgb(34, 197, 94)', 'rgb(239, 68, 68)'],
        hoverOffset: 4,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Daily Task Completion',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Task Status Distribution',
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-2 text-gray-600">
          Track your task completion and progress
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Total Tasks</h3>
          <p className="mt-2 text-3xl font-bold text-primary-600">
            {taskStats.total}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Completed Tasks</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {taskStats.completed}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Pending Tasks</h3>
          <p className="mt-2 text-3xl font-bold text-red-600">
            {taskStats.pending}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="h-64">
            {dailyProgress.labels && (
              <Line options={lineOptions} data={dailyProgress} />
            )}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="h-64">
            <Doughnut options={doughnutOptions} data={doughnutData} />
          </div>
        </div>
      </div>
    </div>
  );
} 