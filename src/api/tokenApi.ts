import axiosInstance from "./axiosInstance";
import type { TokenSuccessResponse } from "@/type/token";

interface TokenRequest {
  email: string;
  password: string;
}

export const generateToken = async (data: TokenRequest): Promise<TokenSuccessResponse> => {
  const response = await axiosInstance.post("/api/token/generate", data);
  return response.data;
};