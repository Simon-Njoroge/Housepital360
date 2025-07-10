import Backend_url from "@/common/backendUrl";
import type { TLabTestType } from "@/types/types";
import { apiClient } from "@/utils/apiClient";

// Get all lab test types
export const getAllLabTestTypes = async (): Promise<TLabTestType[]> =>
    apiClient<TLabTestType[]>(`${Backend_url}/lab-test-types`);

// Get lab test type by ID
export const getLabTestTypeById = async (id: string| number): Promise<TLabTestType> =>
    apiClient<TLabTestType>(`${Backend_url}/lab-test-types/${id}`);

// Create a new lab test type
export const createLabTestType = async (type: Partial<TLabTestType>): Promise<TLabTestType> =>
    apiClient<TLabTestType>(`${Backend_url}/lab-test-types`, {
        method: "POST",
        body: JSON.stringify(type),
    });

// Update an existing lab test type
export const updateLabTestType = async (id: string | number, type: Partial<TLabTestType>): Promise<TLabTestType> =>
    apiClient<TLabTestType>(`${Backend_url}/lab-test-types/${id}`, {
        method: "PATCH",
        body: JSON.stringify(type),
    });

// Delete a lab test type
export const deleteLabTestType = async (id: string | number): Promise<void> =>
    apiClient<void>(`${Backend_url}/lab-test-types/${id}`, {
        method: "DELETE",
    });
