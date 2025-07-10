import Backend_url from "@/common/backendUrl";
import type { TInsuranceClaim } from "@/types/types";
import { apiClient } from "@/utils/apiClient";

// Get all insurance claims
export const getAllInsuranceClaims = async (): Promise<TInsuranceClaim[]> =>
    apiClient<TInsuranceClaim[]>(`${Backend_url}/insurance-claims`);

// Get insurance claim by ID
export const getInsuranceClaimById = async (id: string): Promise<TInsuranceClaim> =>
    apiClient<TInsuranceClaim>(`${Backend_url}/insurance-claims/${id}`);

// Create a new insurance claim
export const createInsuranceClaim = async (claim: Partial<TInsuranceClaim>): Promise<TInsuranceClaim> =>
    apiClient<TInsuranceClaim>(`${Backend_url}/insurance-claims`, {
        method: "POST",
        body: JSON.stringify(claim),
    });

// Update an existing insurance claim
export const updateInsuranceClaim = async (id: string, claim: Partial<TInsuranceClaim>): Promise<TInsuranceClaim> =>
    apiClient<TInsuranceClaim>(`${Backend_url}/insurance-claims/${id}`, {
        method: "PATCH",
        body: JSON.stringify(claim),
    });

// Delete an insurance claim
export const deleteInsuranceClaim = async (id: string): Promise<void> =>
    apiClient<void>(`${Backend_url}/insurance-claims/${id}`, {
        method: "DELETE",
    });
