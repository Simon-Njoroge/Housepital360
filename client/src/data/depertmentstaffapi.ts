import Backend_url from "@/common/backendUrl";
import { apiClient } from "@/utils/apiClient";
import type { TDepartmentStaff } from "@/types/types";

// Get all department staff
export const getAllDepartmentStaff = async (): Promise<TDepartmentStaff[]> =>
    apiClient<TDepartmentStaff[]>(`${Backend_url}/department-staff`);

// Get department staff by id
export const getDepartmentStaffById = async (id: string): Promise<TDepartmentStaff> =>
    apiClient<TDepartmentStaff>(`${Backend_url}/department-staff/${id}`);

// Create department staff
export const createDepartmentStaff = async (staff: Partial<TDepartmentStaff>): Promise<TDepartmentStaff> =>
    apiClient<TDepartmentStaff>(`${Backend_url}/department-staff`, {
        method: "POST",
        body: JSON.stringify(staff),
    });

// Update department staff
export const updateDepartmentStaff = async (id: string, staff: Partial<TDepartmentStaff>): Promise<TDepartmentStaff> =>
    apiClient<TDepartmentStaff>(`${Backend_url}/department-staff/${id}`, {
        method: "PATCH",
        body: JSON.stringify(staff),
    });

// Delete department staff
export const deleteDepartmentStaff = async (id: string): Promise<void> =>
    apiClient<void>(`${Backend_url}/department-staff/${id}`, {
        method: "DELETE",
    });
