import Backend_url from "@/common/backendUrl";
import type { TInvoiceItem } from "@/types/types";
import { apiClient } from "@/utils/apiClient";

// Get all invoice items
export const getAllInvoiceItems = async (): Promise<TInvoiceItem[]> =>
    apiClient<TInvoiceItem[]>(`${Backend_url}/invoice-items`);

// Get invoice item by ID
export const getInvoiceItemById = async (id: string): Promise<TInvoiceItem> =>
    apiClient<TInvoiceItem>(`${Backend_url}/invoice-items/${id}`);

// Create a new invoice item
export const createInvoiceItem = async (item: Partial<TInvoiceItem>): Promise<TInvoiceItem> =>
    apiClient<TInvoiceItem>(`${Backend_url}/invoice-items`, {
        method: "POST",
        body: JSON.stringify(item),
    });

// Update an existing invoice item
export const updateInvoiceItem = async (id: string, item: Partial<TInvoiceItem>): Promise<TInvoiceItem> =>
    apiClient<TInvoiceItem>(`${Backend_url}/invoice-items/${id}`, {
        method: "PATCH",
        body: JSON.stringify(item),
    });

// Delete an invoice item
export const deleteInvoiceItem = async (id: string): Promise<void> =>
    apiClient<void>(`${Backend_url}/invoice-items/${id}`, {
        method: "DELETE",
    });
