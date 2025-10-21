
import { useQuery } from "@tanstack/react-query";
import { fetchMessagesByRoom } from "@/api/messageApi";
import { PaginatedMessagesResponse } from "@/type/message";

export const MESSAGES_PER_PAGE = 20;

export const useChatMessages = (roomId: string | null, page = 1) => {
  return useQuery<PaginatedMessagesResponse>({
    queryKey: ["messages", roomId, page],
    queryFn: () => {
      if (!roomId) throw new Error("No selected room");
      return fetchMessagesByRoom(roomId, page, MESSAGES_PER_PAGE);
    },
    enabled: !!roomId,
  });
};
