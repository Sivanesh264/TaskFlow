// src/components/dashboard/StatsCards.jsx
import { MdAssignment, MdHourglassEmpty, MdAutorenew, MdCheckCircle, MdWarning } from "react-icons/md";

const cards = [
  {
    key: "total",
    label: "Total Tasks",
    icon: MdAssignment,
    color: "bg-blue-500",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-600 dark:text-blue-400",
  },
  {
    key: "pending",
    label: "Pending",
    icon: MdHourglassEmpty,
    color: "bg-yellow-500",
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
    text: "text-yellow-600 dark:text-yellow-400",
  },
  {
    key: "inProgress",
    label: "In Progress",
    icon: MdAutorenew,
    color: "bg-purple-500",
    bg: "bg-purple-50 dark:bg-purple-900/20",
    text: "text-purple-600 dark:text-purple-400",
  },
  {
    key: "completed",
    label: "Completed",
    icon: MdCheckCircle,
    color: "bg-green-500",
    bg: "bg-green-50 dark:bg-green-900/20",
    text: "text-green-600 dark:text-green-400",
  },
  {
    key: "overdue",
    label: "Overdue",
    icon: MdWarning,
    color: "bg-red-500",
    bg: "bg-red-50 dark:bg-red-900/20",
    text: "text-red-600 dark:text-red-400",
  },
];

export default function StatsCards({ stats, loading }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map(({ key, label, icon: Icon, bg, text }) => (
        <div key={key} className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
            <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}>
              <Icon className={text} size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {loading ? (
              <span className="block w-10 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            ) : (
              stats?.[key] ?? 0
            )}
          </p>
        </div>
      ))}
    </div>
  );
}
