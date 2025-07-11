'use client'

import { usePrescriptionsByUserId, useClearPrescription } from '@/hooks/useprescription'
import { useStore } from '@tanstack/react-store'
import { authStore } from '@/store/authstore'
import { useTheme } from '@/utils/themeProvider'
import {
  FaCapsules,
  FaNotesMedical,
  FaClock,
  FaExclamationTriangle,
  FaUserMd,
  FaTrash,
} from 'react-icons/fa'
import { Spinner } from '@/components/ui/spinner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { toast, Toaster } from 'sonner'

const frequencyToTimesPerDay = (frequency: string): number => {
  const freq = frequency.toLowerCase()
  if (freq.includes('once')) return 1
  if (freq.includes('twice')) return 2
  if (freq.includes('three')) return 3
  if (freq.includes('four')) return 4
  return 1
}

const PrescriptionsPanel = () => {
  const { userId } = useStore(authStore)
  const { theme } = useTheme()
  const {
    data: prescriptions,
    isLoading,
    isError,
    refetch,
  } = usePrescriptionsByUserId(userId as any)

  const clearPrescription = useClearPrescription()

  const checkIfNeedsRefill = (item: any, issuedDate: string): boolean => {
    const takenPerDay = frequencyToTimesPerDay(item.frequency)
    const durationDays = parseInt(item.duration.replace(/\D/g, '')) || 1
    const expectedTotal = takenPerDay * durationDays

    const issued = new Date(issuedDate)
    const now = new Date()
    const daysElapsed = Math.floor((now.getTime() - issued.getTime()) / (1000 * 60 * 60 * 24))

    return daysElapsed >= durationDays || item.quantity < expectedTotal
  }

  const handleClearPrescription = async (id: string | any) => {
    try {
      await clearPrescription.mutateAsync(id)
      toast.success('Prescription cleared successfully')
      await refetch()
    } catch (error) {
      toast.error('Failed to clear prescription. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <Spinner className="mx-auto h-6 w-6" /> Loading prescriptions...
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-red-500">
        Error loading prescriptions. Please try again later.
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6">
      <Toaster position="top-right" richColors />
      <h2 className="text-2xl font-semibold text-primary mb-4">Your Prescriptions</h2>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
        {prescriptions?.map((prescription) => (
          <div
            key={prescription.id}
            className={cn(
              'rounded-lg border p-5 space-y-4 shadow-sm transition-colors',
              theme === 'dark' ? 'bg-muted/40' : 'bg-muted/20'
            )}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                <FaCapsules />
                Prescription by Dr. {(prescription as any).doctor?.name}
              </div>

              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleClearPrescription(prescription.id)}
                className="gap-1 cursor-pointer"
              >
                <FaTrash /> Clear
              </Button>
            </div>

            <div className="space-y-1 text-sm">
              <p className="flex items-center gap-2 text-muted-foreground">
                <FaUserMd /> <strong>Email:</strong> {(prescription as any).doctor?.email}
              </p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <FaClock />
                Valid from{' '}
                <strong>{new Date(prescription.valid_from).toLocaleDateString()}</strong> to{' '}
                <strong>{new Date(prescription.valid_until).toLocaleDateString()}</strong>
              </p>
              <p className="flex items-center gap-2">
                <FaNotesMedical className="text-base text-muted-foreground" />
                <span>
                  <strong>Notes:</strong> {prescription.notes}
                </span>
              </p>
            </div>

            <div className="space-y-4">
              {(prescription as any).prescriptionItems.map((item: any) => {
                const needsRefill = checkIfNeedsRefill(item, prescription.valid_from)

                return (
                  <div
                    key={item.id}
                    className="border rounded-md p-4 bg-background/80 space-y-2 shadow-inner"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div>
                        <p className="font-medium text-base">
                          {item.medication.name}{' '}
                          <span className="text-muted-foreground text-sm">
                            ({item.medication.strength})
                          </span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.dosage} • {item.frequency} • {item.duration}
                        </p>
                        <p className="text-sm">
                          <strong>Qty:</strong> {item.quantity}{' '}
                          <span className="ml-2">
                            <strong>Instructions:</strong> {item.instructions}
                          </span>
                        </p>
                      </div>

                      {needsRefill && (
                        <Badge variant="destructive" className="text-xs flex items-center gap-1">
                          <FaExclamationTriangle className="text-yellow-400" />
                          Medication may have run out
                        </Badge>
                      )}
                    </div>

                    <p className="text-xs italic text-muted-foreground">
                      {item.medication.generic_name} • {item.medication.category} •{' '}
                      {item.medication.manufacturer}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PrescriptionsPanel
