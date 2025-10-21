export interface Message {
  id: string;
  chatRoomId: string;
  senderId: string;
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'file';
}

export interface PaginatedMessagesResponse {
  content: Message[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
