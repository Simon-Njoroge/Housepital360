import { getAllPatientProfiles,getPatientProfileByUserId,updatePatientProfile,createPatientProfile,deletePatientProfile } from "@/data/patientprofileapi";
import {
  useAllItems,
  useItemById,
  useAddItem,
  useUpdateItem,
  useDeleteItem,
} from "@/utils/hookClient";
import type { TPatientProfile } from "@/types/types";

export const useAllPatientProfiles = () =>
  useAllItems<TPatientProfile>(["allPatientProfiles"], getAllPatientProfiles);

export const usePatientProfileByUserId = (userId: string) =>
  useItemById<TPatientProfile>(["patientProfile", userId], getPatientProfileByUserId, userId);

export const useAddPatientProfile = () =>
  useAddItem<TPatientProfile>(["allPatientProfiles"], createPatientProfile);

export const useUpdatePatientProfileById = () =>
  useUpdateItem<TPatientProfile>(["allPatientProfiles"], updatePatientProfile);

export const useDeletePatientProfileById = () =>
  useDeleteItem(["allPatientProfiles"], deletePatientProfile);