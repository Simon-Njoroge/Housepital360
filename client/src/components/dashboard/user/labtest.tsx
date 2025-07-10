'use client';

import  { useState } from 'react';
import {
  FaFlask,
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner,
  FaPlus,
  FaVial,
  FaRuler,
  FaInfoCircle,
  FaThermometerHalf,
  FaStickyNote,
  FaUserCircle
} from 'react-icons/fa';

import { format } from 'date-fns';
import { z } from 'zod';
import { useStore } from '@tanstack/react-store';
import { authStore } from '@/store/authstore';
import { useLabTestStoreActions } from '@/store/labteststore';
import { useAppointmentsStoreActions } from '@/store/appointmentstore';
import { useLabTestTypeStoreActions } from '@/store/labtesttypestore';
import { Toaster,toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import GenericForm from '@/common/genericForm';
import type { FieldConfig } from '@/common/genericForm';

const statusColors: Record<string, string> = {
  completed: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  ordered: 'bg-gray-100 text-gray-800',
};

const priorityColors: Record<string, string> = {
  routine: 'bg-blue-100 text-blue-700',
  urgent: 'bg-orange-100 text-orange-700',
  STAT: 'bg-red-100 text-red-700',
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <FaCheckCircle className="text-green-500" />;
    case 'pending':
      return <FaExclamationCircle className="text-yellow-500 animate-pulse" />;
    case 'in_progress':
      return <FaSpinner className="text-blue-500 animate-spin" />;
    default:
      return <FaFlask className="text-gray-500" />;
  }
};

const labTestOrderSchema = z.object({
  test_type_id: z.string(),
  appointment_id: z.string(),
  specimen_type: z.string().optional(),
  priority: z.enum(['routine', 'urgent', 'STAT']),
});

type LabTestOrderInput = z.infer<typeof labTestOrderSchema>;

