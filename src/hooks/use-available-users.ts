
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchAvailableUsers } from "@/api/userApi";

export const useAvailableUsers = (query: string,size =10) => {
  return useInfiniteQuery({
    queryKey: ["availableUsers", query],
    queryFn: ({ pageParam = 0 }) => fetchAvailableUsers(query, pageParam,size),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.page + 1 < lastPage.totalPages ? lastPage.page + 1 : undefined,
    enabled: query.trim().length > 0, // only trigger when user starts typing
  });
};
