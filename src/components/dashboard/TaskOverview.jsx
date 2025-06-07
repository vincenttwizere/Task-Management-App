import {
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

export default function TaskOverview({ tasks }) {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  const stats = {
    total: tasks.length,
    completedToday: tasks.filter(task => 
      task.completed && 
      new Date(task.completedAt).toDateString() === today.toDateString()
    ).length,
    completedThisWeek: tasks.filter(task => 
      task.completed && 
      new Date(task.completedAt) >= startOfWeek
    ).length,
    overdue: tasks.filter(task => 
      !task.completed && 
      task.dueDate && 
      new Date(task.dueDate) < today
    ).length,
    upcoming: tasks.filter(task => 
      !task.completed && 
      task.dueDate && 
      new Date(task.dueDate) > today
    ).length,
  };

  const cards = [
    {
      name: 'Total Tasks',
      value: stats.total,
      icon: ClipboardDocumentListIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Completed Today',
      value: stats.completedToday,
      icon: CheckCircleIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Overdue Tasks',
      value: stats.overdue,
      icon: ExclamationCircleIcon,
      color: 'bg-red-500',
    },
    {
      name: 'Upcoming Tasks',
      value: stats.upcoming,
      icon: ClockIcon,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.name}
          className="bg-white overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className={`flex-shrink-0 rounded-md p-3 ${card.color}`}>
                <card.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {card.name}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {card.value}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              {card.name === 'Completed Today' && (
                <span className="text-gray-500">
                  {stats.completedThisWeek} completed this week
                </span>
              )}
              {card.name === 'Overdue Tasks' && (
                <span className="text-red-500 font-medium">
                  Needs attention
                </span>
              )}
              {card.name === 'Upcoming Tasks' && (
                <span className="text-gray-500">
                  Due in the next 7 days
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 