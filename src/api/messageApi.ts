
import axiosInstance from "./axiosInstance";
import { PaginatedMessagesResponse } from "@/type/message";

export const fetchMessagesByRoom = async (roomId: string, page = 1, size = 20) => {
  const response = await axiosInstance.get<PaginatedMessagesResponse>(
    `/api/room/${roomId}/messages?page=${page}&size=${size}`
  );
  return response.data;
};
