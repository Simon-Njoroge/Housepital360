import { Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { RoleSidebar } from "./sidebar";
import { useStore } from "@tanstack/react-store";
import { authStore } from "@/store/authstore";
import DashboardHeader from "./dashboardheader";

export function DashboardLayout() {
  const [currentTab, setCurrentTab] = useState('Dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const { userId, role } = useStore(authStore);
  // Ensure userId is available before rendering
  if (!userId) {
    return (
      <div className="flex items-center justify-center h-screen text-zinc-500">
        Loading dashboard...
      </div>
    );
  }

  const userRole = role ?? "patient"; 

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-zinc-900 shadow-md">
        <DashboardHeader />
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`transition-all duration-300 ${
            collapsed ? "w-20" : "w-64"
          }`}
        >
          <RoleSidebar
            role={userRole as any}
            current={currentTab}
            onNavigate={setCurrentTab}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />
        </aside>

        {/* Main Content */}
        <main
          className="transition-all duration-300 flex-1 p-4 md:p-6 overflow-y-auto"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}