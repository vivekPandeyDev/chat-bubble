
import { useQuery } from "@tanstack/react-query";
import { fetchMessagesByRoom } from "@/api/messageApi";
import { PaginatedMessagesResponse } from "@/type/message";
import { AxiosErrorWithProblem } from "@/type/error";



export const useChatMessages = (roomId: string | null, page = 0,size=10) => {
  return useQuery<PaginatedMessagesResponse,AxiosErrorWithProblem>({
    queryKey: ["messages", roomId, page],
    queryFn: () => {
      if (!roomId) throw new Error("No selected room");
      return fetchMessagesByRoom(roomId, page, size);
    },
    enabled: !!roomId,
  });
};
