import { apiClient } from "@/utils/apiClient";
import Backend_url from "@/common/backendUrl";
import type { TAppointment } from "@/types/types";

// Get all appointments
export const getAllAppointments = async (): Promise<TAppointment[]> =>
    apiClient<TAppointment[]>(`${Backend_url}/appointments`);

// Get appointment by id
export const getAppointmentById = async (id: string | number): Promise<TAppointment> =>
    apiClient<TAppointment>(`${Backend_url}/appointments/${id}`);

// Create appointment
export const createAppointment = async (appointment: Partial<TAppointment>): Promise<TAppointment> =>
    apiClient<TAppointment>(`${Backend_url}/appointments`, {
        method: "POST",
        body: JSON.stringify(appointment),
    });

//get all by user id
// Get appointments by user ID
export const getAppointmentsByUserId = async (userId: string): Promise<TAppointment[]> =>
  apiClient<TAppointment[]>(`${Backend_url}/appointments/user/${userId}`);

//confirm appointment
export const confirmAppointment = async (appointmentId: string | number): Promise<{ success?: boolean; error?: string }> =>
        apiClient<{ success?: boolean; error?: string }>(`${Backend_url}/appointments/${appointmentId}/confirm`, {
            method: "POST",
        });
//complete appointment
export const completeAppointment = async (appointmentId: string | number): Promise<{ success?: boolean; error?: string }> =>
        apiClient<{ success?: boolean; error?: string }>(`${Backend_url}/appointments/${appointmentId}/complete`, {
            method: "POST",
        });
// Get appointments by doctor ID
export const getAppointmentsByDoctorId = async (doctorId: string): Promise<TAppointment[]> =>
  apiClient<TAppointment[]>(`${Backend_url}/appointments/doctor/${doctorId}/patients`);

// Update appointment
export const updateAppointment = async (id: string | number, appointment: Partial<TAppointment>): Promise<TAppointment> =>
    apiClient<TAppointment>(`${Backend_url}/appointments/${id}`, {
        method: "PATCH",
        body: JSON.stringify(appointment),
    });

// Delete appointment
export const deleteAppointment = async (id: string | number): Promise<void> =>
    apiClient<void>(`${Backend_url}/appointments/${id}`, {
        method: "DELETE",
    });
