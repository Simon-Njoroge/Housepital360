'use client';

import { FaBell, FaUserMd } from 'react-icons/fa';

function DashboardHeader() {
  return (
    <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-700 p-4">
      <div className="flex items-center gap-4">
        <FaUserMd className="text-2xl text-blue-600 dark:text-blue-400" />
        <div>
          <h1 className="text-xl font-semibold">Dr. Sarah Johnson</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Cardiologist</p>
        </div>
      </div>
      <div className="relative">
        <FaBell className="text-xl text-zinc-700 dark:text-zinc-300" />
        <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
      </div>
    </div>
  );
}

export default  DashboardHeader