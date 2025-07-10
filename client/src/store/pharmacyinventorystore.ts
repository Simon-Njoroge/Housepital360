import { useAllPharmacyInventories,useDeletePharmacyInventoryById,useAddPharmacyInventory,useUpdatePharmacyInventoryById,usePharmacyInventoryById } from '@/hooks/usepharmarcyinventory';
import type { TPharmacyInventory } from '@/types/types';
import { Store } from '@tanstack/store';
 
// store state type

type PharmacyInventoryStoreType = {
  inventories: TPharmacyInventory[] | undefined;
  isLoading: boolean;
  error: string | null;
}

export const pharmacyInventoryStore = new Store<PharmacyInventoryStoreType>({
  inventories: undefined,
  isLoading: false,
  error: null,
});

//CRUD actions hooks

export function usePharmacyInventoryStoreActions(){
    const {data: inventories, isLoading, error,refetch} = useAllPharmacyInventories();
    const addInventoryMutation = useAddPharmacyInventory();
    const updateInventoryMutation = useUpdatePharmacyInventoryById();
    const deleteInventoryMutation = useDeletePharmacyInventoryById();

    // sync store state with query state
    pharmacyInventoryStore.setState({
        inventories,
        isLoading,
        error: error ? String(error) : null,
    });

    const getPharmacyInventoryById = (id: string) => {
        return usePharmacyInventoryById(id);
    };

    const addPharmacyInventory = async (inventory: Partial<TPharmacyInventory>) => {
        const newInventory = await addInventoryMutation.mutateAsync(inventory);
        refetch();
        return newInventory;
    };

    const updatePharmacyInventoryById = async (id: string | number, inventory: Partial<TPharmacyInventory>) => {
        const updatedInventory = await updateInventoryMutation.mutateAsync({id, data:inventory});
        refetch();
        return updatedInventory;
    };
    const deletePharmacyInventoryById = async (id: string | number) => {
        await deleteInventoryMutation.mutateAsync(id);
        refetch();
    };
    return {
        inventories,
        isLoading,
        error,
        getPharmacyInventoryById,
        addPharmacyInventory,
        updatePharmacyInventoryById,
        deletePharmacyInventoryById,
    };
}