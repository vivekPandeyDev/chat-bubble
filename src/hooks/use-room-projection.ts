import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { fetchRoomProjections } from "../api/roomApi";
import type { RoomProjectionResponse } from "../type/room";

export const useRoomProjections = (userId: string | undefined) => {
  const { token } = useContext(AuthContext);
  return useQuery<RoomProjectionResponse>({
    queryKey: ["roomProjections", userId],
    queryFn: async () => {
      if (!token) throw new Error("No auth token");
      if (!userId) throw new Error("No user ID provided");
      return fetchRoomProjections(userId);
    },
    enabled: !!token && !!userId, // prevents running until both are ready
    staleTime: 1000 * 60 * 2, // cache for 2 minutes
  });
};
