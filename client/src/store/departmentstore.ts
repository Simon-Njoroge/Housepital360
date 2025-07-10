import { useAllDepartments,useDepartmentById ,useAddDepartment,useUpdateDepartmentById,useDeleteDepartmentById} from '@/hooks/usedepartement';
import type { TDepartment } from '@/types/types';
import { Store } from '@tanstack/store';
 
// store state type

type DepartmentStoreType = {
  departments: TDepartment[] | undefined;
  isLoading: boolean;
  error: string | null;
}

export const departmentStore = new Store<DepartmentStoreType>({
  departments: undefined,
  isLoading: false,
  error: null,
});

//CRUD actions hooks

export function useDepartmentsStoreActions(){
    const {data: departments, isLoading, error,refetch} = useAllDepartments();
    const addDepartmentMutation = useAddDepartment();
    const updateDepartmentMutation = useUpdateDepartmentById();
    const deleteDepartmentMutation = useDeleteDepartmentById();

    // sync store state with query state
    departmentStore.setState({
        departments,
        isLoading,
        error: error ? String(error) : null,
    });

    const getDepartmentById = (id: string) => {
        return useDepartmentById(id);
    };

    const addDepartment = async (department: Partial<TDepartment>) => {
        const newDepartment = await addDepartmentMutation.mutateAsync(department);
        refetch();
        return newDepartment;
    };

    const updateDepartmentById = async (id: string | number, department: Partial<TDepartment>) => {
        const updatedDepartment = await updateDepartmentMutation.mutateAsync({id, data:department});
        refetch();
        return updatedDepartment;
    };
    const deleteDepartmentById = async (id: string | number) => {
        await deleteDepartmentMutation.mutateAsync(id);
        refetch();
    };
    return {
        departments,
        isLoading,
        error,
        getDepartmentById,
        addDepartment,
        updateDepartmentById,
        deleteDepartmentById,
    };
}