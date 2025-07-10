import {
  useAllItems,
  useItemById,
  useAddItem,
  useUpdateItem,
  useDeleteItem,
} from "@/utils/hookClient";
import type { TDepartment } from "@/types/types";
import { getAllDepartments,getDepartmentById,createDepartment,updateDepartment,deleteDepartment } from "@/data/departmentapio";

export const useAllDepartments = () =>
  useAllItems<TDepartment>(["allDepartments"], getAllDepartments);

export const useDepartmentById = (id: string) =>
  useItemById<TDepartment>(["department"], getDepartmentById, id);

export const useAddDepartment = () =>
  useAddItem<TDepartment>(["allDepartments"], createDepartment);

export const useUpdateDepartmentById = () =>
  useUpdateItem<TDepartment>(["allDepartments"], updateDepartment);

export const useDeleteDepartmentById = () =>
  useDeleteItem(["allDepartments"], deleteDepartment);