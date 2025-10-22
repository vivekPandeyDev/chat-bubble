
import { ApiResponse } from '@/type/api';
import axiosInstance from './axiosInstance';
import type { RoomInfo, RoomProjectionResponse } from '@/type/room';

export const fetchRoomInfo = async (roomId: string): Promise<RoomInfo> => {
    const response = await axiosInstance.get<ApiResponse<RoomInfo>>(
        `/api/room/info/${roomId}`
    );
    return response.data.data;
};

export const fetchRoomProjections = async (userId: string) => {
    const response = await axiosInstance.get<RoomProjectionResponse>(
        `/api/room/projection/user/${userId}`);
    return response.data;
};

export const uploadRoomAvatar = async (roomId: string, file: File) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const response = await axiosInstance.put(`/api/room/${roomId}/avatar`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};