import {
  useAllItems,
  useAddItem,
} from "@/utils/hookClient";
import type { TMedicationRequest } from "@/types/types";
import {
  createMedicationRequest,
  getMedicationRequestsByUserId,
} from "@/data/medicalrequest";
export const useAllMedicationRequests = (userId:string) =>
  useAllItems<TMedicationRequest>(
    ["allMedicationRequests", userId],()=>
      getMedicationRequestsByUserId(userId)
  );

export const useAddMedicationRequest = () =>
  useAddItem<TMedicationRequest>(
    ["allMedicationRequests"],
    createMedicationRequest
  );