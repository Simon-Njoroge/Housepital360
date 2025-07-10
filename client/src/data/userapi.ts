import Backend_url from "@/common/backendUrl";
import { apiClient } from "@/utils/apiClient";
import type {   TUser } from "@/types/types";

//get all users
export const getAllUsers = async (): Promise<TUser[]> => 
    apiClient<TUser[]>(`${Backend_url}/user`)

//get user by id
export const getUserById = async (userId: string | number): Promise<TUser> =>
    apiClient<TUser>(`${Backend_url}/user/${userId}`)

//create user
export const createUser = async (user: Partial<TUser>): Promise<TUser> =>
    apiClient<TUser>(`${Backend_url}/user`, {
        method: "POST",
        body: JSON.stringify(user),
    });

// update user
export const updateUser = async (
    userId: string | number,
    user: Partial<TUser>
): Promise<TUser> =>
    apiClient<TUser>(`${Backend_url}/user/${userId}`, {
        method: "PATCH",
        body: JSON.stringify(user),
    });

// delete user
export const deleteUser = async (userId: string | number): Promise<void> =>
    apiClient<void>(`${Backend_url}/user/${userId}`, {
        method: "DELETE",
    });
    




