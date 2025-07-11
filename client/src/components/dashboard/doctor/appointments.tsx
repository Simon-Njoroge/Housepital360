'use client'

import { useTheme } from '@/utils/themeProvider'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  FaCalendarAlt,
  FaClock,
  FaCheck,
  FaRedoAlt,
  FaVideo,
  FaTrash,
  FaPills
} from 'react-icons/fa'
import { Badge } from '@/components/ui/badge'
import { useAppointmentsByDoctorId } from '@/hooks/userappointment'
import { useDoctorTimeSlots } from '@/hooks/usetimeslot'
import { useState, useEffect } from 'react'
import { useStore } from '@tanstack/react-store'
import { authStore } from '@/store/authstore'
import { Toaster, toast } from 'sonner'
import { confirmAppointment, completeAppointment } from '@/data/appointementapi'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import type { TAppointment } from '@/types/types'
import { useCreatePrescription } from '@/hooks/useprescription'
import { usePharmacyInventoryStoreActions } from '@/store/pharmacyinventorystore'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function DoctorDashboardAppointments() {
  const [processingAppointments, setProcessingAppointments] = useState<
    Record<string, boolean>
  >({})
  const { theme } = useTheme()
  const { userId } = useStore(authStore)
  const { data: appointmentsData, refetch: refetchAppointments } = useAppointmentsByDoctorId(userId as string)
  const { data: slotsData } = useDoctorTimeSlots(userId as string)
  const { inventories = [] } = usePharmacyInventoryStoreActions()
  const createPrescription = useCreatePrescription()
  const [filterDate, setFilterDate] = useState<string>(
    new Date().toISOString().split('T')[0],
  )
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [autoUpdateDate, setAutoUpdateDate] = useState<boolean>(true)
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [prescriptionNotes, setPrescriptionNotes] = useState<string>('')
  const [medicationItems, setMedicationItems] = useState<any[]>([])
  const [medicationForm, setMedicationForm] = useState({
    inventory_id: '',
    dosage: '',
    frequency: '',
    duration: '',
    quantity: '',
    instructions: ''
  })

 


  // Automatically update the calendar to the next day
  useEffect(() => {
    if (autoUpdateDate) {
      const interval = setInterval(() => {
        const now = new Date()
        const currentDate = new Date(filterDate)
        if (now > currentDate) {
          setFilterDate(new Date(now.setDate(now.getDate() + 1)).toISOString().split('T')[0])
        }
      }, 1000) // Check every second
      return () => clearInterval(interval)
    }
  }, [filterDate, autoUpdateDate])

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterDate(e.target.value)
    setAutoUpdateDate(false) // Disable auto-update when the doctor manually selects a date
  }

  const filteredAppointments = (appointmentsData as any)?.patients?.filter(
    (item:any) =>
      item.timeSlot?.date === filterDate &&
      item.patient?.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredSlots = slotsData?.filter((slot) => slot.date === filterDate)

  const todayStats = {
    total: filteredAppointments?.length || 0,
    confirmed:
      filteredAppointments?.filter((a:any) => a.appointment.status === 'confirmed')
        .length || 0,
    completed:
      filteredAppointments?.filter((a:any) => a.appointment.status === 'completed')
        .length || 0,
    inWaiting:
      filteredAppointments?.filter(
        (a:any) => a.appointment.queueStatus === 'waiting',
      ).length || 0,
  }

  const handleConfirmAppointment = async (appointmentId: string) => {
    setProcessingAppointments((prev) => ({ ...prev, [appointmentId]: true }))
    try {
      const response = await confirmAppointment(appointmentId)
      if (!response.success) {
        toast.error(`Error: ${response.error}`)
      } else {
        toast.success('Appointment confirmed successfully!')
        refetchAppointments()
      }
    } catch (error:any) {
      toast.error(`Failed to confirm appointment: ${error.message}`)
    } finally {
      setProcessingAppointments((prev) => ({ ...prev, [appointmentId]: false }))
    }
  }

  const handleCompleteAppointment = async (appointmentId: string) => {
    setProcessingAppointments((prev) => ({ ...prev, [appointmentId]: true }))
    try {
      const response = await completeAppointment(appointmentId)
      if (!response.success) {
        toast.error(`Error: ${response.error}`)
      } else {
        toast.success('Appointment marked as completed successfully!')
        refetchAppointments()
      }
    } catch (error:any) {
      toast.error(`Failed to complete appointment: ${error.message}`)
    } finally {
      setProcessingAppointments((prev) => ({ ...prev, [appointmentId]: false }))
    }
  }

  // Calculate graph data dynamically based on completed appointments per day
 const [graphData, setGraphData] = useState({
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
      {
        label: 'Appointments Completed',
        data: [0, 0, 0, 0, 0, 0, 0],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.4,
      },
    ],
  });

  useEffect(() => {
    const completedAppointmentsPerDay = [0, 0, 0, 0, 0, 0, 0];
    (appointmentsData as any)?.patients?.forEach((appointment: any) => {
      const dayIndex = new Date(appointment.timeSlot?.date).getDay();
      if (appointment.appointment.status === 'completed') {
        completedAppointmentsPerDay[dayIndex] += 1;
      }
    });

    // Update graphData state
    setGraphData((prevData) => ({
      ...prevData,
      datasets: [
        {
          ...prevData.datasets[0],
          data: completedAppointmentsPerDay,
        },
      ],
    }));
  }, [appointmentsData]);

  const graphOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Doctor Working Curve',
      },
    },
  };


    const handleAddMedicationItem = () => {
    if (!medicationForm.inventory_id || !medicationForm.dosage) {
      return toast.error('Please fill required fields.')
    }
    setMedicationItems((prev) => [...prev, medicationForm])
    setMedicationForm({
      inventory_id: '',
      dosage: '',
      frequency: '',
      duration: '',
      quantity: '',
      instructions: ''
    })
  }

    const handleRemoveMedicationItem = (index: number) => {
    setMedicationItems((prev) => prev.filter((_, i) => i !== index))
  }

  const handlePrescriptionSubmit = async () => {
    if (!selectedAppointment) return toast.error('No appointment selected.')
    try {
      const payload = {
        doctor_id: userId,
        patient_id: selectedAppointment?.patient.id,
        appointment_id: selectedAppointment?.appointment.id,
        notes: prescriptionNotes,
        valid_from: new Date().toISOString(),
        valid_until: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
        items: medicationItems.map((item) => ({
          medication_id: inventories.find((inv) => inv.id === item.inventory_id)?.medication.id,
          inventory_id: item.inventory_id,
          dosage: item.dosage,
          frequency: item.frequency,
          duration: item.duration,
          quantity: item.quantity,
          instructions: item.instructions,
        })),
      }

      await createPrescription.mutateAsync(payload)
      toast.success('Prescription submitted successfully!')
      setSelectedAppointment(null)
      setPrescriptionNotes('')
      setMedicationItems([])
          } catch (error: any) {
      toast.error(`Failed to submit prescription: ${error.message}`)
    }
  }


  return (
    <div className="space-y-6 p-4">
      <Toaster richColors position="top-right" />

      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-muted-foreground">Total Bookings</p>
          <h2 className="text-2xl font-bold">{todayStats.total}</h2>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-muted-foreground">Confirmed</p>
          <h2 className="text-2xl font-bold text-green-600">
            {todayStats.confirmed}
          </h2>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-muted-foreground">Completed</p>
          <h2 className="text-2xl font-bold text-blue-600">
            {todayStats.completed}
          </h2>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-muted-foreground">In Waiting</p>
          <h2 className="text-2xl font-bold text-yellow-500">
            {todayStats.inWaiting}
          </h2>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Appointments */}
        <Card className="col-span-2 p-4 overflow-x-auto">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
            <FaCalendarAlt /> Today's Appointments
          </h2>
          <div className="flex flex-wrap gap-4 mb-4">
            <input
              type="date"
              value={filterDate}
              onChange={handleDateChange} 
              className="border rounded p-2 w-full md:w-auto"
            />
            <input
              type="text"
              placeholder="Search by patient name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border rounded p-2 w-full md:w-auto"
            />
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted">
                <th className="p-2 text-left">Patient</th>
                <th className="p-2">Time</th>
                <th className="p-2">Type</th>
                <th className="p-2">Status</th>
                <th className="p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments?.map((item:any, i:any) => (
                <tr key={i} className="border-b">
                  <td className="p-2 font-medium">{item.patient.name}</td>
                  <td className="p-2">
                    <FaClock className="inline mr-1" />{' '}
                    {item.timeSlot.start_time} - {item.timeSlot.end_time}
                  </td>
                  <td className="p-2">
                    <Badge variant="outline">
                      {item.appointment.consultation_type}
                    </Badge>
                  </td>
                  <td className="p-2">
                    <Badge
                      variant={
                        item.appointment.status === 'confirmed'
                          ? 'success'
                          : item.appointment.status === 'completed'
                          ? 'info'
                          : item.appointment.status === 'no_show'
                          ? 'danger'
                          : 'warning'
                      }
                    >
                      {item.appointment.status}
                    </Badge>
                  </td>
                  <td className="p-2 flex gap-2 justify-center">
                    {item.appointment.consultation_type === 'telemedicine' && (
                      <Button
                        className="cursor-pointer"
                        size="sm"
                        variant="ghost"
                        onClick={() => toast.success('Video link created!')}
                      >
                        <FaVideo className="mr-1" /> Link
                      </Button>
                    )}
                    {item.appointment.status === 'no_show' ? (
                      <span className="text-red-600 font-medium">No Show</span>
                    ) : item.appointment.status === 'completed' ? (
                      <Button size="sm" variant="success" disabled>
                        <FaCheck className="mr-1" /> Completed
                      </Button>
                    ) : item.appointment.status === 'confirmed' ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          handleCompleteAppointment(item.appointment?.id || '')
                        }
                        disabled={
                          processingAppointments[item.appointment?.id || '']
                        }
                      >
                        {processingAppointments[item.appointment?.id || ''] ? (
                          'Completing...'
                        ) : (
                          <>
                            <FaCheck className="mr-1" /> Mark Completed
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          handleConfirmAppointment(item.appointment?.id || '')
                        }
                        disabled={
                          processingAppointments[item.appointment?.id || '']
                        }
                      >
                        {processingAppointments[item.appointment?.id || ''] ? (
                          'Confirming...'
                        ) : (
                          <>
                            <FaCheck className="mr-1" /> Confirm
                          </>
                        )}
                      </Button>
                    )}
                     {item.appointment.status === 'completed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedAppointment(item)}
                      >
                        <FaPills className="mr-1" /> Add Prescription
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
         {/* Prescription Sheet */}
       <Sheet open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
  <SheetContent className="w-full max-w-[540px] p-6 sm:p-8 space-y-6">
    <h2 className="text-xl font-semibold flex items-center gap-2 text-primary">
      <FaPills className="text-primary" />
      Add Prescription
    </h2>

    <div className="space-y-4">
      <Textarea
        value={prescriptionNotes}
        onChange={(e) => setPrescriptionNotes(e.target.value)}
        placeholder="Doctor's overall notes (e.g., diagnosis, recommendations)"
        className="min-h-[100px] resize-none"
      />

      <Select
        value={medicationForm.inventory_id}
        onValueChange={(val) => setMedicationForm((f) => ({ ...f, inventory_id: val }))}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Inventory" />
        </SelectTrigger>
        <SelectContent>
          {inventories?.map((inv: any) => (
            <SelectItem key={inv.id} value={inv.id}>
              {inv.medication.name} ({inv.medication.strength})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          value={medicationForm.dosage}
          onChange={(e) => setMedicationForm({ ...medicationForm, dosage: e.target.value })}
          placeholder="Dosage (e.g., 50mg)"
        />
        <Input
          value={medicationForm.frequency}
          onChange={(e) => setMedicationForm({ ...medicationForm, frequency: e.target.value })}
          placeholder="Frequency"
        />
        <Input
          value={medicationForm.duration}
          onChange={(e) => setMedicationForm({ ...medicationForm, duration: e.target.value })}
          placeholder="Duration (e.g., 5 days)"
        />
        <Input
          value={medicationForm.quantity}
          onChange={(e) => setMedicationForm({ ...medicationForm, quantity: e.target.value })}
          placeholder="Quantity"
        />
      </div>

      <Textarea
        value={medicationForm.instructions}
        onChange={(e) => setMedicationForm({ ...medicationForm, instructions: e.target.value })}
        placeholder="Instructions"
        className="resize-none"
      />

      <Button variant="outline" className="w-full" onClick={handleAddMedicationItem}>
        Add Medication Item
      </Button>

      {medicationItems.length > 0 && (
        <div className="space-y-3">
          {medicationItems.map((item, i) => (
            <div
              key={i}
              className="relative border rounded-lg p-4 shadow-sm bg-muted dark:bg-muted/50"
            >
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Medication:</strong>{' '}
                  {inventories.find((inv) => inv.id === item.inventory_id)?.medication.name}
                </p>
                <p>
                  <strong>Dosage:</strong> {item.dosage}
                </p>
                <p>
                  <strong>Qty:</strong> {item.quantity} &nbsp; | &nbsp;
                  <strong>Duration:</strong> {item.duration}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-destructive hover:bg-destructive/10"
                onClick={() => handleRemoveMedicationItem(i)}
              >
                <FaTrash className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Button
        className="w-full"
        onClick={handlePrescriptionSubmit}
        disabled={medicationItems.length === 0}
      >
        Submit Prescription ({medicationItems.length})
      </Button>
    </div>
  </SheetContent>
</Sheet>

        {/* Available Slots */}
        <Card className="p-4">
          <h2 className="text-lg font-bold mb-4">Available Slots</h2>
          <div className="space-y-2">
            {filteredSlots?.map((slot:any, i) => (
              <div
                key={i}
                className={cn(
                  'flex items-center justify-between px-4 py-2 rounded border text-sm',
                  slot.is_booked
                    ? 'bg-muted text-muted-foreground'
                    : 'bg-green-100 text-green-800',
                )}
              >
                <span>
                  <FaClock className="inline mr-1" /> {slot.start_time} -{' '}
                  {slot.end_time}
                </span>
                <Badge variant={slot.is_booked ? 'secondary' : 'success'}>
                  {slot.is_booked ? 'Booked' : 'Free'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Graph */}
      <div className="space-y-6 p-4">
      {/* Graph */}
      <Card className="p-4">
        <h2 className="text-xl font-bold mb-4">Doctor Working Curve</h2>
        <Line data={graphData} options={graphOptions} />
      </Card>
    </div>
    </div>
  )
}