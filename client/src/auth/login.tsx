'use client';

import { z } from 'zod';
import { useState } from 'react';
import { toast, Toaster } from 'sonner';
import { FaLock, FaGoogle, FaPhone } from 'react-icons/fa';
import { FaShieldVirus, FaClock } from 'react-icons/fa6';
import GenericForm from '@/common/genericForm';
import { useTheme } from '@/utils/themeProvider';
import { useLoginHandler } from '@/hooks/uselogin';
import type { FieldConfig } from '@/common/genericForm';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

// Schema
const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  agreeToTerms: z.boolean().refine((val) => val, { message: 'You must agree to terms' }),
});

// Fields
const loginFields: FieldConfig<z.infer<typeof loginSchema>>[] = [
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    placeholder: 'john.doe@example.com',
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
  },
  {
    name: 'agreeToTerms',
    label: 'Agree to Terms',
    type: 'checkbox',
    placeholder: 'I agree to the terms and conditions',
  },
];

export default function LoginSheet() {
  const { theme } = useTheme();
  const { handleLogin, isPending } = useLoginHandler();
  const [pendingLoginData, setPendingLoginData] = useState<{ email: string; password: string } | null>(null);
  const [showForceModal, setShowForceModal] = useState(false);

const onSubmit = ({ email, password }: { email: string; password: string }) => {
  handleLogin(email, password, {
  
    onForceLoginRequired: () => {
      setPendingLoginData({ email, password });
      setShowForceModal(true);
    },
  });
};


  const confirmForceLogin = () => {
    if (pendingLoginData) {
      handleLogin(pendingLoginData.email, pendingLoginData.password, { forceLogin: true });
    }
    setShowForceModal(false);
  };

  return (
    <div className="w-full max-w-md p-6 space-y-6 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-xl shadow">
      <Toaster richColors position="top-center" />
      <div className="flex items-center space-x-2">
        <FaLock className="text-blue-500 text-lg" />
        <h2 className="text-xl font-bold">Login to Housepital360</h2>
      </div>

      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Secure access to your personalized health dashboard.
      </p>

      <GenericForm
        schema={loginSchema}
        fields={loginFields}
        onSubmit={onSubmit}
        isSubmitting={isPending}
        submitButtonText="Login"
        isSubmittingText="Logging in..."
      />

      <div className="flex flex-col space-y-3 pt-4">
        <button className="flex items-center justify-center gap-2 border border-gray-300 dark:border-zinc-700 py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition">
          <FaGoogle className="text-red-500" /> Login with Google
        </button>
        <button className="flex items-center justify-center gap-2 border border-gray-300 dark:border-zinc-700 py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition">
          <FaPhone className="text-green-600" /> Login with Safaricom
        </button>
      </div>

      <div className="text-sm text-center text-zinc-600 dark:text-zinc-400 pt-4">
        <a href="/auth-reset-password" className="text-blue-600 hover:underline">
          Forgot Password?
        </a>
      </div>

      <div className="flex items-center justify-center gap-2 pt-4 text-sm text-zinc-500 dark:text-zinc-400">
        <FaShieldVirus /> Secure Login <span>•</span> <FaClock /> 24/7 Access
      </div>

      {/* 🔐 Force Login Modal */}
      <Dialog open={showForceModal} onOpenChange={setShowForceModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Device Detected</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            A session is already active on another device. Do you want to continue and log in on this device?
          </p>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowForceModal(false)}>Cancel</Button>
            <Button onClick={confirmForceLogin}>Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
