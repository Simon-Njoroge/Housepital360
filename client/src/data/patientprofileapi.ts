import Backend_url from "@/common/backendUrl";
import { apiClient } from "@/utils/apiClient";
import type { TPatientProfile } from "@/types/types";

//get all patient profiles
export const getAllPatientProfiles = async (): Promise<TPatientProfile[]> =>
    apiClient<TPatientProfile[]>(`${Backend_url}/patient-profiles`);

//get patient profile by user id
export const getPatientProfileByUserId = async (userId: string | number): Promise<TPatientProfile> =>
    apiClient<TPatientProfile>(`${Backend_url}/patient-profiles/${userId}`);

//create patient profile
export const createPatientProfile = async (profile: Partial<TPatientProfile>): Promise<TPatientProfile> =>
    apiClient<TPatientProfile>(`${Backend_url}/patient-profiles`, {
        method: "POST",
        body: JSON.stringify(profile),
    });

//update patient profile
export const updatePatientProfile = async (userId: string | number, profile: Partial<TPatientProfile>): Promise<TPatientProfile> =>
    apiClient<TPatientProfile>(`${Backend_url}/patient-profiles/user/${userId}`, {
        method: "PATCH",
        body: JSON.stringify(profile),
    });

//delete patient profile
export const deletePatientProfile = async (userId: string | number): Promise<void> =>
    apiClient<void>(`${Backend_url}/patient-profiles/${userId}`, {
        method: "DELETE",
    });

