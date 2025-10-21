import { ScrollArea } from '@/components/ui/scroll-area';
import { useCurrentUser } from '@/hooks/use-current-user';
import ChatSidebarHeader from '@/components/chat/sidebar/ChatSidebarHeader';
import ChatRoomList from '@/components/chat/sidebar/ChatRoomList';
import CreateGroupSection from '@/components/chat/sidebar/CreateGroupSection';
import { useRoomProjections } from '@/hooks/use-room-projection';

interface ChatSidebarProps {
  onSelectRoom: (roomId: string) => void;
  selectedRoomId: string | null;
}

const ChatSidebar = ({ onSelectRoom ,selectedRoomId}: ChatSidebarProps) => {
  const { data: currentUser, isLoading : isUserLoading } = useCurrentUser();
  const {data: rooms, isLoading : isRoomLoading} = useRoomProjections(currentUser?.userId);
  if (isUserLoading || isRoomLoading || !currentUser || !rooms) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading user data...</p>
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