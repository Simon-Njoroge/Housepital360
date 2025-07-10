import { z } from 'zod';
import { toast } from 'sonner';
import { useTheme } from '@/utils/themeProvider';
import { useChangePassword } from '@/hooks/authhooks';
import GenericForm from '@/common/genericForm';
import type { FieldConfig } from '@/common/genericForm';
import { FaHeartbeat, FaKey } from 'react-icons/fa';
import { authStore } from '@/store/authstore';
import { useNavigate } from '@tanstack/react-router';
import { useStore } from '@tanstack/react-store';

const changePasswordSchema = z.object({
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

const fields: FieldConfig<z.infer<typeof changePasswordSchema>>[] = [
  {
    name: 'newPassword',
    label: 'New Password',
    type: 'password',
    placeholder: 'Enter a strong new password',
  },
];

export default function ChangePasswordForm() {
  const { theme } = useTheme();
  const { mutate: updatePassword, isPending } = useChangePassword();
  const navigate = useNavigate();
  const { userId } = useStore(authStore);

  const handleSubmit = (data: z.infer<typeof changePasswordSchema>) => {
    if (!userId) {
      toast.error('User ID is missing. Please log in again.');
      return;
    }

    updatePassword(
      { userId, newPassword: data.newPassword },
      {
        onSuccess: (res) => {
          toast.success(res.message || '✅ Password updated successfully!');
          navigate({ to: '/', replace: true });
        },
        onError: (err: any) => {
          toast.error(err?.message || '❌ Could not change password. Try again.');
        },
      }
    );
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white p-6 rounded-lg shadow space-y-6">
      <div className="flex items-center gap-2">
        <FaKey className="text-blue-500 text-lg" />
        <h2 className="text-xl font-bold">Reset Your Password</h2>
      </div>

      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Strengthen your account. Enter your new password to continue.
      </p>

      <GenericForm
        schema={changePasswordSchema}
        fields={fields}
        onSubmit={handleSubmit}
        isSubmitting={isPending}
        submitButtonText="Change Password"
        isSubmittingText="Updating..."
      />

      <div className="text-center text-sm text-zinc-600 dark:text-zinc-400 pt-4 flex flex-col items-center">
        <FaHeartbeat className="text-red-500 mb-1 text-xl animate-pulse" />
        <span>
          Powered by <strong className="text-pink-600">Housepital360</strong> — Because your care starts with security 💖
        </span>
      </div>
    </div>
  );
}
