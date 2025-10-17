import axiosInstance from "./axiosInstance";
import type { TokenRequest, TokenSuccessResponse } from "@/type/token";



export const generateToken = async (data: TokenRequest): Promise<TokenSuccessResponse> => {
  const response = await axiosInstance.post("/api/token/generate", data);
  return response.data;
};