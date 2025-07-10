import {
  useAllItems,
  useItemById,
  useAddItem,
  useUpdateItem,
  useDeleteItem,
} from "@/utils/hookClient";
import type { TMedicationCatalog } from "@/types/types";
import {
  getAllMedicationCatalogs,
  getMedicationCatalogById,
  createMedicationCatalog,
  updateMedicationCatalog,
  deleteMedicationCatalog,
} from "@/data/medicalcatalogapi";

export const useAllMedicationCatalogs = () =>
  useAllItems<TMedicationCatalog>(["allMedicationCatalogs"], getAllMedicationCatalogs);

export const useMedicationCatalogById = (id: string) =>
  useItemById<TMedicationCatalog>(["medicationCatalog"], getMedicationCatalogById, id);

export const useAddMedicationCatalog = () =>
  useAddItem<TMedicationCatalog>(["allMedicationCatalogs"], createMedicationCatalog);

export const useUpdateMedicationCatalogById = () =>
  useUpdateItem<TMedicationCatalog>(["allMedicationCatalogs"], updateMedicationCatalog);

export const useDeleteMedicationCatalogById = () =>
  useDeleteItem(["allMedicationCatalogs"], deleteMedicationCatalog);