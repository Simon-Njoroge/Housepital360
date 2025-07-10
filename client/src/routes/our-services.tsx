import { createFileRoute } from '@tanstack/react-router'
import OurServices from '@/components/serices'
export const Route = createFileRoute('/our-services')({
  component: OurServices,
})

