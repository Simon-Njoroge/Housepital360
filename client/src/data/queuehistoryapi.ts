import Backend_url from "@/common/backendUrl";
import { apiClient } from "@/utils/apiClient";
import type { TQueueHistory } from "@/types/types";

// Get all queue histories
export const getAllQueueHistories = async (): Promise<TQueueHistory[]> =>
    apiClient<TQueueHistory[]>(`${Backend_url}/queuehistories`);

// Get queue history by ID
export const getQueueHistoryById = async (id: string): Promise<TQueueHistory> =>
    apiClient<TQueueHistory>(`${Backend_url}/queuehistories/${id}`);

// Create a new queue history
export const createQueueHistory = async (history: Partial<TQueueHistory>): Promise<TQueueHistory> =>
    apiClient<TQueueHistory>(`${Backend_url}/queuehistories`, {
        method: "POST",
        body: JSON.stringify(history),
    });

// Update an existing queue history
export const updateQueueHistory = async (id: string, history: Partial<TQueueHistory>): Promise<TQueueHistory> =>
    apiClient<TQueueHistory>(`${Backend_url}/queuehistories/${id}`, {
        method: "PATCH",
        body: JSON.stringify(history),
    });

// Delete a queue history
export const deleteQueueHistory = async (id: string): Promise<void> =>
    apiClient<void>(`${Backend_url}/queuehistories/${id}`, {
        method: "DELETE",
    });
