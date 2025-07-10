import Backend_url from "@/common/backendUrl";
import type { TAllergy } from "@/types/types";
import { apiClient } from "@/utils/apiClient";

// Get all allergies
export const getAllAllergies = async (): Promise<TAllergy[]> =>
    apiClient<TAllergy[]>(`${Backend_url}/allergies`);

// Get allergy by ID
export const getAllergyById = async (id: string): Promise<TAllergy> =>
    apiClient<TAllergy>(`${Backend_url}/allergies/${id}`);

// Create a new allergy
export const createAllergy = async (allergy: Partial<TAllergy>): Promise<TAllergy> =>
    apiClient<TAllergy>(`${Backend_url}/allergies`, {
        method: "POST",
        body: JSON.stringify(allergy),
    });

// Update an existing allergy
export const updateAllergy = async (id: string, allergy: Partial<TAllergy>): Promise<TAllergy> =>
    apiClient<TAllergy>(`${Backend_url}/allergies/${id}`, {
        method: "PATCH",
        body: JSON.stringify(allergy),
    });

// Delete an allergy
export const deleteAllergy = async (id: string): Promise<void> =>
    apiClient<void>(`${Backend_url}/allergies/${id}`, {
        method: "DELETE",
    });
