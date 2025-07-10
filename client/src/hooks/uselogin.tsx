import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';
import { authStore } from '@/store/authstore';
import { useLogin } from '@/hooks/authhooks';
import { UserRole } from '@/types/types';
interface LoginOptions {
  forceLogin?: boolean;
  onForceLoginRequired?: () => void;
  onSuccess?: () => void;
}

export const useLoginHandler = () => {
  const navigate = useNavigate();
  const { mutate: loginUser, isPending } = useLogin();

  const handleLogin = (
    email: string,
    password: string,
    options: LoginOptions = {}
  ) => {
    const { forceLogin = false, onForceLoginRequired, onSuccess } = options;

    loginUser(
      { email, password, forceLogin },
      {
        onSuccess: (res) => {
          const { message, requiresPasswordUpdate, requireForceLogin, user } = res.data;

          // Handle force login requirement
          if (requireForceLogin && !forceLogin) {
            if (onForceLoginRequired) {
              onForceLoginRequired();
            } else {
              const confirm = window.confirm(`${message}\n\nContinue on this device and log out the other?`);
              if (confirm) {
                handleLogin(email, password, { forceLogin: true });
              } else {
                toast.info('Login cancelled.');
              }
            }
            return;
          }

          // Hydrate store using user info from response
          if (user?.id && user?.role) {
            authStore.setState({
              userId: user.id,
              role: user.role,
            });
            console.log('✅ Auth store updated from backend response:', user);
          } else {
            toast.error('Invalid user data from server.');
            return;
          }

          toast.success(message || 'Welcome to Housepital360!');
          onSuccess?.();

          // Navigate based on role and password update requirement
          if (requiresPasswordUpdate) {
            navigate({
              to: '/auth-reset-password',
              replace: true,
            });
          } else if (user.role === UserRole.DOCTOR) {
            navigate({
              to: '/dashboard/doc-home',
              replace: true,
            });
          } else {
            navigate({
              to: '/dashboard/user-home',
              replace: true,
            });
          }
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || 'Login failed');
        },
      }
    );
  };

  return { handleLogin, isPending };
};