import type { TTimeSlot } from "@/types/types";
import { apiClient } from "@/utils/apiClient";
import Backend_url from "@/common/backendUrl";

//get all time slots
export const getAllTimeSlots = async (): Promise<TTimeSlot[]> =>
    apiClient<TTimeSlot[]>(`${Backend_url}/time-slots`);


export const getDoctorTimeSlots = async (doctorId: string): Promise<TTimeSlot[]> =>
    apiClient<TTimeSlot[]>(`${Backend_url}/time-slots/doctor/${doctorId}`);

//get time slot by id
export const getTimeSlotById = async (id: string | number): Promise<TTimeSlot> =>
    apiClient<TTimeSlot>(`${Backend_url}/time-slots/${id}`);

//create time slot
export const createTimeSlot = async (slot: Partial<TTimeSlot>): Promise<TTimeSlot> =>
    apiClient<TTimeSlot>(`${Backend_url}/time-slots`, {
        method: "POST",
        body: JSON.stringify(slot),
    });

//update time slot
export const updateTimeSlot = async (id: string | number, slot: Partial<TTimeSlot>): Promise<TTimeSlot> =>
    apiClient<TTimeSlot>(`${Backend_url}/time-slots/${id}`, {
        method: "PATCH",
        body: JSON.stringify(slot),
    });

//delete time slot
export const deleteTimeSlot = async (id: string | number): Promise<void> =>
    apiClient<void>(`${Backend_url}/time-slots/${id}`, {
        method: "DELETE",
    });
    