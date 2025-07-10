import { useAllPatientProfiles,usePatientProfileByUserId,useAddPatientProfile,useUpdatePatientProfileById,useDeletePatientProfileById } from "@/hooks/usepatientprofile";
import type { TPatientProfile } from "@/types/types";
import { Store } from "@tanstack/store";

 
// store state type

type PatientProfileStoreType = {
  patientProfiles: TPatientProfile[] | undefined;
  isLoading: boolean;
  error: string | null;
}

export const patientProfileStore = new Store<PatientProfileStoreType>({
  patientProfiles: undefined,
  isLoading: false,
  error: null,
});

//CRUD actions hooks

export function usePatientProfilesStoreActions(){
    const {data: patientProfiles, isLoading, error,refetch} = useAllPatientProfiles();
    const addPatientProfileMutation = useAddPatientProfile();
    const updatePatientProfileMutation = useUpdatePatientProfileById();
    const deletePatientProfileMutation = useDeletePatientProfileById();

    // sync store state with query state
    patientProfileStore.setState({
        patientProfiles,
        isLoading,
        error: error ? String(error) : null,
    });

    const getPatientProfileById = (id: string) => {
        return usePatientProfileByUserId(id);
    };

    const addPatientProfile = async (patientProfile: Partial<TPatientProfile>) => {
        const newPatientProfile = await addPatientProfileMutation.mutateAsync(patientProfile);
        refetch();
        return newPatientProfile;
    };

    const updatePatientProfileById = async (id: string | number, patientProfile: Partial<TPatientProfile>) => {
        const updatedPatientProfile = await updatePatientProfileMutation.mutateAsync({id, data:patientProfile});
        refetch();
        return updatedPatientProfile;
    };
    const deletePatientProfileById = async (id: string | number) => {
        await deletePatientProfileMutation.mutateAsync(id);
        refetch();
    };
    return {
        patientProfiles,
        isLoading,
        error,
        getPatientProfileById,
        addPatientProfile,
        updatePatientProfileById,
        deletePatientProfileById,
    };
}