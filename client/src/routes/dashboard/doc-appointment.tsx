import { createFileRoute } from '@tanstack/react-router'
import DoctorDashboardAppointments from '@/components/dashboard/doctor/appointments'
export const Route = createFileRoute('/dashboard/doc-appointment')({
  component: DoctorDashboardAppointments,
})

