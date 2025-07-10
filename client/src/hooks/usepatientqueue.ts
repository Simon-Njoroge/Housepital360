import {
  useAllItems,
  useItemById,
  useAddItem,
  useUpdateItem,
  useDeleteItem,
} from "@/utils/hookClient";
import type { TPatientQueue } from "@/types/types";
import { getAllPatientQueues,updatePatientQueue,getPatientQueuesByDoctorId,getPatientQueueById,deletePatientQueue,createPatientQueue } from "@/data/partientqueueapi";

export const useAllPatientQueues = () =>
  useAllItems<TPatientQueue>(["allPatientQueues"], getAllPatientQueues);

export const usePatientQueueById = (id: string | number) =>
  useItemById<TPatientQueue>(["patientQueue", id], getPatientQueueById, id);

export const usePatientQueuesByDoctorId = (doctorId: string | number) =>
  useAllItems<TPatientQueue>(["patientQueuesByDoctor", doctorId], () => getPatientQueuesByDoctorId(doctorId));

export const useAddPatientQueue = () =>
  useAddItem<TPatientQueue>(["allPatientQueues"], createPatientQueue);

export const useUpdatePatientQueueById = () =>
  useUpdateItem<TPatientQueue>(["allPatientQueues"], updatePatientQueue);

export const useDeletePatientQueueById = () =>
  useDeleteItem(["allPatientQueues"], deletePatientQueue);