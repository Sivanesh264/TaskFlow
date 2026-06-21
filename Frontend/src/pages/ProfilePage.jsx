// src/pages/ProfilePage.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/ui/LoadingSpinner";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    setLoading(true);
    try {
      const { data } = await authAPI.updateProfile({ name: form.name });
      setUser(data.user);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      {/* ─── Avatar + Name ─────────────────────── */}
      <div className="card p-6">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-6">
          Profile Settings
        </h2>
        <div className="flex items-center gap-5 mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{user?.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Member since {new Date(user?.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ name: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="label">Email Address</label>
            <input
              type="email"
              value={user?.email}
              disabled
              className="input opacity-60 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Email cannot be changed</p>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? <LoadingSpinner size="sm" /> : null}
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* ─── Account Info ──────────────────────── */}
      <div className="card p-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          Account Information
        </h3>
        <div className="space-y-3">
          {[
            { label: "User ID", value: user?._id || user?.id },
            { label: "Account created", value: new Date(user?.createdAt).toLocaleDateString() },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between text-sm py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
              <span className="text-gray-500 dark:text-gray-400">{label}</span>
              <span className="text-gray-900 dark:text-white font-mono text-xs">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
