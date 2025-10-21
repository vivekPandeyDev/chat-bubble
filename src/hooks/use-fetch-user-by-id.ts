import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {  fetchUserById } from "../api/userApi";
import { UserResponse } from "../type/user";

export const useFetchUserByUserId = (userId : string) => {
  const { token } = useContext(AuthContext);

  return useQuery<UserResponse>({
    queryKey: ["user",userId],
    queryFn: async () => {
      if (!token) throw new Error("No auth token");
      return fetchUserById(userId);
    },
    enabled: !!token && !!userId, // prevents running until both are ready
  });
};