import Backend_url from "@/common/backendUrl";
import type { TMedicationCatalog } from "@/types/types";
import { apiClient } from "@/utils/apiClient";

// Get all medication catalog items
export const getAllMedicationCatalogs = async (): Promise<TMedicationCatalog[]> =>
    apiClient<TMedicationCatalog[]>(`${Backend_url}/medication-catalog`);

// Get medication catalog by ID
export const getMedicationCatalogById = async (id: string | number): Promise<TMedicationCatalog> =>
    apiClient<TMedicationCatalog>(`${Backend_url}/medication-catalog/${id}`);


// Create a new medication catalog
export const createMedicationCatalog = async (catalog: Partial<TMedicationCatalog>): Promise<TMedicationCatalog> =>
    apiClient<TMedicationCatalog>(`${Backend_url}/medication-catalog`, {
        method: "POST",
        body: JSON.stringify(catalog),
    });

// Update an existing medication catalog
export const updateMedicationCatalog = async (id: string | number, catalog: Partial<TMedicationCatalog>): Promise<TMedicationCatalog> =>
    apiClient<TMedicationCatalog>(`${Backend_url}/medication-catalog/${id}`, {
        method: "PATCH",
        body: JSON.stringify(catalog),
    });

// Delete a medication catalog
export const deleteMedicationCatalog = async (id: string | number): Promise<void> =>
    apiClient<void>(`${Backend_url}/medication-catalog/${id}`, {
        method: "DELETE",
    });
