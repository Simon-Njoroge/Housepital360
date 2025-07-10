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
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function DoctorDashboardAppointments() {
  const [processingAppointments, setProcessingAppointments] = useState<
    Record<string, boolean>
  >({})
  const { theme } = useTheme()
  const { userId } = useStore(authStore)
  const { data: appointmentsData, refetch: refetchAppointments } = useAppointmentsByDoctorId(userId as string)
  const { data: slotsData } = useDoctorTimeSlots(userId as string)

  const [filterDate, setFilterDate] = useState<string>(
    new Date().toISOString().split('T')[0],
  )
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [autoUpdateDate, setAutoUpdateDate] = useState<boolean>(true) 

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
                    <Button size="sm" variant="ghost">
                      <FaRedoAlt className="mr-1" /> Reschedule
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
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