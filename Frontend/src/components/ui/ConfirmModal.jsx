// src/components/ui/ConfirmModal.jsx
// Reusable confirmation dialog (used for task deletion)
import { MdWarning } from "react-icons/md";

export default function ConfirmModal({ isOpen, onConfirm, onCancel, title, message, loading }) {
  if (!isOpen) return null;

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
      {/* Modal box */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-md p-6 animate-slide-up">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <MdWarning className="text-red-600 dark:text-red-400" size={20} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              {title || "Confirm Action"}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {message || "Are you sure you want to proceed? This action cannot be undone."}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="btn-secondary text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="btn-danger text-sm"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
