// src/components/layout/AppLayout.jsx
// ─────────────────────────────────────────────
// Main layout wrapper for authenticated pages.
// Contains: Sidebar + Top Navbar + Page Content
// Uses React Router's <Outlet /> to render child pages.
// ─────────────────────────────────────────────

import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function AppLayout() {
  // Controls mobile sidebar open/close
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* ─── Sidebar ─────────────────────────────── */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ─── Mobile Overlay ───────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── Main Content ─────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top navigation bar */}
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Page content — scrollable */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 animate-fade-in">
          {/* <Outlet /> renders the matched child route component */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
