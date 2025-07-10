import { useTimeSlotById,useAllTimeSlots,useAddTimeSlot,useDeleteTimeSlotById,useUpdateTimeSlotById } from '@/hooks/usetimeslot';
import type { TTimeSlot } from '@/types/types';
import { Store } from '@tanstack/store';
 
// store state type

type TimeSlotStoreType = {
  timeSlots: TTimeSlot[] | undefined;
  isLoading: boolean;
  error: string | null;
}

export const timeSlotStore = new Store<TimeSlotStoreType>({
  timeSlots: undefined,
  isLoading: false,
  error: null,
});

//CRUD actions hooks

export function useTimeSlotsStoreActions(){
    const {data: timeSlots, isLoading, error,refetch} = useAllTimeSlots();
    const addTimeSlotMutation = useAddTimeSlot();
    const updateTimeSlotMutation = useUpdateTimeSlotById();
    const deleteTimeSlotMutation = useDeleteTimeSlotById();

    // sync store state with query state
    timeSlotStore.setState({
        timeSlots,
        isLoading,
        error: error ? String(error) : null,
    });

    const getTimeSlotById = (id: string) => {
        return useTimeSlotById(id);
    };

    const addTimeSlot = async (timeSlot: Partial<TTimeSlot>) => {
        const newTimeSlot = await addTimeSlotMutation.mutateAsync(timeSlot);
        refetch();
        return newTimeSlot;
    };

    const updateTimeSlotById = async (id: string | number, timeSlot: Partial<TTimeSlot>) => {
        const updatedTimeSlot = await updateTimeSlotMutation.mutateAsync({id, data:timeSlot});
        refetch();
        return updatedTimeSlot;
    };
    const deleteTimeSlotById = async (id: string | number) => {
        await deleteTimeSlotMutation.mutateAsync(id);
        refetch();
    };
    return {
        timeSlots,
        isLoading,
        error,
        getTimeSlotById,
        addTimeSlot,
        updateTimeSlotById,
        deleteTimeSlotById,
    };
}