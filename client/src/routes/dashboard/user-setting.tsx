import { createFileRoute } from '@tanstack/react-router'
import SettingPanel from '@/components/dashboard/user/setting'
export const Route = createFileRoute('/dashboard/user-setting')({
  component: SettingPanel,
})

