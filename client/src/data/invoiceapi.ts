import Backend_url from "@/common/backendUrl";
import type { TInvoice } from "@/types/types";
import { apiClient } from "@/utils/apiClient";

// Get all invoices
export const getAllInvoices = async (): Promise<TInvoice[]> =>
    apiClient<TInvoice[]>(`${Backend_url}/invoices`);

//Get all invoices by patient repo
export const getAllInvoicesByPatientId = async (userId: string): Promise<TInvoice[]> =>
  apiClient<TInvoice[]>(`${Backend_url}/invoices/patient/${userId}`);


// Get invoice by ID
export const getInvoiceById = async (id: string | number): Promise<TInvoice> =>
    apiClient<TInvoice>(`${Backend_url}/invoices/${id}`);

// Create a new invoice
export const createInvoice = async (invoice: Partial<TInvoice>): Promise<TInvoice> =>
    apiClient<TInvoice>(`${Backend_url}/invoices`, {
        method: "POST",
        body: JSON.stringify(invoice),
    });

// Update an existing invoice
export const updateInvoice = async (id: string | number, invoice: Partial<TInvoice>): Promise<TInvoice> =>
    apiClient<TInvoice>(`${Backend_url}/invoices/${id}`, {
        method: "PATCH",
        body: JSON.stringify(invoice),
    });

// Delete an invoice
export const deleteInvoice = async (id: string | number): Promise<void> =>
    apiClient<void>(`${Backend_url}/invoices/${id}`, {
        method: "DELETE",
    });
