import {
  useAllLabTests,
  useLabTestById,
  useAddLabTest,
  useLabtestByUserId,
  useUpdateLabTestById,
  useDeleteLabTestById,
} from '@/hooks/uselabtest';
import type { TLabTest } from '@/types/types';
import { Store } from '@tanstack/store';
import { useEffect } from 'react';

type LabTestStoreType = {
  labTests: TLabTest[] | undefined;
  isLoading: boolean;
  error: string | null;
};

export const labTestStore = new Store<LabTestStoreType>({
  labTests: undefined,
  isLoading: false,
  error: null,
});

export function useLabTestStoreActions(userId?: string) {
  const {
    data: labTests,
    isLoading,
    error,
    refetch,
  } = userId ? useLabtestByUserId(userId) : useAllLabTests();

  const addMutation = useAddLabTest();
  const updateMutation = useUpdateLabTestById();
  const deleteMutation = useDeleteLabTestById();

  // ✅ Update store only when data is ready
  useEffect(() => {
    if (labTests) {
      labTestStore.setState({
        labTests,
        isLoading,
        error: error ? String(error) : null,
      });
    }
  }, [labTests, isLoading, error]);

  const getLabTestById = (id: string) => {
    return useLabTestById(id);
  };

  const addLabTest = async (test: Partial<TLabTest>) => {
    const created = await addMutation.mutateAsync(test);
    await refetch();
    return created;
  };

  const updateLabTestById = async (
    id: string | number,
    test: Partial<TLabTest>
  ) => {
    const updated = await updateMutation.mutateAsync({ id, data: test });
    await refetch();
    return updated;
  };

  const deleteLabTestById = async (id: string | number) => {
    await deleteMutation.mutateAsync(id);
    await refetch();
  };

  return {
    labTests,
    isLoading,
    error,
    getLabTestById,
    addLabTest,
    updateLabTestById,
    deleteLabTestById,
    refetchLabTests: refetch,
  };
}
