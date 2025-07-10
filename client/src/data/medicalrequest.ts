import Backend_url from "@/common/backendUrl";
import type { TMedicationRequest } from "@/types/types";
import { apiClient } from "@/utils/apiClient";

export const createMedicationRequest = async (data: Partial<TMedicationRequest>[]): Promise<any> => {
  return apiClient(`${Backend_url}/medication-requests/bulk`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};


// get all by user id
export const getMedicationRequestsByUserId = async (userId: string | number): Promise<TMedicationRequest[]> => {
  return apiClient<TMedicationRequest[]>(`${Backend_url}/medication-requests/user/${userId}`);
};
