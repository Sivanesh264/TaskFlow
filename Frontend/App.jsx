// src/App.jsx
// ─────────────────────────────────────────────
// Root Application Component
// Sets up:
//   - Context providers (Auth, Theme)
//   - React Router (client-side navigation)
//   - Toast notifications
//   - Protected & public route guards
// ─────────────────────────────────────────────

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Context Providers
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

// Layout
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import TasksPage from "./pages/TasksPage";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  return (
    // ThemeProvider: manages dark/light mode
    <ThemeProvider>
      {/* AuthProvider: manages user session */}
      <AuthProvider>
        {/* BrowserRouter: enables client-side routing */}
        <BrowserRouter>
          <Routes>
            {/* ─── Public Routes ─────────────────── */}
            {/* Accessible without login */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* ─── Protected Routes ──────────────── */}
            {/* ProtectedRoute checks if user is logged in */}
            {/* If not, it redirects to /login */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              {/* Nested routes render inside AppLayout's <Outlet /> */}
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            {/* Catch-all: redirect unknown URLs to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>

        {/* Toast notifications — rendered outside the router */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "var(--toast-bg, #fff)",
              color: "var(--toast-color, #1f2937)",
              border: "1px solid var(--toast-border, #e5e7eb)",
              borderRadius: "10px",
              fontSize: "14px",
            },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}
