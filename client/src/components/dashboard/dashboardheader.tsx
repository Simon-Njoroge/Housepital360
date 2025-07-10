'use client'

import { useTheme } from '@/utils/themeProvider'
import { Bell } from 'lucide-react'
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils'
import { useStore } from '@tanstack/react-store'
import { authStore } from '@/store/authstore'
import { useUsersStoreActions } from '@/store/userstore'
export default function DashboardHeader() {

  const { userId, role } = useStore(authStore)
  const { getUserById } = useUsersStoreActions()
  const user = getUserById(userId as string)
  const { theme } = useTheme()

  return (
    <header className="flex justify-between items-center px-4 py-2 border-b dark:border-zinc-800 border-zinc-200">
      <div className="relative">
        <Bell className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
        <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
          3
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* <Avatar className="w-8 h-8">
          <AvatarImage src="/images/dr-sarah.jpg" alt="Dr. Sarah Johnson" />
          <AvatarFallback>SJ</AvatarFallback>
        </Avatar> */}
        <div className="text-sm leading-tight">
          <p className="font-medium text-zinc-900 dark:text-zinc-100">
           {user?.data?.name || 'User Name'}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {user?.data?.email || 'Specialty'}
          </p>
        </div>
      </div>
    </header>
  )
}
