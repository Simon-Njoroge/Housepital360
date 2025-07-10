import Backend_url from "@/common/backendUrl";
import type { TMedicalHistory } from "@/types/types";
import { apiClient } from "@/utils/apiClient";

// Get all medical histories
export const getAllMedicalHistories = async (): Promise<TMedicalHistory[]> =>
    apiClient<TMedicalHistory[]>(`${Backend_url}/medicalhistories`);

// Get medical history by ID
export const getMedicalHistoryById = async (id: string): Promise<TMedicalHistory> =>
    apiClient<TMedicalHistory>(`${Backend_url}/medicalhistories/${id}`);

// Create a new medical history
export const createMedicalHistory = async (history: Partial<TMedicalHistory>): Promise<TMedicalHistory> =>
    apiClient<TMedicalHistory>(`${Backend_url}/medicalhistories`, {
        method: "POST",
        body: JSON.stringify(history),
    });

// Update an existing medical history
export const updateMedicalHistory = async (id: string, history: Partial<TMedicalHistory>): Promise<TMedicalHistory> =>
    apiClient<TMedicalHistory>(`${Backend_url}/medicalhistories/${id}`, {
        method: "PATCH",
        body: JSON.stringify(history),
    });

// Delete a medical history
export const deleteMedicalHistory = async (id: string): Promise<void> =>
    apiClient<void>(`${Backend_url}/medicalhistories/${id}`, {
        method: "DELETE",
    });
