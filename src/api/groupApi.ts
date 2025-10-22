import { ApiResponse } from "@/type/api";
import axiosInstance from "./axiosInstance";
export interface CreateGroupRequest {
  createdById: string;
  groupName: string;
  isPermanent: boolean;
  initialParticipantIds: string[];
}

export const createGroup = async (data: CreateGroupRequest): Promise<ApiResponse<string>> => {
  const response = await axiosInstance.post<ApiResponse<string>>("/api/group/room", data);
  return response.data;
};