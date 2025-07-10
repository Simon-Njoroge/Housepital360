import Backend_url from "@/common/backendUrl";
import { apiClient } from "@/utils/apiClient";
import type { TDepartment } from "@/types/types";

//get all departments
export const getAllDepartments = async (): Promise<TDepartment[]> =>
    apiClient<TDepartment[]>(`${Backend_url}/departments`);

//get department by id
export const getDepartmentById = async (id: string | number): Promise<TDepartment> =>
    apiClient<TDepartment>(`${Backend_url}/departments/${id}`);

//create department
export const createDepartment = async (department: Partial<TDepartment>): Promise<TDepartment> =>
    apiClient<TDepartment>(`${Backend_url}/departments`, {
        method: "POST",
        body: JSON.stringify(department),
    });

//update department
export const updateDepartment = async (id: string | number, department: Partial<TDepartment>): Promise<TDepartment> =>
    apiClient<TDepartment>(`${Backend_url}/departments/${id}`, {
        method: "PUT",
        body: JSON.stringify(department),
    });

//delete department
export const deleteDepartment = async (id: string | number): Promise<void> =>
    apiClient<void>(`${Backend_url}/departments/${id}`, {
        method: "DELETE",
    });
