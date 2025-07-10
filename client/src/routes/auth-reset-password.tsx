import { createFileRoute } from '@tanstack/react-router'
import ChangePasswordForm from '@/auth/resetpasswordbyid'
export const Route = createFileRoute('/auth-reset-password')({
  component: ChangePasswordForm,
})

