import { createFileRoute } from '@tanstack/react-router'
import ChatPage from '@/components/dashboard/user/message'
export const Route = createFileRoute('/dashboard/user-message')({
  component: ChatPage,
})

