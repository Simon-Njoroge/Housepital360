import { z } from 'zod';
import { useUsersStoreActions } from "@/store/userstore";
import Error from '@/common/error';
import { Toaster, toast } from "sonner";
import {
  FaUserPlus,
  FaPhone,
  FaEnvelope,
  FaSignature,
  FaGoogle,
  FaShieldAlt,
  FaClock,
} from 'react-icons/fa';
import GenericForm from '@/common/genericForm';
import { useTheme } from '@/utils/themeProvider';
import type { FieldConfig } from '@/common/genericForm';
import { useLogin } from '@/hooks/authhooks';

const signInSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z
    .string()
    .regex(/^[0-9]{10,15}$/, 'Phone must be 10–15 digits'),
});

const signInFields: FieldConfig<z.infer<typeof signInSchema>>[] = [
  {
    name: 'name',
    label: 'Full Name',
    type: 'text',
    placeholder: 'Jane Doe',
  },
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    placeholder: 'jane.doe@example.com',
  },
  {
    name: 'phone',
    label: 'Phone Number',
    type: 'text',
    placeholder: '0712345678',
  },
];

export default function SignInSheet() {
  const { theme } = useTheme();
  const { addUser } = useUsersStoreActions();

  const handleSignIn = async (data: z.infer<typeof signInSchema>) => {
    try {
      // Simulate API call delay
      const result = await addUser(data); // If it's async (like an API call)

      toast.success('✅ Registration successful! Please check your email for your password.');
      console.log('✅ Registration Submitted:', data);
    } catch (error: any) {
      console.error('❌ Registration failed:', error);
      toast.error(
        error?.message || 'Registration failed. Please try again later.'
      );
    }
  };

  const handleGoogleSignup = () => {
    console.log('🌐 Google Sign-up clicked');
    // Trigger Google OAuth
  };

  const handleSafaricomSignup = () => {
    console.log('📱 Safaricom Sign-up clicked');
    // Trigger Safaricom logic
  };

  return (
    <div className="w-full max-w-md p-6 space-y-6 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-lg shadow">
      <Toaster richColors position="top-center" />
      <div className="flex items-center space-x-2">
        <FaUserPlus className="text-blue-500 text-lg" />
        <h2 className="text-xl font-bold">Register on Housepital360</h2>
      </div>

      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Create a secure account to access all features.
      </p>

      <GenericForm
        schema={signInSchema}
        fields={signInFields}
        onSubmit={handleSignIn}
        submitButtonText="Register"
        isSubmittingText="Registering..."
      />

      <div className="flex flex-col space-y-3 pt-4">
        <button
          onClick={handleGoogleSignup}
          className="flex items-center justify-center gap-2 border border-gray-300 dark:border-zinc-700 py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
        >
          <FaGoogle className="text-red-500" /> Register with Google
        </button>

        <button
          onClick={handleSafaricomSignup}
          className="flex items-center justify-center gap-2 border border-gray-300 dark:border-zinc-700 py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
        >
          <FaPhone className="text-green-600" /> Register with Safaricom
        </button>
      </div>

      <div className="text-sm text-center text-zinc-600 dark:text-zinc-400 pt-4">
        Already have an account?{' '}
        <a href="#" className="text-blue-600 hover:underline">
          Login here
        </a>
      </div>

      <div className="flex items-center justify-center gap-2 pt-4 text-sm text-zinc-500 dark:text-zinc-400">
        <FaShieldAlt /> Secure Sign-up <span>•</span> <FaClock /> 24/7 Access
      </div>
    </div>
  );
}
