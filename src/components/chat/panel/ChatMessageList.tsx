//Handles infinite scroll, message rendering, and loaders.
import { Loader2, Badge } from 'lucide-react';
import MessageBubble from './MessageBubble';
import { Message } from '@/type/message';

interface ChatMessageListProps {
  messages: Message[];
  currentUserId: string;
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
}

const ChatMessageList = ({ messages, currentUserId, hasMore, isLoading, onLoadMore }: ChatMessageListProps) => {
  return (
    <div className="space-y-4 max-w-4xl mx-auto" onScrollCapture={(e) => {
      const div = e.target as HTMLDivElement;
      if (div.scrollTop < 100 && hasMore && !isLoading) onLoadMore();
    }}>
      {isLoading && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      {!hasMore && messages.length > 20 && (
        <div className="flex justify-center py-2">
          <Badge fontVariant={"secondary"} className="text-xs">No more messages</Badge>
        </div>
      )}

      {messages.map(msg => (
        <MessageBubble
          key={msg.id}
          message={msg}
          isCurrentUser={msg.senderId === currentUserId}
        />
      ))}
    </div>
  );
};

export default ChatMessageList;
