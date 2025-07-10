import {
  useAllItems,
  useItemById,
  useAddItem,
  useUpdateItem,
  useDeleteItem,
} from "@/utils/hookClient";
import type { TAppointment } from "@/types/types";
import {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentsByUserId,
  getAppointmentsByDoctorId,
  confirmAppointment
} from "@/data/appointementapi";

export const useAllAppointments = () =>
  useAllItems<TAppointment>(["allAppointments"], getAllAppointments);

export const useAppointmentsByDoctorId = (doctorId: string) =>
  useAllItems<TAppointment>(["appointmentsByDoctor", doctorId], () => getAppointmentsByDoctorId(doctorId));
// Confirm appointment
export const useConfirmAppointment = (appointmentId:string) =>
  useUpdateItem<{ success?: boolean; error?: string }>(["allAppointments",appointmentId], ()=>confirmAppointment(appointmentId));

export const useAppointmentById = (id: string) =>
  useItemById<TAppointment>(["appointment"], getAppointmentById, id);
export const useAppointmentsByUserId = (userId: string) =>
  useAllItems<TAppointment>(["appointmentsByUser", userId], () => getAppointmentsByUserId(userId));

export const useAddAppointment = () =>
  useAddItem<TAppointment>(["allAppointments"], createAppointment);

export const useUpdateAppointmentById = () =>
  useUpdateItem<TAppointment>(["allAppointments"], updateAppointment);

export const useDeleteAppointmentById = () =>
  useDeleteItem(["allAppointments"], deleteAppointment);