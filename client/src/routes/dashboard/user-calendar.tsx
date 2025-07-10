import { createFileRoute } from '@tanstack/react-router'
import StandaloneCalendar from '@/components/dashboard/user/calendar'
export const Route = createFileRoute('/dashboard/user-calendar')({
  component: StandaloneCalendar,
})

