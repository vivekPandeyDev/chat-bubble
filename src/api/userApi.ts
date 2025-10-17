// src/api/userApi.ts
import axios from "axios";
import axiosInstance from "./axiosInstance";
import { UserSuccessResponse } from "@/type/user";

export const fetchCurrentUser = async (token: string) => {
  const response = await axiosInstance.get<UserSuccessResponse>("/api/token/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data;
};
