'use client'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { useState, useMemo } from 'react'
import { toast, Toaster } from 'sonner'
import { useStore } from '@tanstack/react-store'
import { useDepartmentsStoreActions } from '@/store/departmentstore'
import { useTimeSlotsStoreActions } from '@/store/timeslotstore'
import { useAppointmentsStoreActions } from '@/store/appointmentstore'
import { authStore } from '@/store/authstore'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import {
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
  FaSync,
  FaPlus,
  FaFileMedical,
  FaCalendarAlt,
} from 'react-icons/fa'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

const consultationTypes = ['in_person', 'telemedicine', 'follow_up'] as const
const statusOptions = [
  'all',
  'pending',
  'confirmed',
  'cancelled',
  'rescheduled',
]
const STATUS_ICON_MAP: Record<string, JSX.Element> = {
  pending: <FaSpinner className="animate-spin text-yellow-500" />,
  confirmed: <FaCheckCircle className="text-green-500" />,
  cancelled: <FaTimesCircle className="text-red-500" />,
  rescheduled: <FaSync className="text-blue-500" />,
}

const AppointmentsPanel = () => {
  const { userId } = useStore(authStore)
  const { departments } = useDepartmentsStoreActions()
  const deptList = Array.isArray(departments)
    ? departments
    : ((departments as any)?.departments ?? [])
  const { timeSlots } = useTimeSlotsStoreActions()
  const {
    appointments: resp,
    addAppointment,
    updateAppointmentById,
  } = useAppointmentsStoreActions(userId ?? undefined)
  const appointments = (resp as any)?.data ?? []

  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [bookOpen, setBookOpen] = useState<boolean>(false)
  const [cancelDialogOpen, setCancelDialogOpen] = useState<boolean>(false)
  const [cancelReason, setCancelReason] = useState<string>('')
  const [selectedId, setSelectedId] = useState<string>('')
  const [symptomText, setSymptomText] = useState<string>('')
  const [selectedSlot, setSelectedSlot] = useState<any | null>(null)
  const [selectedDept, setSelectedDept] = useState<string>(
    deptList[0]?.id || '',
  )
  const [consultationType, setConsultationType] =
    useState<(typeof consultationTypes)[number]>('in_person')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const slotOptions =
    timeSlots?.map((slot:any) => ({
      label: `${slot.date} - ${slot.start_time} (${slot.doctor?.name || 'Unknown'}) [${slot.department?.name || 'Dept'}]`,
      value: slot.id || '',
      doctorId: slot.doctor?.id || '',
      doctorName: slot.doctor?.name || '',
      doctorBio: slot.doctor?.doctorProfile?.bio || 'No bio available',
      doctorSpecialization:
        slot.doctor?.doctorProfile?.specialization || 'General',
      doctorExperience: slot.doctor?.doctorProfile?.years_experience || 0,
      doctorPicture: slot.doctor?.doctorProfile?.profile_picture || '',
      departmentId: slot.department?.id || '',
      departmentName: slot.department?.name || '',
      date: slot.date,
      time: `${slot.start_time} - ${slot.end_time}`,
    })) ?? []

  const filteredSlots = useMemo(() => {
    return slotOptions.filter(
      (slot) =>
        slot.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        slot.departmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        slot.date.includes(searchQuery),
    )
  }, [slotOptions, searchQuery])

  const data = useMemo(
    () =>
      appointments
        .filter((a:any) => filterStatus === 'all' || a.status === filterStatus)
        .map((a:any) => ({
          id: a.id,
          doctor: a.doctor?.name || '',
          department: a.department?.name || '',
          date: a.timeSlot?.date || '',
          time: a.timeSlot
            ? `${a.timeSlot.start_time} - ${a.timeSlot.end_time}`
            : '',
          type: a.consultation_type,
          status: a.status,
          symptoms: a.symptoms || '',
        })),
    [appointments, filterStatus],
  )

  const columnHelper = createColumnHelper<(typeof data)[0]>()
  const columns = useMemo(
    () => [
      columnHelper.accessor('doctor', { header: 'Doctor' }),
      columnHelper.accessor('department', { header: 'Department' }),
      columnHelper.accessor('date', { header: 'Date' }),
      columnHelper.accessor('time', { header: 'Time' }),
      columnHelper.accessor('type', { header: 'Type' }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => (
          <span className="flex items-center gap-1">
            {STATUS_ICON_MAP[info.getValue()] || info.getValue()}
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('symptoms', { header: 'Symptoms' }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: (info) => (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSelectedId(info.row.original.id)
                setCancelDialogOpen(true)
              }}
            >
              Cancel
            </Button>
          </div>
        ),
      }),
    ],
    [],
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const handleConfirmCancel = async () => {
    try {
      await updateAppointmentById(selectedId, {
        cancelledAt: new Date().toISOString(),
        cancellationReason: cancelReason,
        isDeleted: true,
        status: 'cancelled',
      })
      toast.success('Appointment cancelled successfully!')
    } catch (e: any) {
      const msg = e.response?.data?.message || e.message
      toast.error('Error: ' + msg)
    } finally {
      setCancelDialogOpen(false)
      setCancelReason('')
    }
  }

  const handleBook = async () => {
    if (!userId || !selectedSlot || !selectedDept) return
    try {
     const response = await addAppointment({
        patient_id: userId,
        department_id: selectedDept,
        doctor_id: selectedSlot.doctorId,
        time_slot_id: selectedSlot.value,
        consultation_type: consultationType,
        symptoms: symptomText,
      })
  
      toast.success('Appointment booked successfully!')
      setBookOpen(false)
      setSymptomText('')
      setSelectedSlot(null)
    } catch (e: any) {
      const msg = e.response?.data?.message || e.message
      toast.error('Error: ' + msg)
    }
  }

  //pagination
  const [currentPage, setCurrentPage] = useState(1)
  const recordsPerPage = 10

  // Calculate the paginated data
  const paginatedData = table
    .getRowModel()
    .rows.slice(
      (currentPage - 1) * recordsPerPage,
      currentPage * recordsPerPage,
    )

  const totalPages = Math.ceil(table.getRowModel().rows.length / recordsPerPage)

  const totalBooked = appointments.length
  const totalConfirmed = appointments.filter(
    (a:any) => a.status === 'confirmed',
  ).length
  const totalCanceled = appointments.filter(
    (a:any) => a.status === 'cancelled',
  ).length
  const totalPending = appointments.filter((a:any) => a.status === 'pending').length
  return (
    <>
      <Toaster position="top-right" richColors />

      {/* Overview Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded shadow bg-blue-100 dark:bg-blue-700">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
            Total Booked
          </h3>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            {totalBooked}
          </p>
        </div>
        <div className="p-4 rounded shadow bg-green-100 dark:bg-green-700">
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
            Total Confirmed
          </h3>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100">
            {totalConfirmed}
          </p>
        </div>
        <div className="p-4 rounded shadow bg-red-100 dark:bg-red-700">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
            Total Canceled
          </h3>
          <p className="text-2xl font-bold text-red-900 dark:text-red-100">
            {totalCanceled}
          </p>
        </div>
        <div className="p-4 rounded shadow bg-yellow-100 dark:bg-yellow-700">
          <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
            Total Pending
          </h3>
          <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
            {totalPending}
          </p>
        </div>
      </div>
      {/* Booking Button */}
      <div className="flex justify-end mb-4">
        <Button
          onClick={() => setBookOpen(true)}
          className="bg-blue-600 text-white"
        >
          <FaPlus className="mr-2" /> Book Appointment
        </Button>
      </div>

      {/* Appointments Table */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="border-b p-2 text-left">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {paginatedData.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-2 align-top">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            <FaArrowLeft /> Previous
          </button>

          {/* Page Info */}
          <span>
            Page {currentPage} of {totalPages}
          </span>

          {/* Next Button */}
          <button
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          >
            Next <FaArrowRight />
          </button>
        </div>
      </div>
      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Reason for Cancellation</Label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => setCancelDialogOpen(false)}
            >
              Close
            </Button>
            <Button onClick={handleConfirmCancel}>Confirm</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Booking Dialog */}
      <Dialog
        open={bookOpen}
        onOpenChange={(val) => {
          setBookOpen(val)
          setSelectedSlot(null)
          setSelectedDept(deptList[0]?.id || '')
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Book Appointment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label>Department</Label>
            <Select value={selectedDept} onValueChange={setSelectedDept}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {deptList.map((d:any) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Label>Search Doctor or Time Slot</Label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="Search by doctor name, department, or date"
            />

            <Label>Time Slot</Label>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {filteredSlots.map((slot) => (
                <Button
                  key={slot.value}
                  variant="outline"
                  className="w-full text-left"
                  onClick={() => setSelectedSlot(slot)}
                >
                  <FaFileMedical className="mr-2" />
                  {slot.label}
                </Button>
              ))}
            </div>

            {selectedSlot && (
              <>
                <div className="flex items-center gap-4">
                  <img
                    src={selectedSlot.doctorPicture}
                    alt="Doctor Profile"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{selectedSlot.doctorName}</p>
                    <p className="text-sm text-gray-500">
                      {selectedSlot.doctorSpecialization}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedSlot.doctorExperience} years of experience
                    </p>
                  </div>
                </div>
                <p className="text-sm mt-2">{selectedSlot.doctorBio}</p>

                <Label>Symptoms</Label>
                <textarea
                  value={symptomText}
                  onChange={(e) => setSymptomText(e.target.value)}
                  className="w-full border rounded p-2"
                  placeholder="Enter symptoms (optional)"
                />

                <Label>Consultation Type</Label>
                <Select
                  value={consultationType}
                  onValueChange={(v) => setConsultationType(v as any)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {consultationTypes.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t.replace(/_/g, ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="mt-4 flex justify-end gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => setBookOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleBook}>Confirm</Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AppointmentsPanel
