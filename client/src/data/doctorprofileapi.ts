import { apiClient } from "@/utils/apiClient";
import Backend_url from "@/common/backendUrl";
import type { TDoctorProfile } from "@/types/types";

//get all doctor profiles
export const getAllDoctorProfiles = async (): Promise<TDoctorProfile[]> =>
    apiClient<TDoctorProfile[]>(`${Backend_url}/doctor-profiles`);

//get doctor profile by user id
export const getDoctorProfileByUserId = async (userId: string): Promise<TDoctorProfile> =>
    apiClient<TDoctorProfile>(`${Backend_url}/doctor-profiles/${userId}`);

//create doctor profile
export const createDoctorProfile = async (profile: Partial<TDoctorProfile>): Promise<TDoctorProfile> =>
    apiClient<TDoctorProfile>(`${Backend_url}/doctor-profiles`, {
        method: "POST",
        body: JSON.stringify(profile),
    });

//update doctor profile
export const updateDoctorProfile = async (userId: string, profile: Partial<TDoctorProfile>): Promise<TDoctorProfile> =>
    apiClient<TDoctorProfile>(`${Backend_url}/doctor-profiles/${userId}`, {
        method: "PATCH",
        body: JSON.stringify(profile),
    });

//delete doctor profile
export const deleteDoctorProfile = async (userId: string): Promise<void> =>
    apiClient<void>(`${Backend_url}/doctor-profiles/${userId}`, {
        method: "DELETE",
    });
