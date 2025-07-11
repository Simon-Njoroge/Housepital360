import { createFileRoute } from '@tanstack/react-router'
import PrescriptionsPanel from '@/components/dashboard/user/prescriptions'
export const Route = createFileRoute('/dashboard/user-prescriptions')({
  component: PrescriptionsPanel,
})
