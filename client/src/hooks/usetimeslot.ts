import {
  useAllItems,
  useItemById,
  useAddItem,
  useUpdateItem,
  useDeleteItem,
} from "@/utils/hookClient";
import type { TTimeSlot } from "@/types/types";
import { getAllTimeSlots,getTimeSlotById,updateTimeSlot,createTimeSlot,deleteTimeSlot ,getDoctorTimeSlots} from "@/data/timeslotapi";

export const useAllTimeSlots = () =>
  useAllItems<TTimeSlot>(["allTimeSlots"], getAllTimeSlots);

export const useDoctorTimeSlots = (doctorId: string) =>
  useAllItems<TTimeSlot>(["doctorTimeSlots", doctorId], () => getDoctorTimeSlots(doctorId));

export const useTimeSlotById = (id: string) =>
  useItemById<TTimeSlot>(["timeSlot"], getTimeSlotById, id);

export const useAddTimeSlot = () =>
  useAddItem<TTimeSlot>(["allTimeSlots"], createTimeSlot);

export const useUpdateTimeSlotById = () =>
  useUpdateItem<TTimeSlot>(["allTimeSlots"], updateTimeSlot);

export const useDeleteTimeSlotById = () =>
  useDeleteItem(["allTimeSlots"], deleteTimeSlot);