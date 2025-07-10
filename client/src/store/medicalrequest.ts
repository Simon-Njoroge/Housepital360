import { useAddMedicationRequest, useAllMedicationRequests } from '@/hooks/usemedicalrequest';
import { useAppointmentsByUserId, useAllAppointments } from '@/hooks/userappointment';
import type { TMedicationRequest } from '@/types/types';
import { Store } from '@tanstack/store';

// Define store state shape
type MedicationRequestStoreType = {
  medicationRequests: TMedicationRequest[] | undefined;
  isLoading: boolean;
  error: string | null;
}

// Shared store instance
export const medicationRequestStore = new Store<MedicationRequestStoreType>({
  medicationRequests: undefined,
  isLoading: false,
  error: null,
});

// Hook to control medication request state/actions
export function useMedicationRequestStoreActions(userId?: any) {
  const {
    data: medicationRequests,
    isLoading,
    error,
    refetch,
  } = useAllMedicationRequests(userId);

  const addMedicationRequestMutation = useAddMedicationRequest();

  // Sync store state on render
  medicationRequestStore.setState({
    medicationRequests,
    isLoading,
    error: error ? String(error) : null,
  });


  const addMedicationRequest = async (medicationRequest: Partial<TMedicationRequest>) => {
    const newMedicationRequest = await addMedicationRequestMutation.mutateAsync(medicationRequest);
    refetch();
    return newMedicationRequest;
  };

  return {
    medicationRequests,
    isLoading,
    error,
    addMedicationRequest,
  };
}
