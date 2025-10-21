import { useState, useEffect, useRef, UIEvent } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatHeader from './ChatHeader';
import ChatMessageList from './ChatMessageList';
import ChatInputArea from './ChatInputArea';
import GroupInfoPanel from './GroupInfoPanel';
import TypingIndicator from './TypingIndicator';
import { useChatMessages } from '@/hooks/use-chat-message';
import { useCurrentUser } from '@/hooks/use-current-user';
import { Message } from '@/type/message';
import { useNavigate } from 'react-router-dom';
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

export const MESSAGES_PER_PAGE = 10;
interface ChatPanelProps {
  selectedRoomId: string | null;
}

const ChatPanel = ({ selectedRoomId }: ChatPanelProps) => {
  console.info('selectedRoomId in ChatPanel:', selectedRoomId);
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const { data: currentUser, isLoading: isUserLoading, error: userError } = useCurrentUser();
  const { data: messagesData, isLoading: isMessageLoading, error: chatError } = useChatMessages(selectedRoomId, page, MESSAGES_PER_PAGE);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);

  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  const didInitialScroll = useRef(false);

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

  const messsages = messagesData?.content;

  // Initial load
  useEffect(() => {
    if (messsages) {
      if (page === 0) {
        setDisplayedMessages(messsages.reverse());
      } else {
        // prepend older messages
        setDisplayedMessages(prev => [...messsages.reverse(), ...prev]);
      }
      setHasMoreMessages(messsages.length === MESSAGES_PER_PAGE);
      setLoading(false);
    }
  }, [messagesData]);


  const loadMore = () => {
    if (!loading && hasMoreMessages) {
      setLoading(true);
      setPage(prev => prev + 1);
    }
  };


  // if no room is selected
  if (!selectedRoomId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center text-muted-foreground">
          Select a conversation to start chatting
        </div>
      </div>
    );
  }

  if (isUserLoading || isMessageLoading || !currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 space-y-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
          <div className="absolute inset-0 border-4 border-t-green-500 border-gray-200 rounded-full animate-spin animation-delay-150"></div>
        </div>
      </div>
    );
  }

  console.log('message:', displayedMessages)
  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      <ChatHeader
        avatar={null}
        roomName={"test room name"}
        status={"Online"}
        onToggleGroupInfo={() => setShowGroupInfo(!showGroupInfo)}
      />
      <ScrollAreaPrimitive.Root className="flex-1 px-6 py-4">
        <ScrollAreaPrimitive.Viewport className="h-full">
          <ChatMessageList
            messages={displayedMessages}
            currentUserId={currentUser.userId}
            onLoadMore={loadMore}
            hasMore={hasMoreMessages}
            isLoading={loading}
            scrollRef={scrollRef}
          />
        </ScrollAreaPrimitive.Viewport>
        {isTyping && <TypingIndicator avatarUrl={currentUser.avatarUrl} username={currentUser.username}/>  }
        <ScrollAreaPrimitive.Scrollbar orientation="vertical" />
      </ScrollAreaPrimitive.Root>

      <ChatInputArea selectedRoomId={selectedRoomId} onMessageSent={() => { }} onTypingChange={setIsTyping} />

      {/* {showGroupInfo && (
        <GroupInfoPanel
          roomId={selectedRoomId}
          onClose={() => setShowGroupInfo(false)}
        />
      )} */}
    </div>
  );
};

export default ChatPanel;