import Backend_url from "@/common/backendUrl";
import type { TPrescription } from "@/types/types";
import { apiClient } from "@/utils/apiClient";

// Get all prescriptions
export const getAllPrescriptions = async (): Promise<TPrescription[]> =>
    apiClient<TPrescription[]>(`${Backend_url}/prescriptions`);

// Get prescriptions by user ID
export const getPrescriptionsByUserId = async (userId: string): Promise<TPrescription[]> =>
    apiClient<TPrescription[]>(`${Backend_url}/prescriptions/user/${userId}`);

// Get prescription by ID
export const getPrescriptionById = async (id: string | number): Promise<TPrescription> =>
    apiClient<TPrescription>(`${Backend_url}/prescriptions/${id}`);

// Create a new prescription
export const createPrescription = async (prescription: Partial<TPrescription>): Promise<TPrescription> =>
    apiClient<TPrescription>(`${Backend_url}/prescriptions/create`, {
        method: "POST",
        body: JSON.stringify(prescription),
    });

// Update an existing prescription
export const updatePrescription = async (id: string | number, prescription: Partial<TPrescription>): Promise<TPrescription> =>
    apiClient<TPrescription>(`${Backend_url}/prescriptions/${id}`, {
        method: "PATCH",
        body: JSON.stringify(prescription),
    });

// Clear a prescription (soft delete)
export const clearPrescription = async (id: string | number): Promise<void> =>
    apiClient<void>(`${Backend_url}/prescriptions/clear/${id}`, {
        method: "PATCH",
    });

// Delete a prescription
export const deletePrescription = async (id: string | number): Promise<void> =>
    apiClient<void>(`${Backend_url}/prescriptions/${id}`, {
        method: "DELETE",
    });
