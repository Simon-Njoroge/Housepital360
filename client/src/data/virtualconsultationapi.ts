import Backend_url from "@/common/backendUrl";
import type { TVirtualConsultation } from "@/types/types";
import { apiClient } from "@/utils/apiClient";

// Get all virtual consultations
export const getAllVirtualConsultations = async (): Promise<TVirtualConsultation[]> =>
    apiClient<TVirtualConsultation[]>(`${Backend_url}/virtualconsultations`);

// Get virtual consultation by ID
export const getVirtualConsultationById = async (id: string): Promise<TVirtualConsultation> =>
    apiClient<TVirtualConsultation>(`${Backend_url}/virtualconsultations/${id}`);

// Create a new virtual consultation
export const createVirtualConsultation = async (consultation: Partial<TVirtualConsultation>): Promise<TVirtualConsultation> =>
    apiClient<TVirtualConsultation>(`${Backend_url}/virtualconsultations`, {
        method: "POST",
        body: JSON.stringify(consultation),
    });

// Update an existing virtual consultation
export const updateVirtualConsultation = async (id: string, consultation: Partial<TVirtualConsultation>): Promise<TVirtualConsultation> =>
    apiClient<TVirtualConsultation>(`${Backend_url}/virtualconsultations/${id}`, {
        method: "PATCH",
        body: JSON.stringify(consultation),
    });

// Delete a virtual consultation
export const deleteVirtualConsultation = async (id: string): Promise<void> =>
    apiClient<void>(`${Backend_url}/virtualconsultations/${id}`, {
        method: "DELETE",
    });
