
import axiosInstance from './axiosInstance';
import type { RoomProjectionResponse } from '@/type/room';

export const fetchRoomProjections = async (userId: string) => {
    const response = await axiosInstance.get<RoomProjectionResponse>(
        `/api/room/projection/${userId}`);
    return response.data;
};
