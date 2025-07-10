import { createFileRoute } from '@tanstack/react-router'
import ContactUs from '@/components/contact'
export const Route = createFileRoute('/contact-us')({
  component: ContactUs,
})
