import { User } from "./user";

export interface RoomInfo {
    roomId: string;
    type: "SINGLE" | "GROUP" | "TEMPORARY";
    createdBy: User;
    createdAt: string;
    participants: User[];
    active: boolean;
    roomName: string;
    admins: User[];
    permanent: boolean;
    expiresAt: Date | null;
    roomProfileUrl: string | null;
}

export interface ChatRoomProjection {
  roomId: string;
  roomType: 'GROUP' | 'SINGLE' | 'TEMPORARY';
  roomName: string;
  roomProfileUrl: string | null;
  lastTextMessage: string;
  unreadCount: number;
}

export interface RoomProjectionResponse {
  content: ChatRoomProjection[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}