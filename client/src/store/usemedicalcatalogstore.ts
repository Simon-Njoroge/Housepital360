import {
  useAllMedicationCatalogs,
  useMedicationCatalogById,
  useAddMedicationCatalog,
  useUpdateMedicationCatalogById,
  useDeleteMedicationCatalogById,
} from '@/hooks/usemedicalcatalog'
import type { TMedicationCatalog } from '@/types/types'
import { Store } from '@tanstack/store'
import { useEffect } from 'react'
// store state type

type MedicationCatalogStoreType = {
  catalogs: TMedicationCatalog[] | undefined
  isLoading: boolean
  error: string | null
}

export const medicationCatalogStore = new Store<MedicationCatalogStoreType>({
  catalogs: undefined,
  isLoading: false,
  error: null,
})

//CRUD actions hooks

export function useMedicationCatalogStoreActions() {
  const {
    data: catalogs,
    isLoading,
    error,
    refetch,
  } = useAllMedicationCatalogs()
  const addCatalogMutation = useAddMedicationCatalog()
  const updateCatalogMutation = useUpdateMedicationCatalogById()
  const deleteCatalogyMutation = useDeleteMedicationCatalogById()

  // sync store state with query state
  useEffect(() => {
    medicationCatalogStore.setState({
      catalogs,
      isLoading,
      error: error ? String(error) : null,
    })
  }, [catalogs, isLoading, error])
  const getMedicationCatalogById = (id: string) => {
    return useMedicationCatalogById(id)
  }

  const addMedicationCatalog = async (catalog: Partial<TMedicationCatalog>) => {
    const newCatalog = await addCatalogMutation.mutateAsync(catalog)
    refetch()
    return newCatalog
  }

  const updateMedicationCatalogById = async (
    id: string | number,
    catalog: Partial<TMedicationCatalog>,
  ) => {
    const updatedCatalog = await updateCatalogMutation.mutateAsync({
      id,
      data: catalog,
    })
    refetch()
    return updatedCatalog
  }
  const deleteMedicationCatalogById = async (id: string | number) => {
    await deleteCatalogyMutation.mutateAsync(id)
    refetch()
  }
  return {
    catalogs,
    isLoading,
    error,
    getMedicationCatalogById,
    addMedicationCatalog,
    updateMedicationCatalogById,
    deleteMedicationCatalogById,
  }
}
