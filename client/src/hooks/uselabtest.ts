import {
  useAllItems,
  useItemById,
  useAddItem,
  useUpdateItem,
  useDeleteItem,
} from "@/utils/hookClient";
import type { TLabTest } from "@/types/types";
import { getLabTestById,getAllLabTests,createLabTest,updateLabTest,deleteLabTest,getLabtestByUserId } from "@/data/labtestapi";

export const useAllLabTests = () =>
  useAllItems<TLabTest>(["allLabTests"], getAllLabTests);

export const useLabTestById = (id: string) =>
  useItemById<TLabTest>(["labTest"], getLabTestById, id);

export const useLabtestByUserId = (userId: string) =>
  useAllItems<TLabTest>(["appointmentsByUser", userId], () => getLabtestByUserId(userId));

export const useAddLabTest = () =>
  useAddItem<TLabTest>(["allLabTests"], createLabTest);

export const useUpdateLabTestById = () =>
  useUpdateItem<TLabTest>(["allLabTests"], updateLabTest);

export const useDeleteLabTestById = () =>
  useDeleteItem(["allLabTests"], deleteLabTest);