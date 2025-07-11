import {
  useAllItems,
  useItemById,
  useAddItem,
  useUpdateItem,
  useDeleteItem,
} from "@/utils/hookClient";
import type { TPrescription } from "@/types/types";
import {
  getAllPrescriptions,
  getPrescriptionsByUserId,
  getPrescriptionById,
  createPrescription,
  updatePrescription,
  clearPrescription,
  deletePrescription,
} from "@/data/prescriptionapi";

export const useAllPrescriptions = () =>
  useAllItems<TPrescription>(["allPrescriptions"], getAllPrescriptions);

export const usePrescriptionsByUserId = (userId: string) =>
  useAllItems<TPrescription>(["userPrescriptions", userId], () => getPrescriptionsByUserId(userId));

export const usePrescriptionById = (id: string) =>
  useItemById<TPrescription>(["prescription", id], getPrescriptionById,id);

export const useCreatePrescription = () =>
  useAddItem<TPrescription>(["allPrescriptions"], createPrescription);

export const useUpdatePrescription = (id: string) =>
  useUpdateItem<TPrescription>(["prescription", id], updatePrescription);

export const useClearPrescription = (id: string) =>
  useDeleteItem(["prescription", id], clearPrescription);

export const useDeletePrescription = (id: string) =>
  useDeleteItem(["prescription", id], deletePrescription);