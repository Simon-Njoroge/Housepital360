import { apiClient } from "@/utils/apiClient";
import Backend_url from "@/common/backendUrl";
import type { TPatientQueue } from "@/types/types";

// Get all patient queues
export const getAllPatientQueues = async (): Promise<TPatientQueue[]> =>
    apiClient<TPatientQueue[]>(`${Backend_url}/patientqueues`);

// Get patient queues by doctor ID
export const getPatientQueuesByDoctorId = async (doctorId: string | number): Promise<TPatientQueue[]> =>
    apiClient<TPatientQueue[]>(`${Backend_url}/patientqueues/doctor/${doctorId}`);

// Get patient queue by ID
export const getPatientQueueById = async (id: string | number): Promise<TPatientQueue> =>
    apiClient<TPatientQueue>(`${Backend_url}/patientqueues/${id}`);

// Create a new patient queue
export const createPatientQueue = async (queue: Partial<TPatientQueue>): Promise<TPatientQueue> =>
    apiClient<TPatientQueue>(`${Backend_url}/patientqueues`, {
        method: "POST",
        body: JSON.stringify(queue),
    });

// Update an existing patient queue
export const updatePatientQueue = async (id: string | number, queue: Partial<TPatientQueue>): Promise<TPatientQueue> =>
    apiClient<TPatientQueue>(`${Backend_url}/patientqueues/${id}`, {
        method: "PATCH",
        body: JSON.stringify(queue),
    });

// Delete a patient queue
export const deletePatientQueue = async (id: string | number): Promise<void> =>
    apiClient<void>(`${Backend_url}/patientqueues/${id}`, {
        method: "DELETE",
    });

