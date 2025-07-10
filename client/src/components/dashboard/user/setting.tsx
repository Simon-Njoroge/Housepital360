'use client'

import { useEffect, useMemo, useState } from 'react'
import { useStore } from '@tanstack/react-store'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { authStore } from '@/store/authstore'
import { usePatientProfilesStoreActions } from '@/store/patientprofilestore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast, Toaster } from 'sonner'
import {
  FaRegAddressCard,
  FaUserEdit,
  FaTrash,
  FaKey,
  FaPhone,
  FaTint,
  FaHeartbeat,
  FaUserShield,
  FaShieldAlt,
  FaDownload,
  FaLock,
} from 'react-icons/fa'
import Image from 'next/image'
import Error from '@/common/error'

const profileSchema = z.object({
  date_of_birth: z.string().optional(),
  blood_type: z.string().optional(),
  genotype: z.string().optional(),
  emergency_contact: z.string().optional(),
  emergency_phone: z.string().optional(),
  insurance_provider: z.string().optional(),
  policy_number: z.string().optional(),
  profile_picture: z.any().optional(),
})

type ProfileForm = z.infer<typeof profileSchema>

const REQUIRED_FIELDS: (keyof ProfileForm)[] = [
  'date_of_birth',
  'blood_type',
  'genotype',
  'emergency_contact',
  'emergency_phone',
  'insurance_provider',
  'policy_number',
  'profile_picture',
]

export default function SettingPanel() {
  const { userId } = useStore(authStore)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [open, setOpen] = useState(false)

  const {
    getPatientProfileById,
    updatePatientProfileById,
    deletePatientProfileById,
  } = usePatientProfilesStoreActions()

  const profileQuery = getPatientProfileById(userId)
  const profile = profileQuery?.profiles
  const user = profileQuery?.user

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: useMemo(() => profile ?? {}, [profile]),
  })

  useEffect(() => {
    if (profile) reset(profile)
  }, [profile, reset])

  const calculateCompletion = () => {
    const filled = REQUIRED_FIELDS.filter((field) => profile?.[field])
    return Math.floor((filled.length / REQUIRED_FIELDS.length) * 100)
  }

  const onSubmit = async (userId: string, data: ProfileForm) => {
    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value)
      })
      if (imageFile) formData.append('image', imageFile)

      const response = await updatePatientProfileById(userId, formData)

      // Check for errors in the backend response
      if (response.error) {
        toast.error(response.error || 'Failed to update profile')
        return
      }

      toast.success('Profile updated successfully')
      setOpen(false)
    } catch (e: any) {
      // Handle unexpected errors
      toast.error(e?.message || 'An unexpected error occurred')
    }
  }
  const onDelete = async () => {
    if (!profile) return
    try {
      await deletePatientProfileById(profile.id)
      toast.success('Profile deleted successfully')
    } catch (e: any) {
      toast.error(e?.message || 'Failed to delete profile')
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <Toaster richColors position="top-right" />

      {/* Top Profile Header */}
      <div className="bg-white dark:bg-zinc-900 shadow rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Image
            src={
              profile?.profile_picture
                ? `/uploads/${profile.profile_picture}`
                : '/default-avatar.png'
            }
            alt="Profile"
            width={64}
            height={64}
            className="rounded-full object-cover"
          />
          <div>
            <h2 className="text-xl font-bold">{user?.name ?? 'Your Name'}</h2>
            <p className="text-sm text-muted-foreground">
              {user?.email ?? 'you@example.com'}
            </p>
            <div className="mt-1">
              <Progress value={calculateCompletion()} />
              <span className="text-xs text-zinc-500">
                Profile Completion: {calculateCompletion()}%
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setOpen(true)} size="sm">
            <FaUserEdit className="mr-2" /> Edit Profile
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.info('Reset link sent')}
          >
            <FaKey className="mr-2" /> Reset Password
          </Button>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl p-4 border bg-card">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <FaRegAddressCard /> Personal Information
          </h3>
          <p>
            <strong>Date of Birth:</strong> {profile?.date_of_birth ?? '—'}
          </p>
          <p>
            <strong>Blood Type:</strong> {profile?.blood_type ?? '—'}
          </p>
          <p>
            <strong>Genotype:</strong> {profile?.genotype ?? '—'}
          </p>
        </div>

        <div className="rounded-xl p-4 border bg-card">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <FaPhone /> Emergency Contact
          </h3>
          <p>
            <strong>Name:</strong> {profile?.emergency_contact ?? '—'}
          </p>
          <p>
            <strong>Phone:</strong> {profile?.emergency_phone ?? '—'}
          </p>
        </div>

        <div className="rounded-xl p-4 border bg-card">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <FaShieldAlt /> Insurance Information
          </h3>
          <p>
            <strong>Provider:</strong> {profile?.insurance_provider ?? '—'}
          </p>
          <p>
            <strong>Policy #:</strong> {profile?.policy_number ?? '—'}
          </p>
        </div>

        <div className="rounded-xl p-4 border bg-card">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <FaUserShield /> Account Settings
          </h3>
          <Button variant="ghost" className="w-full justify-start">
            <FaDownload className="mr-2" /> Download My Data
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <FaLock className="mr-2" /> Privacy Settings
          </Button>
          <Button
            variant="destructive"
            className="w-full justify-start"
            onClick={onDelete}
          >
            <FaTrash className="mr-2" /> Delete Account
          </Button>
        </div>
      </div>

      {/* Edit Dialog */}
      {open && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Update Your Profile</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={handleSubmit((data) => onSubmit(userId, data))}
              className="space-y-4"
            >
              <div>
                <Label>Date of Birth</Label>
                <Input type="date" {...register('date_of_birth')} />
              </div>
              <div>
                <Label>Blood Type</Label>
                <Input placeholder="e.g. O+" {...register('blood_type')} />
              </div>
              <div>
                <Label>Genotype</Label>
                <Input placeholder="e.g. AA" {...register('genotype')} />
              </div>
              <div>
                <Label>Emergency Contact</Label>
                <Input {...register('emergency_contact')} />
              </div>
              <div>
                <Label>Emergency Phone</Label>
                <Input type="tel" {...register('emergency_phone')} />
              </div>
              <div>
                <Label>Insurance Provider</Label>
                <Input {...register('insurance_provider')} />
              </div>
              <div>
                <Label>Policy Number</Label>
                <Input {...register('policy_number')} />
              </div>
              <div>
                <Label>Profile Picture</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
              </div>
              <div className="flex gap-4 mt-4">
                <Button type="submit" disabled={isSubmitting}>
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
