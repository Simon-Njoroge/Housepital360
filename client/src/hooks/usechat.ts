import { useQuery } from '@tanstack/react-query'
import { getChatHistory } from '@/data/chat'
import type { TChatMessage } from '@/data/chat'

export const useChatHistory = (
  userId: string,
  otherUserId: string,
  page = 1,
  limit = 20
) => {
  return useQuery<TChatMessage[], Error>({
    queryKey: ['chat-history', userId, otherUserId, page, limit],
    queryFn: () => getChatHistory(userId, otherUserId, page, limit),
    enabled: !!userId && !!otherUserId, 
  })
}
