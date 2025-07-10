import { createFileRoute } from '@tanstack/react-router'
import DoctorPrescriptionsDashboard from '@/components/dashboard/doctor/prescriptions'
export const Route = createFileRoute('/dashboard/doc-prescription')({
  component: DoctorPrescriptionsDashboard,
})

