import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, CheckCheck, File, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import MessageActions from './MessageActions';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { Message } from '@/type/message';
import { useFetchUserByUserId } from '@/hooks/use-fetch-user-by-id';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  onReply?: (message: Message) => void;
}

const MessageBubble = ({ message, isCurrentUser, onReply }: MessageBubbleProps) => {
  const { toast } = useToast();
  const {data : sender, isLoading} = useFetchUserByUserId(message.senderId);
  const [isEditing, setIsEditing] = useState(false);
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const handleReply = () => {
    onReply?.(message);
    toast({
      title: 'Reply',
      description: 'Replying to message',
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
    toast({
      title: 'Edit',
      description: 'Edit functionality would open here',
    });
  };

  const handleDelete = () => {
    console.log('Deleting message:', message.messageId);
    toast({
      title: 'Message deleted',
      description: 'Message has been removed',
    });
  };

  return (
    <div className={cn(
      "flex gap-2 items-start group",
      isCurrentUser ? "flex-row-reverse" : "flex-row"
    )}>
      {!isCurrentUser && (
        <Avatar className="h-8 w-8 mt-1">
          <AvatarImage src={sender?.avatarUrl} />
          <AvatarFallback>{sender?.username[0].toUpperCase()}</AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn(
        "flex flex-col max-w-[70%]",
        isCurrentUser ? "items-end" : "items-start"
      )}>
        {!isCurrentUser && (
          <span className="text-xs font-medium text-muted-foreground mb-1 px-1">
            {sender?.username}
          </span>
        )}
        
        <div className="relative">
          <div className={cn(
            "rounded-2xl border shadow-sm overflow-hidden",
            isCurrentUser
              ? "bg-gradient-to-br from-[hsl(var(--message-sent))] to-[hsl(var(--primary-glow))] text-[hsl(var(--message-sent-foreground))]"
              : "bg-[hsl(var(--message-received))] text-[hsl(var(--message-received-foreground))] border-border"
          )}>
            {/* Image message */}
            {message.type === 'IMAGE' && (
              <div className="max-w-xs">
                <img 
                  src={message.content || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400'} 
                  alt="Shared image" 
                  className="w-full h-auto rounded-t-2xl cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => window.open(message.content, '_blank')}
                />
              </div>
            )}

            {/* File message */}
            {message.type === 'FILE' && (
              <div className="px-4 py-3 flex items-center gap-3">
                <div className={cn(
                  "h-10 w-10 rounded-lg flex items-center justify-center",
                  isCurrentUser ? "bg-[hsl(var(--message-sent-foreground))]/10" : "bg-muted"
                )}>
                  <File className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {message.content || 'document.pdf'}
                  </p>
                  <Badge variant="secondary" className="text-xs mt-1">
                    File
                  </Badge>
                </div>
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Text message */}
            {message.type === 'TEXT' && (
              <div className="px-4 py-2">
                <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
              </div>
            )}
          </div>
          
          <MessageActions 
            onReply={handleReply}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isCurrentUser={isCurrentUser}
          />
        </div>
        
        <div className={cn(
          "flex items-center gap-1 text-xs text-muted-foreground mt-1 px-1",
          isCurrentUser && "flex-row-reverse"
        )}>
          <span>{formatDistanceToNow(message.sentAt, { addSuffix: true })}</span>
          {isCurrentUser && (
            <>
              {message.status === 'SEEN' && <CheckCheck className="h-3 w-3 text-primary" />}
              {message.status === 'DELIVERED' && <CheckCheck className="h-3 w-3" />}
              {message.status === 'SENT' && <Check className="h-3 w-3" />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
