import Backend_url from "@/common/backendUrl";
import type  {    TAuditLog } from "@/types/types";
import { apiClient } from "@/utils/apiClient";

// Get all audit logs
export const getAllAuditLogs = async (): Promise<TAuditLog[]> =>
    apiClient<TAuditLog[]>(`${Backend_url}/audit-logs`);

// Get audit log by ID
export const getAuditLogById = async (id: string): Promise<TAuditLog> =>
    apiClient<TAuditLog>(`${Backend_url}/audit-logs/${id}`);

// Create a new audit log
export const createAuditLog = async (log: Partial<TAuditLog>): Promise<TAuditLog> =>
    apiClient<TAuditLog>(`${Backend_url}/audit-logs`, {
        method: "POST",
        body: JSON.stringify(log),
    });

// Update an existing audit log
export const updateAuditLog = async (id: string, log: Partial<TAuditLog>): Promise<TAuditLog> =>
    apiClient<TAuditLog>(`${Backend_url}/audit-logs/${id}`, {
        method: "PATCH",
        body: JSON.stringify(log),
    });

// Delete an audit log
export const deleteAuditLog = async (id: string): Promise<void> =>
    apiClient<void>(`${Backend_url}/audit-logs/${id}`, {
        method: "DELETE",
    });
