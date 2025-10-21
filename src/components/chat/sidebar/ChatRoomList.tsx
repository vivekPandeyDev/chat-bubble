import ChatRoomListItem from '@/components/chat/sidebar/ChatRoomListItem';
import { ChatRoomProjection } from '@/type/room';

interface ChatRoomListProps {
  selectedRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
  rooms:  ChatRoomProjection[];
}

const ChatRoomList = ({
  selectedRoomId,
  onSelectRoom,
  rooms
}: ChatRoomListProps) => {
  return (
    <div className="p-2">
      {rooms.map((room) => (
        <ChatRoomListItem
          key={room.roomId}
          room={room}
          isActive={selectedRoomId === room.roomId}
          onSelect={() => onSelectRoom(room.roomId)}
        />
      ))}
    </div>
  );
};

export default ChatRoomList;
