import {
  useAllItems,
  useItemById,
  useAddItem,
  useUpdateItem,
  useDeleteItem,
} from "@/utils/hookClient";
import type { TLabTestType } from "@/types/types";
import { getAllLabTestTypes,getLabTestTypeById,createLabTestType,updateLabTestType,deleteLabTestType } from "@/data/labtesttypeapi";

export const useAllLabTestsTypes = () =>
  useAllItems<TLabTestType>(["allLabTestsTypes"], getAllLabTestTypes);

export const useLabTestTypeById = (id: string) =>
  useItemById<TLabTestType>(["labTestType"], getLabTestTypeById, id);

export const useAddLabTestType = () =>
  useAddItem<TLabTestType>(["allLabTestsTypes"], createLabTestType);

export const useUpdateLabTestTypeById = () =>
  useUpdateItem<TLabTestType>(["allLabTestsTypes"], updateLabTestType);

export const useDeleteLabTestTypeById = () =>
  useDeleteItem(["allLabTestsTypes"], deleteLabTestType);