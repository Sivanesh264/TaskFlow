// src/components/ui/Badge.jsx
// Colorful status/priority pill badges

const variants = {
  // Status badges
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  "in-progress": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  // Priority badges
  low: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  medium: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const labels = {
  pending: "Pending",
  "in-progress": "In Progress",
  completed: "Completed",
  low: "Low",
  medium: "Medium",
  high: "High",
};

export default function Badge({ value, className = "" }) {
  const variant = variants[value] || "bg-gray-100 text-gray-600";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variant} ${className}`}
    >
      {labels[value] || value}
    </span>
  );
}
