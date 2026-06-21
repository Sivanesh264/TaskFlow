// src/pages/TasksPage.jsx
import { useState, useEffect, useCallback } from "react";
import { MdAdd } from "react-icons/md";
import { taskAPI } from "../services/api";
import TaskCard from "../components/tasks/TaskCard";
import TaskTable from "../components/tasks/TaskTable";
import TaskForm from "../components/tasks/TaskForm";
import TaskFilters from "../components/tasks/TaskFilters";
import ConfirmModal from "../components/ui/ConfirmModal";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import toast from "react-hot-toast";

const defaultFilters = {
  search: "",
  status: "all",
  priority: "all",
  sortBy: "createdAt",
  order: "desc",
};

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(defaultFilters);
  const [viewMode, setViewMode] = useState("card"); // 'card' | 'table'

  // Modal states
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, task: null });
  const [deleting, setDeleting] = useState(false);

  // ─── Fetch Tasks ───────────────────────────────
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters };
      // Remove 'all' values — the API treats empty string as "no filter"
      if (params.status === "all") delete params.status;
      if (params.priority === "all") delete params.priority;
      if (!params.search) delete params.search;

      const { data } = await taskAPI.getAll(params);
      setTasks(data.tasks);
      setTotal(data.total);
    } catch (error) {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    // Debounce search input — wait 400ms after user stops typing
    const timer = setTimeout(fetchTasks, filters.search ? 400 : 0);
    return () => clearTimeout(timer);
  }, [fetchTasks]);

  // ─── Handlers ──────────────────────────────────
  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.task) return;
    setDeleting(true);
    try {
      await taskAPI.delete(deleteModal.task._id);
      toast.success("Task deleted");
      setDeleteModal({ open: false, task: null });
      fetchTasks();
    } catch {
      toast.error("Failed to delete task");
    } finally {
      setDeleting(false);
    }
  };

  // Quick toggle between pending ↔ completed
  const handleStatusToggle = async (task) => {
    const newStatus = task.status === "completed" ? "pending" : "completed";
    try {
      await taskAPI.update(task._id, { status: newStatus });
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? { ...t, status: newStatus } : t))
      );
    } catch {
      toast.error("Failed to update task");
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* ─── Header ────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Tasks</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {total} task{total !== 1 ? "s" : ""} total
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          <MdAdd size={20} />
          <span className="hidden sm:block">New Task</span>
        </button>
      </div>

      {/* ─── Filters ───────────────────────────── */}
      <TaskFilters
        filters={filters}
        onChange={setFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* ─── Content ───────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
            {filters.search || filters.status !== "all" || filters.priority !== "all"
              ? "No tasks match your filters"
              : "No tasks yet"}
          </h3>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
            {filters.search || filters.status !== "all" || filters.priority !== "all"
              ? "Try adjusting your search or filter criteria."
              : "Create your first task to get started!"}
          </p>
          {!(filters.search || filters.status !== "all" || filters.priority !== "all") && (
            <button onClick={() => setShowForm(true)} className="btn-primary mx-auto">
              <MdAdd size={18} /> Create Task
            </button>
          )}
        </div>
      ) : viewMode === "card" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={handleEdit}
              onDelete={(t) => setDeleteModal({ open: true, task: t })}
              onStatusToggle={handleStatusToggle}
            />
          ))}
        </div>
      ) : (
        <TaskTable
          tasks={tasks}
          onEdit={handleEdit}
          onDelete={(t) => setDeleteModal({ open: true, task: t })}
        />
      )}

      {/* ─── Modals ────────────────────────────── */}
      {showForm && (
        <TaskForm
          task={editingTask}
          onClose={handleCloseForm}
          onSuccess={fetchTasks}
        />
      )}

      <ConfirmModal
        isOpen={deleteModal.open}
        title="Delete Task"
        message={`Are you sure you want to delete "${deleteModal.task?.title}"? This cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ open: false, task: null })}
        loading={deleting}
      />
    </div>
  );
}
