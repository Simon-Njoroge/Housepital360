import Backend_url from "@/common/backendUrl";
import type { TPatientFeedback } from "@/types/types";
import { apiClient } from "@/utils/apiClient";

// Get all patient feedback
export const getAllPatientFeedback = async (): Promise<TPatientFeedback[]> =>
    apiClient<TPatientFeedback[]>(`${Backend_url}/patient-feedback`);

// Get patient feedback by ID
export const getPatientFeedbackById = async (id: string): Promise<TPatientFeedback> =>
    apiClient<TPatientFeedback>(`${Backend_url}/patient-feedback/${id}`);

// Create a new patient feedback
export const createPatientFeedback = async (feedback: Partial<TPatientFeedback>): Promise<TPatientFeedback> =>
    apiClient<TPatientFeedback>(`${Backend_url}/patient-feedback`, {
        method: "POST",
        body: JSON.stringify(feedback),
    });

// Update an existing patient feedback
export const updatePatientFeedback = async (id: string, feedback: Partial<TPatientFeedback>): Promise<TPatientFeedback> =>
    apiClient<TPatientFeedback>(`${Backend_url}/patient-feedback/${id}`, {
        method: "PATCH",
        body: JSON.stringify(feedback),
    });

// Delete a patient feedback
export const deletePatientFeedback = async (id: string): Promise<void> =>
    apiClient<void>(`${Backend_url}/patient-feedback/${id}`, {
        method: "DELETE",
    });
    