// src/components/tasks/TaskCard.jsx
import { MdEdit, MdDelete, MdCalendarToday, MdCheckCircle } from "react-icons/md";
import Badge from "../ui/Badge";

function isOverdue(dueDate, status) {
  if (!dueDate || status === "completed") return false;
  return new Date(dueDate) < new Date();
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function TaskCard({ task, onEdit, onDelete, onStatusToggle }) {
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div className={`card p-4 group hover:shadow-md transition-all duration-200 ${overdue ? "border-red-200 dark:border-red-900" : ""}`}>
      {/* Header: title + actions */}
      <div className="flex items-start gap-3">
        {/* Completion checkbox */}
        <button
          onClick={() => onStatusToggle(task)}
          title={task.status === "completed" ? "Mark as pending" : "Mark as complete"}
          className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
            task.status === "completed"
              ? "border-green-500 bg-green-500 text-white"
              : "border-gray-300 dark:border-gray-600 hover:border-green-400"
          }`}
        >
          {task.status === "completed" && <MdCheckCircle size={14} />}
        </button>

        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-semibold leading-tight ${
            task.status === "completed"
              ? "line-through text-gray-400 dark:text-gray-600"
              : "text-gray-900 dark:text-white"
          }`}>
            {task.title}
          </h3>
          {task.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>

        {/* Action buttons (visible on hover) */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
            title="Edit task"
          >
            <MdEdit size={16} />
          </button>
          <button
            onClick={() => onDelete(task)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
            title="Delete task"
          >
            <MdDelete size={16} />
          </button>
        </div>
      </div>

      {/* Footer: badges + due date */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Badge value={task.status} />
          <Badge value={task.priority} />
        </div>
        {task.dueDate && (
          <div className={`flex items-center gap-1 text-xs ${
            overdue ? "text-red-500" : "text-gray-400 dark:text-gray-500"
          }`}>
            <MdCalendarToday size={12} />
            {overdue ? "Overdue · " : ""}{formatDate(task.dueDate)}
          </div>
        )}
      </div>
    </div>
  );
}
