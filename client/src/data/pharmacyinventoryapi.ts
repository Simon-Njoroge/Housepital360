import Backend_url from "@/common/backendUrl";
import type { TPharmacyInventory } from "@/types/types";
import { apiClient } from "@/utils/apiClient";

// Get all pharmacy inventories
export const getAllPharmacyInventories = async (): Promise<TPharmacyInventory[]> =>
    apiClient<TPharmacyInventory[]>(`${Backend_url}/pharmacy-inventory`);

// Get pharmacy inventory by ID
export const getPharmacyInventoryById = async (id: string | number): Promise<TPharmacyInventory> =>
    apiClient<TPharmacyInventory>(`${Backend_url}/pharmacy-inventory/${id}`);

// Create a new pharmacy inventory
export const createPharmacyInventory = async (inventory: Partial<TPharmacyInventory>): Promise<TPharmacyInventory> =>
    apiClient<TPharmacyInventory>(`${Backend_url}/pharmacy-inventory`, {
        method: "POST",
        body: JSON.stringify(inventory),
    });

// Update an existing pharmacy inventory
export const updatePharmacyInventory = async (id: string | number, inventory: Partial<TPharmacyInventory>): Promise<TPharmacyInventory> =>
    apiClient<TPharmacyInventory>(`${Backend_url}/pharmacy-inventory/${id}`, {
        method: "PATCH",
        body: JSON.stringify(inventory),
    });

// Delete a pharmacy inventory
export const deletePharmacyInventory = async (id: string | number): Promise<void> =>
    apiClient<void>(`${Backend_url}/pharmacy-inventory/${id}`, {
        method: "DELETE",
    });
