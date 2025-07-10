import { createFileRoute } from '@tanstack/react-router'
import InvoicePanel from '@/components/dashboard/user/invoice'
export const Route = createFileRoute('/dashboard/user-billing')({
  component: InvoicePanel,
})

