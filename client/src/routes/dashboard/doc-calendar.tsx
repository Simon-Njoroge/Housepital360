import { createFileRoute } from '@tanstack/react-router'
import StandaloneDocCalendar from '@/components/dashboard/doctor/calendar'
export const Route = createFileRoute('/dashboard/doc-calendar')({
  component: StandaloneDocCalendar,
})

