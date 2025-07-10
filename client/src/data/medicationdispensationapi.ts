import { apiClient } from "@/utils/apiClient";
import Backend_url from "@/common/backendUrl";
import type { TMedicationDispensation } from "@/types/types";

// Get all medication dispensations
export const getAllMedicationDispensations = async (): Promise<TMedicationDispensation[]> =>
    apiClient<TMedicationDispensation[]>(`${Backend_url}/medication-dispensations`);

// Get medication dispensation by ID
export const getMedicationDispensationById = async (id: string): Promise<TMedicationDispensation> =>
    apiClient<TMedicationDispensation>(`${Backend_url}/medication-dispensations/${id}`);

// Create a new medication dispensation
export const createMedicationDispensation = async (dispensation: Partial<TMedicationDispensation>): Promise<TMedicationDispensation> =>
    apiClient<TMedicationDispensation>(`${Backend_url}/medication-dispensations`, {
        method: "POST",
        body: JSON.stringify(dispensation),
    });

// Update an existing medication dispensation
export const updateMedicationDispensation = async (id: string, dispensation: Partial<TMedicationDispensation>): Promise<TMedicationDispensation> =>
    apiClient<TMedicationDispensation>(`${Backend_url}/medication-dispensations/${id}`, {
        method: "PATCH",
        body: JSON.stringify(dispensation),
    });

// Delete a medication dispensation
export const deleteMedicationDispensation = async (id: string): Promise<void> =>
    apiClient<void>(`${Backend_url}/medication-dispensations/${id}`, {
        method: "DELETE",
    });
