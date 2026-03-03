import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import BottomNav from "../components/layout/BottomNav";

const SIDEBAR_COLLAPSE_KEY = "sidebarCollapsed";

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(SIDEBAR_COLLAPSE_KEY);
    setIsSidebarCollapsed(saved === "true");
  }, []);

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const toggleDesktopSidebar = () => {
    const next = !isSidebarCollapsed;
    setIsSidebarCollapsed(next);
    localStorage.setItem(SIDEBAR_COLLAPSE_KEY, String(next));
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 transition-all">
      <Sidebar
        isMobileOpen={isSidebarOpen}
        onClose={closeSidebar}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleDesktopSidebar}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar onMenuClick={openSidebar} />

        <main className="flex-1 p-3 pb-20 sm:p-4 sm:pb-20 md:p-5 md:pb-6 lg:p-6 lg:pb-6">
          <Outlet />
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
