import { createFileRoute,redirect} from '@tanstack/react-router'
import UserDashboardHome from '@/components/dashboard/user/home'
import { authStore } from '@/store/authstore';
export const Route = createFileRoute('/dashboard/user-home')({
    beforeLoad: () => {
    const { role } = authStore.state;

    if (role !== 'patient') {
      throw redirect({ to: '/' });
    }
  },
  component: UserDashboardHome,
})

