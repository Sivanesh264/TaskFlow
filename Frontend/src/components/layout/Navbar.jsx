// src/components/layout/Navbar.jsx
import { MdMenu, MdLightMode, MdDarkMode, MdLogout, MdNotifications } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useLocation } from "react-router-dom";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/tasks": "My Tasks",
  "/profile": "Profile",
};

export default function Navbar({ onMenuClick }) {
  const { logout, user } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();

  const pageTitle = pageTitles[location.pathname] || "TaskFlow";

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
      {/* ─── Left side ─────────────────────────── */}
      <div className="flex items-center gap-4">
        {/* Hamburger menu — mobile only */}
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-lg"
        >
          <MdMenu size={22} />
        </button>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
          {pageTitle}
        </h1>
      </div>

      {/* ─── Right side ────────────────────────── */}
      <div className="flex items-center gap-2">
        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 transition-all"
        >
          {darkMode ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
        </button>

        {/* Logout button */}
        <button
          onClick={logout}
          title="Logout"
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
        >
          <MdLogout size={18} />
          <span className="hidden sm:block">Logout</span>
        </button>
      </div>
    </header>
  );
}
