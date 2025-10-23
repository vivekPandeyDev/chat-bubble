
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchMessagesByRoom } from "@/api/messageApi";


export const useChatMessages = (roomId: string | null, size = 10) => {
  return useInfiniteQuery({
    queryKey: ['messages', roomId],
    queryFn: ({ pageParam }) => {
      return fetchMessagesByRoom(roomId,pageParam,size)
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => lastPage.page + 1 < lastPage.totalPages ? lastPage.page + 1 : undefined,  
    enabled : !!roomId   
  });
};
