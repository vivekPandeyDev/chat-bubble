import { ScrollArea } from '@/components/ui/scroll-area';
import { useCurrentUser } from '@/hooks/use-current-user';
import ChatSidebarHeader from '@/components/chat/sidebar/ChatSidebarHeader';
import ChatRoomList from '@/components/chat/sidebar/ChatRoomList';
import CreateGroupSection from '@/components/chat/sidebar/CreateGroupSection';
import { useRoomProjections } from '@/hooks/use-room-projection';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ChatSidebarProps {
  onSelectRoom: (roomId: string) => void;
  selectedRoomId: string | null;
}

const ChatSidebar = ({ onSelectRoom, selectedRoomId }: ChatSidebarProps) => {
  const { data: currentUser, isLoading: isUserLoading, error: userError } = useCurrentUser();
  const { data: rooms, isLoading: isRoomLoading, error: roomError } = useRoomProjections(currentUser?.userId);
  const navigate = useNavigate();

  useEffect(() => {
    if (userError || roomError) {
      console.error("Error fetching current user:", userError?.message)
      console.error("Error fetching room:", roomError?.message)
      navigate("/error", {
        state: {
          message: (userError || roomError).message || "Something went wrong.",
          statusCode: (userError || roomError).response?.data?.status || 500,
        },
        replace: true,
      });
    }

  }, [userError, roomError]);

  if (isUserLoading || isRoomLoading || !currentUser || !rooms) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 space-y-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
          <div className="absolute inset-0 border-4 border-t-green-500 border-gray-200 rounded-full animate-spin animation-delay-150"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 border-r border-border bg-[hsl(var(--sidebar-bg))] flex flex-col h-screen flex-shrink-0">
      <ChatSidebarHeader currentUser={currentUser} />
      <ScrollArea className="flex-1">
        <ChatRoomList
          selectedRoomId={selectedRoomId}
          onSelectRoom={onSelectRoom}
          rooms={rooms.content || []}
        />
      </ScrollArea>
      <CreateGroupSection />
    </div>
  );
};

export default ChatSidebar;