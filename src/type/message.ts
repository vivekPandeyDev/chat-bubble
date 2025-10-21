export interface Message {
  messageId: string;
  chatRoomId: string;
  senderId: string;
  content: string;
  sentAt: string;
  status: 'SENT' | 'DELIVERED' | 'SEEN';
  type: 'TEXT' | 'IMAGE' | 'FILE';
}

export interface PaginatedMessagesResponse {
  content: Message[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
