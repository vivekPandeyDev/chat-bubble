import { useState, useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import ChatHeader from './ChatHeader';
import ChatMessageList from './ChatMessageList';
import ChatInputArea from './ChatInputArea';
import GroupInfoPanel from './GroupInfoPanel';
import TypingIndicator from './TypingIndicator';
import { useChatMessages } from '@/hooks/use-chat-message';
import { useCurrentUser } from '@/hooks/use-current-user';
import { Message } from '@/type/message';


interface ChatPanelProps {
  selectedRoomId: string | null;
}

const ChatPanel = ({ selectedRoomId }: ChatPanelProps) => {
  const { toast } = useToast();
  const { data: currentUser, isLoading: isUserLoading } = useCurrentUser();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: messagesData, isLoading } = useChatMessages(selectedRoomId, currentPage);

  // Update displayed messages when data changes
  useEffect(() => {
    if (!messagesData) return;

    if (currentPage === 1) {
      setDisplayedMessages(messagesData.content);
    } else {
      // prepend older messages when loading more
      setDisplayedMessages(prev => [...messagesData.content, ...prev]);
    }

    setHasMoreMessages(currentPage < messagesData.totalPages);
    setIsLoadingMore(false);

    scrollToBottom(currentPage === 1);
  }, [messagesData]);

  const scrollToBottom = (force = false) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: force ? "auto" : "smooth" });
    }
  };

  const handleLoadMore = () => {
    if (!selectedRoomId || isLoadingMore || !messagesData) return;

    if (currentPage < messagesData.totalPages) {
      setCurrentPage(prev => prev + 1);
      setIsLoadingMore(true);
    }
  };

  if (!selectedRoomId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center text-muted-foreground">
          Select a conversation to start chatting
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      <ChatHeader
        avatar={null}
        roomName={"test room name"}
        status={"Online"}
        onToggleGroupInfo={() => setShowGroupInfo(!showGroupInfo)}
      />

      <ScrollArea className="flex-1 px-6 py-4">
        <ChatMessageList
          messages={displayedMessages}
          currentUserId={currentUser.userId}
          onLoadMore={handleLoadMore}
          hasMore={hasMoreMessages}
          isLoading={isLoadingMore}
        />

        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </ScrollArea>

      <ChatInputArea selectedRoomId={selectedRoomId} onMessageSent={() => scrollToBottom()} />

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