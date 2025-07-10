import { createFileRoute } from '@tanstack/react-router'
import { DashboardLayout } from '@/components/dashboard/main'
export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
})

