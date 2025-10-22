import { useState, useEffect, useRef, UIEvent } from 'react';
import ChatHeader from './ChatHeader';
import ChatMessageList from './ChatMessageList';
import ChatInputArea from './ChatInputArea';
import GroupInfoPanel from './GroupInfoPanel';
import TypingIndicator from './TypingIndicator';
import { useChatMessages } from '@/hooks/use-chat-message';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useNavigate } from 'react-router-dom';
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { useRoomInfo } from '@/hooks/use-room-info';
import { Sheet, SheetContent } from '@/components/ui/sheet';

export const MESSAGES_PER_PAGE = 10;
interface ChatPanelProps {
  selectedRoomId: string | null;
}

const ChatPanel = ({ selectedRoomId }: ChatPanelProps) => {
  console.info('is room selected', !!selectedRoomId);
  const navigate = useNavigate();
  const { data: currentUser, isLoading: isUserLoading, error: userError } = useCurrentUser();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useChatMessages(selectedRoomId);
  const { data: room, isLoading: isRoomLoading, error: roomError } = useRoomInfo(selectedRoomId);
  const [isTyping, setIsTyping] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const didInitialScroll = useRef(false);

  const displayedMessages = data?.pages
    .sort((a, b) => a.page - b.page)
    .flatMap(page => page.content).reverse() || [];
  // Scroll only once on first load
  useEffect(() => {
    if (didInitialScroll.current) return;
    if (displayedMessages.length === 0) return;

    const el = scrollRef.current;
    if (!el) return;

    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
      didInitialScroll.current = true;
    });
  }, [displayedMessages.length]);

  // handle errors
  useEffect(() => {
    if (userError) {
      console.error("Error fetching current user:", userError?.message)
      navigate("/error", {
        state: {
          message: (userError).message || "Something went wrong.",
          statusCode: (userError).response?.data?.status || 500,
        },
        replace: true,
      });
    }

  }, [userError]);

  const handleMessageSent = () => {
    refetch();
  };

  // if no room is selected
  if (!selectedRoomId || !room) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center text-muted-foreground">
          Select a conversation to start chatting
        </div>
      </div>
    );
  }

  if (isUserLoading || isRoomLoading || !currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 space-y-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
          <div className="absolute inset-0 border-4 border-t-green-500 border-gray-200 rounded-full animate-spin animation-delay-150"></div>
        </div>
      </div>
    );
  }
  console.log('Rendering ChatPanel for room:', room, 'user:', currentUser.userId);

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      <ChatHeader
        avatar={room.roomProfileUrl}
        roomName={room.roomName}
        status={room.participants.map(p => p.status).find(s => s === "ONLINE") ? "ONLINE" : "OFFLINE"}
        onToggleGroupInfo={() => setShowGroupInfo(!showGroupInfo)}
      />
      <ScrollAreaPrimitive.Root className="flex-1 px-6 py-4">
        <ScrollAreaPrimitive.Viewport className="h-full">
          <ChatMessageList
            messages={displayedMessages}
            currentUserId={currentUser.userId}
            hasMore={!!hasNextPage}
            isLoading={isFetchingNextPage}
            onLoadMore={() => fetchNextPage()}
            scrollRef={scrollRef}
          />
        </ScrollAreaPrimitive.Viewport>
        {isTyping && <TypingIndicator avatarUrl={currentUser.avatarUrl} username={currentUser.username} />}
        <ScrollAreaPrimitive.Scrollbar orientation="vertical" />
      </ScrollAreaPrimitive.Root>

      <ChatInputArea selectedRoomId={selectedRoomId} onMessageSent={() => { handleMessageSent() }} onTypingChange={setIsTyping} />

      <Sheet open={showGroupInfo} onOpenChange={setShowGroupInfo}>
        <SheetContent side="right" className="w-96 p-0">
          <GroupInfoPanel
            room={room}
            currentUser={currentUser}
          />
        </SheetContent>
      </Sheet>
      {/* {showGroupInfo && (
        <GroupInfoPanel
          room={room}
          currentUser={currentUser}
          onClose={() => setShowGroupInfo(false)}
        />
      )} */}
    </div>
  );
};

export default ChatPanel;