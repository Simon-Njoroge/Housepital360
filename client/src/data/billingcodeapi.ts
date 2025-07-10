import Backend_url from "@/common/backendUrl";
import type { TBillingCode } from "@/types/types";
import { apiClient } from "@/utils/apiClient";

// Get all billing codes
export const getAllBillingCodes = async (): Promise<TBillingCode[]> =>
    apiClient<TBillingCode[]>(`${Backend_url}/billing-codes`);

// Get billing code by ID
export const getBillingCodeById = async (id: string): Promise<TBillingCode> =>
    apiClient<TBillingCode>(`${Backend_url}/billing-codes/${id}`);

// Create a new billing code
export const createBillingCode = async (code: Partial<TBillingCode>): Promise<TBillingCode> =>
    apiClient<TBillingCode>(`${Backend_url}/billing-codes`, {
        method: "POST",
        body: JSON.stringify(code),
    });

// Update an existing billing code
export const updateBillingCode = async (id: string, code: Partial<TBillingCode>): Promise<TBillingCode> =>
    apiClient<TBillingCode>(`${Backend_url}/billing-codes/${id}`, {
        method: "PATCH",
        body: JSON.stringify(code),
    });

// Delete a billing code
export const deleteBillingCode = async (id: string): Promise<void> =>
    apiClient<void>(`${Backend_url}/billing-codes/${id}`, {
        method: "DELETE",
    });
