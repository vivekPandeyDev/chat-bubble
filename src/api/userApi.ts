// src/api/userApi.ts
import axiosInstance from "./axiosInstance";
import { SignupRequest, UserSuccessResponse } from "@/type/user";

export const fetchCurrentUser = async (token: string) => {
  const response = await axiosInstance.get<UserSuccessResponse>("/api/token/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data;
};

export const fetchUserById = async (userId: string) => {
  const response = await axiosInstance.get<UserSuccessResponse>(`/api/user/${userId}`);
  return response.data.data;
}

export const signupUser = async (data : SignupRequest) => {
  const response = await axiosInstance.post<UserSuccessResponse>("/api/user/register", data);
  return response.data.data;
}

export const uploadProfileImage = async (userId: string, file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosInstance.post(
    `/api/user/upload/profile/${userId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};