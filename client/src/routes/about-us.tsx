import { createFileRoute } from '@tanstack/react-router'
import AboutUs from '@/components/about'
export const Route = createFileRoute('/about-us')({
  component: AboutUs,
})

