import { createFileRoute } from '@tanstack/react-router'
import LabResultsPanel from '@/components/dashboard/user/labtest'
export const Route = createFileRoute('/dashboard/user-labtest')({
  component: LabResultsPanel,
})

