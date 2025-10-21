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