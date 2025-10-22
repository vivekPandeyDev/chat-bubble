// src/api/userApi.ts
import axiosInstance from "./axiosInstance";
import { SignupRequest, UserPaginationResponse, UserSuccessResponse } from "@/type/user";
import type { TokenRequest, TokenSuccessResponse } from "@/type/token";


const generateToken = async (data: TokenRequest): Promise<TokenSuccessResponse> => {
  const response = await axiosInstance.post("/api/token/generate", data);
  console.info("generateToken response issuer:", response.data.data.issuer);
  return response.data;
};

const fetchCurrentUser = async (token: string) => {
  const response = await axiosInstance.get<UserSuccessResponse>("/api/token/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data;
};

const fetchUserById = async (userId: string) => {
  const response = await axiosInstance.get<UserSuccessResponse>(`/api/user/${userId}`);
  return response.data.data;
}

const signupUser = async (data : SignupRequest) => {
  const response = await axiosInstance.post<UserSuccessResponse>("/api/user/register", data);
  return response.data.data;
}

const uploadProfileImage = async (userId: string, file: File) => {
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

const fetchAvailableUsers = async (query: string, page = 0, size = 10) => {
  const res = await axiosInstance.get<UserPaginationResponse>(`/api/user/search`, {
    params: { query, offset: page, size },
  });
  return res.data;
};

export {fetchCurrentUser,fetchUserById,signupUser,uploadProfileImage,generateToken,fetchAvailableUsers}