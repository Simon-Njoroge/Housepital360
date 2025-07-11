import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  FaBars,
  FaTimes,
  FaTachometerAlt,
  FaCalendarCheck,
  FaFlask,
  FaPills,
  FaFileInvoiceDollar,
  FaEnvelope,
  FaCogs,
  FaSignOutAlt,
  FaUserInjured,
  FaUsers,
  FaChartBar,
  FaBox,
  FaChevronLeft,
  FaChevronRight,
  FaCalendarAlt
} from "react-icons/fa";
import { cn } from "@/lib/utils";

type MenuItem = { name: string; icon: React.ReactNode; path: string };

type SidebarProps = {
  role: "patient" | "doctor" | "admin" | "labtech" | "pharmacy" | "finance";
  current: string;
  onNavigate: (val: string) => void;
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
};

const menuConfig: Record<SidebarProps["role"], MenuItem[]> = {
  patient: [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/dashboard/user-home" },
    { name: "Appointments", icon: <FaCalendarCheck />, path: "/dashboard/user-appointment" },
    { name: "Calendar", icon: <FaCalendarAlt />, path: "/dashboard/user-calendar" },
    { name: "Lab Results", icon: <FaFlask />, path: "/dashboard/user-labtest" },
    { name: "Pharmacy", icon: <FaPills />, path: "/dashboard/user-pharmacy" },
    { name: "Prescriptions", icon: <FaPills />, path: "/dashboard/user-prescriptions" },
    { name: "Billing", icon: <FaFileInvoiceDollar />, path: "/dashboard/user-billing" },
    { name: "Messages", icon: <FaEnvelope />, path: "/dashboard/user-message" },
    { name: "Settings", icon: <FaCogs />, path: "/dashboard/user-setting" },
    { name: "Logout", icon: <FaSignOutAlt />, path: "/logout" },
  ],
  doctor: [
   
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/dashboard/doc-home" },
    { name: "Appointments", icon: <FaCalendarCheck />, path: "/dashboard/doc-appointment" },
    { name: "Calendar", icon: <FaCalendarAlt />, path: "/dashboard/doc-calendar" },
    // { name: "Patients", icon: <FaUserInjured />, path: "/patients" },
    { name: "Prescriptions", icon: <FaPills />, path: "/dashboard/doc-prescription" },
    { name: "Lab Result", icon: <FaFlask />, path: "/lab-results" },
    { name: "Messages", icon: <FaEnvelope />, path: "/dashboard/doc-message" },
    { name: "Logout", icon: <FaSignOutAlt />, path: "/logout" },
  ],
  admin: [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/dashboard" },
    { name: "Users", icon: <FaUsers />, path: "/users" },
    { name: "Departments", icon: <FaChartBar />, path: "/departments" },
    { name: "Appointments", icon: <FaCalendarCheck />, path: "/appointments" },
    { name: "Billing", icon: <FaFileInvoiceDollar />, path: "/billing" },
    { name: "Reports", icon: <FaChartBar />, path: "/reports" },
    { name: "Settings", icon: <FaCogs />, path: "/settings" },
    { name: "Logout", icon: <FaSignOutAlt />, path: "/logout" },
  ],
  labtech: [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/dashboard" },
    { name: "New Orders", icon: <FaCalendarCheck />, path: "/orders" },
    { name: "Results", icon: <FaFlask />, path: "/results" },
    { name: "Specimens", icon: <FaBox />, path: "/specimens" },
    { name: "Inventory", icon: <FaBox />, path: "/inventory" },
    { name: "Logout", icon: <FaSignOutAlt />, path: "/logout" },
  ],
  pharmacy: [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/dashboard" },
    { name: "Inventory", icon: <FaBox />, path: "/inventory" },
    { name: "Dispense", icon: <FaPills />, path: "/dispense" },
    { name: "Orders", icon: <FaFileInvoiceDollar />, path: "/orders" },
    { name: "Reports", icon: <FaChartBar />, path: "/reports" },
    { name: "Logout", icon: <FaSignOutAlt />, path: "/logout" },
  ],
  finance: [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/dashboard" },
    { name: "Invoices", icon: <FaFileInvoiceDollar />, path: "/invoices" },
    { name: "Payments", icon: <FaFileInvoiceDollar />, path: "/payments" },
    { name: "Insurance Claims", icon: <FaChartBar />, path: "/insurance" },
    { name: "Reports", icon: <FaChartBar />, path: "/reports" },
    { name: "Settings", icon: <FaCogs />, path: "/settings" },
    { name: "Logout", icon: <FaSignOutAlt />, path: "/logout" },
  ],
};

export function RoleSidebar({
  role,
  current,
  onNavigate,
  collapsed,
  setCollapsed,
}: SidebarProps) {
  const menu = menuConfig[role];
  const title = `${role.charAt(0).toUpperCase() + role.slice(1)} Dashboard`;
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarItems = (
    <div className="space-y-2">
      {menu.map((item) => (
        <Link
          key={item.name}
          to={item.path}
          onClick={() => {
            onNavigate(item.name);
            setMobileOpen(false);
          }}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all",
            current === item.name
              ? "bg-blue-600 text-white"
              : "text-zinc-700 hover:bg-zinc-200 dark:text-zinc-300 dark:hover:bg-zinc-700"
          )}
        >
          <span className="text-lg">{item.icon}</span>
          {!collapsed && <span>{item.name}</span>}
        </Link>
      ))}
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileOpen(true)}
          className="text-2xl text-zinc-700 dark:text-white"
        >
          <FaBars />
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden">
          <div className="w-64 h-full bg-white dark:bg-zinc-900 p-4 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{title}</h2>
              <button onClick={() => setMobileOpen(false)} className="text-xl">
                <FaTimes />
              </button>
            </div>
            {SidebarItems}
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden md:flex flex-col sticky top-0 h-screen transition-all duration-300 ease-in-out bg-zinc-50 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800",
          collapsed ? "w-20 p-2" : "w-64 p-4"
        )}
      >
        {/* Branding + Collapse Button */}
        <div className="flex items-center justify-between mb-6">
          {!collapsed && (
            <div>
              <h2 className="text-lg font-bold flex items-center gap-1 text-blue-700">
                🏥 Housepital360
              </h2>
              <p className="text-xs text-muted-foreground">{title}</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          >
            {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>

        {/* Scrollable SidebarItems */}
        <div className="overflow-y-auto flex-1">{SidebarItems}</div>
      </div>
    </>
  );
}