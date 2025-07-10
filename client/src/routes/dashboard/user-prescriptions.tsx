import { createFileRoute } from '@tanstack/react-router'
import PharmacyPanel from '@/components/dashboard/user/pharmacy'
export const Route = createFileRoute('/dashboard/user-prescriptions')({
  component: PharmacyPanel,
})
