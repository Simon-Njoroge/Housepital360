import Backend_url from "@/common/backendUrl";
import { apiClient } from "@/utils/apiClient";

export type TChatMessage = {
  id: string;
  content: string;
  sender: { id: string; role: string };
  recipient: { id: string; role: string };
  sentAt: string;
};

export const getChatHistory = async (
  userId: string,
  otherUserId: string,
  page = 1,
  limit = 20
): Promise<TChatMessage[]> =>
  apiClient<TChatMessage[]>(
    `${Backend_url}/chat/history/${userId}/${otherUserId}?page=${page}&limit=${limit}`
  );
