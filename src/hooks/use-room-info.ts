import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { fetchRoomInfo } from "../api/roomApi";


export const useRoomInfo = (roomId: string | undefined) => {
  const { token } = useContext(AuthContext);

  return useQuery({
    queryKey: ["room", "info", roomId],
    queryFn: async () => {
      if (!token) throw new Error("No auth token");
      if (!roomId) throw new Error("No room ID provided");
      return fetchRoomInfo(roomId);
    },
    enabled: !!token && !!roomId,
    staleTime: 1000 * 60 * 2, // 2 minutes cache
  });
};
