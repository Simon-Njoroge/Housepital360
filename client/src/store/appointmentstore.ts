import {
  useAllAppointments,
  useAppointmentById,
  useAddAppointment,
  useDeleteAppointmentById,
  useUpdateAppointmentById,
  useAppointmentsByUserId,
} from '@/hooks/userappointment';
import type { TAppointment } from '@/types/types';
import { Store } from '@tanstack/store';

// store state type
type AppointmentStoreType = {
  appointments: TAppointment[] | undefined;
  isLoading: boolean;
  error: string | null;
};

export const appointmentStore = new Store<AppointmentStoreType>({
  appointments: undefined,
  isLoading: false,
  error: null,
});

// CRUD actions hooks
export function useAppointmentsStoreActions(userId?: string) {
  // Use user-based or all appointments based on userId
  const {
    data: appointments,
    isLoading,
    error,
    refetch,
  } = userId
    ? useAppointmentsByUserId(userId)
    : useAllAppointments();

  const addAppointmentMutation = useAddAppointment();
  const updateAppointmentMutation = useUpdateAppointmentById();
  const deleteAppointmentMutation = useDeleteAppointmentById();

  // Sync store state
  appointmentStore.setState({
    appointments,
    isLoading,
    error: error ? String(error) : null,
  });

  const getAppointmentById = (id: string) => {
    return useAppointmentById(id);
  };

  const addAppointment = async (appointment: Partial<TAppointment>) => {
    const newAppointment = await addAppointmentMutation.mutateAsync(appointment);
    await refetch();
    return newAppointment;
  };

  const updateAppointmentById = async (
    id: string | number,
    appointment: Partial<TAppointment>,
  ) => {
    const updatedAppointment = await updateAppointmentMutation.mutateAsync({ id, data: appointment });
    await refetch();
    return updatedAppointment;
  };

  const deleteAppointmentById = async (id: string | number) => {
    await deleteAppointmentMutation.mutateAsync(id);
    await refetch();
  };

  return {
    appointments,
    isLoading,
    error,
    getAppointmentById,
    addAppointment,
    updateAppointmentById,
    deleteAppointmentById,
    refetchAppointments: refetch,
  };
}
