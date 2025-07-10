import { createFileRoute } from '@tanstack/react-router'
import DoctorDashboard from '@/components/dashboard/doctor/doctor.home'
export const Route = createFileRoute('/dashboard/doc-home')({
  component: DoctorDashboard,
})

