import Backend_url from "@/common/backendUrl";
import type { TPrescriptionItem } from "@/types/types";
import { apiClient } from "@/utils/apiClient";

// Get all prescription items
export const getAllPrescriptionItems = async (): Promise<TPrescriptionItem[]> =>
    apiClient<TPrescriptionItem[]>(`${Backend_url}/prescription-items`);

// Get prescription item by ID
export const getPrescriptionItemById = async (id: string): Promise<TPrescriptionItem> =>
    apiClient<TPrescriptionItem>(`${Backend_url}/prescription-items/${id}`);

// Create a new prescription item
export const createPrescriptionItem = async (item: Partial<TPrescriptionItem>): Promise<TPrescriptionItem> =>
    apiClient<TPrescriptionItem>(`${Backend_url}/prescription-items`, {
        method: "POST",
        body: JSON.stringify(item),
    });

// Update an existing prescription item
export const updatePrescriptionItem = async (id: string, item: Partial<TPrescriptionItem>): Promise<TPrescriptionItem> =>
    apiClient<TPrescriptionItem>(`${Backend_url}/prescription-items/${id}`, {
        method: "PATCH",
        body: JSON.stringify(item),
    });

// Delete a prescription item
export const deletePrescriptionItem = async (id: string): Promise<void> =>
    apiClient<void>(`${Backend_url}/prescription-items/${id}`, {
        method: "DELETE",
    });
