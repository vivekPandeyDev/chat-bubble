import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { fetchCurrentUser } from "../api/userApi";
import { User } from "../type/user";
import { AxiosErrorWithProblem } from "@/type/error";

export const useCurrentUser = () => {
  const { token } = useContext(AuthContext);

  return useQuery<User, AxiosErrorWithProblem>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      if (!token) throw new Error("No auth token");
      return fetchCurrentUser(token);
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};