export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  status: 'online' | 'offline';
  lastSeen?: Date;
}

export interface Message {
  id: string;
  chatRoomId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'file' | 'image';
}

export interface ChatRoom {
  id: string;
  name?: string;
  type: 'direct' | 'group' | 'temporary';
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  avatar?: string;
  createdAt: Date;
  expiresAt?: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'message' | 'mention' | 'group_invite' | 'system';
  title: string;
  content: string;
  chatRoomId?: string;
  read: boolean;
  timestamp: Date;
}

export const mockUsers: User[] = [
  {
    id: 'user-1',
    username: 'current_user',
    email: 'current@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=current',
    status: 'online',
  },
  {
    id: 'user-2',
    username: 'alice_wonder',
    email: 'alice@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
    status: 'online',
  },
  {
    id: 'user-3',
    username: 'bob_builder',
    email: 'bob@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
    status: 'offline',
    lastSeen: new Date(Date.now() - 3600000),
  },
  {
    id: 'user-4',
    username: 'charlie_chap',
    email: 'charlie@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charlie',
    status: 'online',
  },
  {
    id: 'user-5',
    username: 'diana_dev',
    email: 'diana@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=diana',
    status: 'offline',
    lastSeen: new Date(Date.now() - 7200000),
  },
];

// Generate more messages for pagination testing
const generateMessages = (): Message[] => {
  const messages: Message[] = [];
  const topics = [
    'Hey! How are you doing?',
    'I\'m great! Just working on this new chat system.',
    'That sounds exciting! How\'s it going?',
    'Pretty well! Building out all the features now.',
    'Have you seen the latest updates?',
    'Yes! The infinite scroll is working great.',
    'We should add more features to the chat.',
    'What do you think about adding reactions?',
    'That would be awesome! Let\'s do it.',
    'I can help with the backend implementation.',
    'Perfect! When can you start?',
    'I can start tomorrow morning.',
    'Sounds good. Let\'s sync up then.',
    'Looking forward to it!',
    'Me too! This is going to be great.',
  ];

  // Room 1 - lots of messages for pagination
  for (let i = 0; i < 50; i++) {
    messages.push({
      id: `msg-room1-${i}`,
      chatRoomId: 'room-1',
      senderId: i % 2 === 0 ? 'user-2' : 'user-1',
      content: topics[i % topics.length],
      timestamp: new Date(Date.now() - (50 - i) * 300000),
      status: i > 45 ? 'delivered' : 'read',
      type: 'text',
    });
  }

  // Add some image and file messages
  messages.push({
    id: 'msg-image-1',
    chatRoomId: 'room-1',
    senderId: 'user-2',
    content: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
    timestamp: new Date(Date.now() - 200000),
    status: 'read',
    type: 'image',
  });

  messages.push({
    id: 'msg-file-1',
    chatRoomId: 'room-1',
    senderId: 'user-1',
    content: 'project-specs.pdf',
    timestamp: new Date(Date.now() - 100000),
    status: 'delivered',
    type: 'file',
  });

  // Room 2 messages
  messages.push({
    id: 'msg-5',
    chatRoomId: 'room-2',
    senderId: 'user-3',
    content: 'Can someone help me with the deployment?',
    timestamp: new Date(Date.now() - 7200000),
    status: 'read',
    type: 'text',
  });

  // Room 3 messages
  messages.push({
    id: 'msg-6',
    chatRoomId: 'room-3',
    senderId: 'user-4',
    content: 'Quick question about the API',
    timestamp: new Date(Date.now() - 120000),
    status: 'delivered',
    type: 'text',
  });

  return messages;
};

export const mockMessages: Message[] = generateMessages();

export const mockChatRooms: ChatRoom[] = [
  {
    id: 'room-1',
    type: 'direct',
    participants: ['user-1', 'user-2'],
    lastMessage: mockMessages[3],
    unreadCount: 0,
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: 'room-2',
    name: 'Dev Team',
    type: 'group',
    participants: ['user-1', 'user-3', 'user-4'],
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=devteam',
    lastMessage: mockMessages[4],
    unreadCount: 0,
    createdAt: new Date(Date.now() - 172800000),
  },
  {
    id: 'room-3',
    type: 'direct',
    participants: ['user-1', 'user-4'],
    lastMessage: mockMessages[5],
    unreadCount: 2,
    createdAt: new Date(Date.now() - 43200000),
  },
  {
    id: 'room-4',
    name: 'Project Alpha',
    type: 'temporary',
    participants: ['user-1', 'user-2', 'user-5'],
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=alpha',
    unreadCount: 5,
    createdAt: new Date(Date.now() - 21600000),
    expiresAt: new Date(Date.now() + 86400000),
  },
];

export const getCurrentUser = () => mockUsers[0];

export const getUserById = (id: string) => mockUsers.find(u => u.id === id);

export const getMessagesByChatRoom = (roomId: string) => 
  mockMessages.filter(m => m.chatRoomId === roomId);

export const getChatRoomParticipants = (room: ChatRoom) => 
  mockUsers.filter(u => room.participants.includes(u.id));

export const getDirectChatName = (room: ChatRoom, currentUserId: string) => {
  if (room.type !== 'direct') return room.name;
  const otherUserId = room.participants.find(id => id !== currentUserId);
  return getUserById(otherUserId || '')?.username || 'Unknown';
};

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-1',
    type: 'mention',
    title: 'New mention',
    content: 'alice_wonder mentioned you in Dev Team',
    chatRoomId: 'room-2',
    read: false,
    timestamp: new Date(Date.now() - 300000),
  },
  {
    id: 'notif-2',
    userId: 'user-1',
    type: 'message',
    title: 'New message',
    content: 'charlie_chap sent you a message',
    chatRoomId: 'room-3',
    read: false,
    timestamp: new Date(Date.now() - 600000),
  },
  {
    id: 'notif-3',
    userId: 'user-1',
    type: 'group_invite',
    title: 'Group invitation',
    content: 'You were added to Project Alpha',
    chatRoomId: 'room-4',
    read: true,
    timestamp: new Date(Date.now() - 7200000),
  },
];

export const getUnreadNotifications = (userId: string) =>
  mockNotifications.filter(n => n.userId === userId && !n.read);