export default function LabResultsPanel() {
  const { userId } = useStore(authStore);
console.log("labtest",userId)
  const {
    labTests: labTestsWrapper,
    isLoading,
    addLabTest,
  } = useLabTestStoreActions(userId ?? undefined);

  const labTests = (labTestsWrapper as any)?.data ?? [];
  const { appointments: appointmentsData } = useAppointmentsStoreActions(userId ?? undefined);
  const { labTestTypes: labTestTypesData } = useLabTestTypeStoreActions();

  const appointments = (appointmentsData as any)?.data ?? [];
  const labTestTypes = (labTestTypesData as any)?.labTestTypes ?? [];

  const [selectedTest, setSelectedTest] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [orderFormOpen, setOrderFormOpen] = useState(false);

  const handleView = (test: any) => {
    setSelectedTest(test);
    setModalOpen(true);
  };

  const fields: FieldConfig<LabTestOrderInput>[] = [
    {
      name: 'test_type_id',
      label: 'Test Type',
      type: 'select',
     
      options: labTestTypes.map((t) => ({ label: t.name, value: t.id })),
    
    },
    {
      name: 'appointment_id',
      label: 'Appointment',
      type: 'select',
    
      options: appointments.map((a:any) => ({
        label: `${a.symptoms} — ${format(new Date(a.created_at), 'MMM dd')}`,
        value: a.id,
      })),
   
    },
    {
      name: 'specimen_type',
      label: 'Specimen Type',
      type: 'text',
    },
    {
      name: 'priority',
      label: 'Priority',
      type: 'select',

      options: ['routine', 'urgent', 'STAT'].map((p) => ({
        label: p.toUpperCase(),
        value: p.toLowerCase(),
      })),
    
    },
  ];

 const handleSubmitOrder = async (formData: LabTestOrderInput) => {
    if (!userId) return toast.error('Missing user ID. Please log in again.');
    try {
      const payload = { patient_id: userId, ...formData };
      console.log('Submitting payload:', payload);
      await addLabTest(payload);
      toast.success('Lab test ordered successfully!');
      setOrderFormOpen(false);
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to order lab test. Please try again.');
    }
  };

  if (!userId || isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-500">
        Loading lab tests...
      </div>
    );
  }

  return (
    <div className="max-w-7xl  px-4 py-8 space-y-6 text-zinc-800 dark:text-zinc-100">
      <Toaster richColors position="top-right" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SummaryCard label="Total Tests" value={labTests.length} color="blue" />
        <SummaryCard label="Completed" value={labTests.filter((t:any) => t.status === 'completed').length} color="green" />
        <SummaryCard label="Pending" value={labTests.filter((t:any) => t.status === 'pending').length} color="yellow" />
        <SummaryCard label="In Progress" value={labTests.filter((t:any) => t.status === 'in_progress').length} color="blue" dashed />
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Lab Tests</h2>
        <Button size="sm" onClick={() => setOrderFormOpen(true)}>
          <FaPlus className="mr-2" /> Order Test
        </Button>
      </div>

      <div className="overflow-auto rounded-xl shadow border bg-white dark:bg-zinc-900">
        <table className="w-full text-sm text-left">
          <thead className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
            <tr>
              <th className="px-4 py-3 font-medium">Test Type</th>
              <th className="px-4 py-3 font-medium">Ordered Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Priority</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {labTests.map((test:any) => (
              <tr key={test.id} className="border-t border-zinc-200 dark:border-zinc-700">
                <td className="px-4 py-3 flex items-center gap-2">
                  {getStatusIcon(test.status)} {test.testType?.name ?? '—'}
                </td>
                <td className="px-4 py-3">
                  {test.created_at ? format(new Date(test.created_at), 'MMM dd, yyyy') : '—'}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[test.status]}`}>
                    {test.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[test.priority]}`}>
                    {test.priority}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Button size="sm" onClick={() => handleView(test)}>View Results</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Test Details</DialogTitle>
            <DialogDescription>{selectedTest?.testType?.name}</DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-2 text-sm">
            <p><strong>Status:</strong> {selectedTest?.status}</p>
            <p><strong>Priority:</strong> {selectedTest?.priority}</p>
            <p><strong>Ordered On:</strong> {selectedTest?.date_ordered ? format(new Date(selectedTest.date_ordered), 'PPpp') : '—'}</p>
            <p><strong>Ordered By:</strong> {selectedTest?.orderedBy?.name}</p>
            <p><strong>Patient:</strong> {selectedTest?.patient?.name}</p>
            <p><strong>Specimen Type:</strong> {selectedTest?.specimen_type || '—'}</p>
            <p><strong>Notes:</strong> {selectedTest?.notes || '—'}</p>
            <div>
              <strong>Results:</strong>
            {selectedTest?.results?.length > 0 ? (
  <ul className="mt-4 space-y-3">
    {selectedTest.results.map((r: any, i: number) => (
      <li key={i} className="p-3 border rounded-lg bg-zinc-50 dark:bg-zinc-800 shadow-sm">
        <div className="flex items-center gap-2 text-base font-semibold">
          <FaVial className="text-indigo-500" />
          <span>{r.parameter_name}</span>
        </div>

        <div className="mt-1 text-sm text-zinc-700 dark:text-zinc-300 space-y-1">
          <p className="flex items-center gap-2">
            <FaThermometerHalf className="text-blue-400" />
            <span className="font-medium">Result:</span> {r.result_value} {r.unit || ''}
          </p>

          {r.reference_range && (
            <p className="flex items-center gap-2">
              <FaRuler className="text-yellow-500" />
              <span className="font-medium">Reference Range:</span> {r.reference_range}
            </p>
          )}

          {r.abnormal_flag && (
            <p className="flex items-center gap-2">
              <FaInfoCircle className={
                r.abnormal_flag === 'high'
                  ? 'text-red-500'
                  : r.abnormal_flag === 'low'
                  ? 'text-yellow-500'
                  : 'text-green-500'
              } />
              <span className="font-medium">Flag:</span> {r.abnormal_flag.toUpperCase()}
            </p>
          )}

          {r.notes && (
            <p className="flex items-center gap-2">
              <FaStickyNote className="text-gray-500" />
              <span className="font-medium">Notes:</span> {r.notes}
            </p>
          )}

          {r.created_by && (
            <p className="flex items-center gap-2">
              <FaUserCircle className="text-blue-600" />
              <span className="font-medium">Recorded by:</span> {r.created_by}
            </p>
          )}
        </div>
      </li>
    ))}
  </ul>
) : (
  <p className="italic text-zinc-500 mt-1">No results available</p>
)}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={orderFormOpen} onOpenChange={setOrderFormOpen}>
        <DialogContent className="max-w-md w-full overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order New Lab Test</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <GenericForm schema={labTestOrderSchema} fields={fields} onSubmit={handleSubmitOrder}   submitButtonText="Submit Order"
              isSubmittingText="Ordering..."/>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  color,
  dashed = false,
}: {
  label: string;
  value: number;
  color: string;
  dashed?: boolean;
}) {
  return (
    <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow border border-zinc-200 dark:border-zinc-800">
      <p className="text-sm text-zinc-500 mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <span className={`text-lg font-semibold text-${color}-600`}>{value}</span>
        {dashed && <span className="h-2 w-2 rounded-full border border-dashed border-zinc-400" />}
      </div>
    </div>
  );
}
