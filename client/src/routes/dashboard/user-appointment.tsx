import { createFileRoute } from '@tanstack/react-router'
import { lazy } from 'react'

const AppointmentsPanel = lazy(() => import('@/components/dashboard/user/appointment.tsx'));

export const Route = createFileRoute('/dashboard/user-appointment')({
  component: AppointmentsPanel,
})
