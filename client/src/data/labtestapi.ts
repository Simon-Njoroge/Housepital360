import Backend_url from "@/common/backendUrl";
import type { TLabTest } from "@/types/types";
import { apiClient } from "@/utils/apiClient";

// Get all lab tests
export const getAllLabTests = async (): Promise<TLabTest[]> =>
    apiClient<TLabTest[]>(`${Backend_url}/lab-tests`);

// Get lab test by ID
export const getLabTestById = async (id: string | number): Promise<TLabTest> =>
    apiClient<TLabTest>(`${Backend_url}/lab-tests/${id}`);

//get test by patient id
export const getLabtestByUserId = async (userId: string | number): Promise<TLabTest[]> =>
  apiClient<TLabTest[]>(`${Backend_url}/lab-tests/patient/${userId}`);

// Create a new lab test
export const createLabTest = async (test: Partial<TLabTest>): Promise<TLabTest> =>
    apiClient<TLabTest>(`${Backend_url}/lab-tests`, {
        method: "POST",
        body: JSON.stringify(test),
    });

// Update an existing lab test
export const updateLabTest = async (id: string | number, test: Partial<TLabTest>): Promise<TLabTest> =>
    apiClient<TLabTest>(`${Backend_url}/lab-tests/${id}`, {
        method: "PATCH",
        body: JSON.stringify(test),
    });

// Delete a lab test
export const deleteLabTest = async (id: string | number): Promise<void> =>
    apiClient<void>(`${Backend_url}/lab-tests/${id}`, {
        method: "DELETE",
    });
