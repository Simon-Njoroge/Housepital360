import Backend_url from "@/common/backendUrl";
import type { TPrescription } from "@/types/types";
import { apiClient } from "@/utils/apiClient";

// Get all prescriptions
export const getAllPrescriptions = async (): Promise<TPrescription[]> =>
    apiClient<TPrescription[]>(`${Backend_url}/prescriptions`);

// Get prescription by ID
export const getPrescriptionById = async (id: string): Promise<TPrescription> =>
    apiClient<TPrescription>(`${Backend_url}/prescriptions/${id}`);

// Create a new prescription
export const createPrescription = async (prescription: Partial<TPrescription>): Promise<TPrescription> =>
    apiClient<TPrescription>(`${Backend_url}/prescriptions`, {
        method: "POST",
        body: JSON.stringify(prescription),
    });

// Update an existing prescription
export const updatePrescription = async (id: string, prescription: Partial<TPrescription>): Promise<TPrescription> =>
    apiClient<TPrescription>(`${Backend_url}/prescriptions/${id}`, {
        method: "PATCH",
        body: JSON.stringify(prescription),
    });

// Delete a prescription
export const deletePrescription = async (id: string): Promise<void> =>
    apiClient<void>(`${Backend_url}/prescriptions/${id}`, {
        method: "DELETE",
    });
