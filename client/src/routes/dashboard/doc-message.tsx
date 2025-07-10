import { createFileRoute } from '@tanstack/react-router'
import ChatDocPage from '@/components/dashboard/doctor/message'
export const Route = createFileRoute('/dashboard/doc-message')({
  component: ChatDocPage,
})
