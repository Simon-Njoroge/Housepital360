import Backend_url from "@/common/backendUrl";
import type { TLabTestResult } from "@/types/types";
import { apiClient } from "@/utils/apiClient";

// Get all lab test results
export const getAllLabTestResults = async (): Promise<TLabTestResult[]> =>
    apiClient<TLabTestResult[]>(`${Backend_url}/lab-test-results`);

// Get lab test result by ID
export const getLabTestResultById = async (id: string): Promise<TLabTestResult> =>
    apiClient<TLabTestResult>(`${Backend_url}/lab-test-results/${id}`);

// Create a new lab test result
export const createLabTestResult = async (result: Partial<TLabTestResult>): Promise<TLabTestResult> =>
    apiClient<TLabTestResult>(`${Backend_url}/lab-test-results`, {
        method: "POST",
        body: JSON.stringify(result),
    });

// Update an existing lab test result
export const updateLabTestResult = async (id: string, result: Partial<TLabTestResult>): Promise<TLabTestResult> =>
    apiClient<TLabTestResult>(`${Backend_url}/lab-test-results/${id}`, {
        method: "PATCH",
        body: JSON.stringify(result),
    });

// Delete a lab test result
export const deleteLabTestResult = async (id: string): Promise<void> =>
    apiClient<void>(`${Backend_url}/lab-test-results/${id}`, {
        method: "DELETE",
    });
