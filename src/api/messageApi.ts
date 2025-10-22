
import axiosInstance from "./axiosInstance";
import { PaginatedMessagesResponse } from "@/type/message";

export const fetchMessagesByRoom = async (roomId: string, page = 1, size = 10) => {
  console.info('fetch message for room-id',roomId,'page:',page,'size:' ,size)
  const response = await axiosInstance.get<PaginatedMessagesResponse>(
    `/api/room/${roomId}/message?offset=${page}&size=${size}&sortDir=desc&sortBy=sentAt`
  );
  return response.data;
};
