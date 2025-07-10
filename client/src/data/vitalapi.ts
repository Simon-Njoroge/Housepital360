import Backend_url from "@/common/backendUrl";
import type { TVital } from "@/types/types";
import { apiClient } from "@/utils/apiClient";

// Get all vitals
export const getAllVitals = async (): Promise<TVital[]> =>
    apiClient<TVital[]>(`${Backend_url}/vitals`);

// Get vital by ID
export const getVitalById = async (id: string): Promise<TVital> =>
    apiClient<TVital>(`${Backend_url}/vitals/${id}`);

// Create a new vital
export const createVital = async (vital: Partial<TVital>): Promise<TVital> =>
    apiClient<TVital>(`${Backend_url}/vitals`, {
        method: "POST",
        body: JSON.stringify(vital),
    });

// Update an existing vital
export const updateVital = async (id: string, vital: Partial<TVital>): Promise<TVital> =>
    apiClient<TVital>(`${Backend_url}/vitals/${id}`, {
        method: "PATCH",
        body: JSON.stringify(vital),
    });

// Delete a vital
export const deleteVital = async (id: string): Promise<void> =>
    apiClient<void>(`${Backend_url}/vitals/${id}`, {
        method: "DELETE",
    });
