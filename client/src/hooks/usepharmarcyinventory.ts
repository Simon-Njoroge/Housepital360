import {
  useAllItems,
  useItemById,
  useAddItem,
  useUpdateItem,
  useDeleteItem,
} from "@/utils/hookClient";
import type { TPharmacyInventory } from "@/types/types";
import { getAllPharmacyInventories,getPharmacyInventoryById,createPharmacyInventory,updatePharmacyInventory,deletePharmacyInventory } from "@/data/pharmacyinventoryapi";

export const useAllPharmacyInventories = () =>
  useAllItems<TPharmacyInventory>(["allPharmacyInventories"], getAllPharmacyInventories);

export const usePharmacyInventoryById = (id: string) =>
  useItemById<TPharmacyInventory>(["pharmacyInventory"], getPharmacyInventoryById, id);

export const useAddPharmacyInventory = () =>
  useAddItem<TPharmacyInventory>(["allPharmacyInventories"], createPharmacyInventory);

export const useUpdatePharmacyInventoryById = () =>
  useUpdateItem<TPharmacyInventory>(["allPharmacyInventories"], updatePharmacyInventory);

export const useDeletePharmacyInventoryById = () =>
  useDeleteItem(["allPharmacyInventories"], deletePharmacyInventory);