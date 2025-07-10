import { useAllLabTestsTypes,useLabTestTypeById,useAddLabTestType,useUpdateLabTestTypeById,useDeleteLabTestTypeById } from '@/hooks/uselabtesttype';
import type { TLabTestType } from '@/types/types';
import { Store } from '@tanstack/store';

// store state type
type LabTestTypeStoreState = {
  labTestTypes: TLabTestType[] | undefined;
  isLoading: boolean;
  error: string | null;
};

// initialize store
export const labTestTypeStore = new Store<LabTestTypeStoreState>({
  labTestTypes: undefined,
  isLoading: false,
  error: null,
});

// CRUD actions hook
export function useLabTestTypeStoreActions() {
  const {
    data: labTestTypes,
    isLoading,
    error,
    refetch,
  } = useAllLabTestsTypes();

  const addMutation = useAddLabTestType();
  const updateMutation = useUpdateLabTestTypeById();
  const deleteMutation = useDeleteLabTestTypeById();

  // Sync the store
  labTestTypeStore.setState({
    labTestTypes: labTestTypes as TLabTestType[] | undefined,
    isLoading,
    error: error ? String(error) : null,
  });

  const getLabTestTypeById = (id: string) => {
    return useLabTestTypeById(id);
  };

  const addLabTestType = async (testType: Partial<TLabTestType>) => {
    const created = await addMutation.mutateAsync(testType);
    refetch();
    return created;
  };

  const updateLabTestTypeById = async (id: string, data: Partial<TLabTestType>) => {
    const updated = await updateMutation.mutateAsync({ id, data });
    refetch();
    return updated;
  };

  const deleteLabTestTypeById = async (id: string) => {
    await deleteMutation.mutateAsync(id);
    refetch();
  };

  return {
    labTestTypes,
    isLoading,
    error,
    getLabTestTypeById,
    addLabTestType,
    updateLabTestTypeById,
    deleteLabTestTypeById,
  };
}
