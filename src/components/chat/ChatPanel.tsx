import { useState, useRef, useEffect } from 'react';
import { Send, MoreVertical, Users, Info, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  ChatRoom, 
  getCurrentUser, 
  getDirectChatName, 
  getMessagesByChatRoom,
  getUserById,
  getChatRoomParticipants,
  Message
} from '@/data/mockData';
import MessageBubble from './MessageBubble';
import EmojiPicker from './EmojiPicker';
import FileUpload from './FileUpload';
import GroupInfoPanel from './GroupInfoPanel';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ChatPanelProps {
  selectedRoomId: string | null;
}

const MESSAGES_PER_PAGE = 20;

const ChatPanel = ({ selectedRoomId }: ChatPanelProps) => {
  const { toast } = useToast();
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{ file: File; type: 'image' | 'file'; preview?: string } | null>(null);
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUser = getCurrentUser();

  // Load initial messages when room changes
  useEffect(() => {
    if (selectedRoomId) {
      const allMessages = getMessagesByChatRoom(selectedRoom.id);
      const initial = allMessages.slice(-MESSAGES_PER_PAGE);
      setDisplayedMessages(initial);
      setHasMoreMessages(allMessages.length > MESSAGES_PER_PAGE);
      setIsUserScrolling(false);
      
      // Scroll to bottom on room change
      setTimeout(() => scrollToBottom(true), 100);
    }
  }, [selectedRoom?.id]);

  // Auto-scroll to bottom on new messages (only if user hasn't scrolled up)
  useEffect(() => {
    if (!isUserScrolling && displayedMessages.length > 0) {
      scrollToBottom();
    }
  }, [displayedMessages, isUserScrolling]);

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (uploadedFile?.preview) {
        URL.revokeObjectURL(uploadedFile.preview);
      }
    };
  }, [uploadedFile]);

  const scrollToBottom = (force = false) => {
    if (messagesEndRef.current && (!isUserScrolling || force)) {
      messagesEndRef.current.scrollIntoView({ behavior: force ? 'auto' : 'smooth' });
    }
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    const { scrollTop, scrollHeight, clientHeight } = target;
    
    // Check if user is near bottom (within 100px)
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setIsUserScrolling(!isNearBottom);

    // Load more messages when scrolled to top
    if (scrollTop < 100 && hasMoreMessages && !isLoadingMore) {
      loadMoreMessages();
    }
  };

  const loadMoreMessages = () => {
    if (!selectedRoom || isLoadingMore) return;

    setIsLoadingMore(true);
    const allMessages = getMessagesByChatRoom(selectedRoom.id);
    const currentLength = displayedMessages.length;
    
    // Simulate loading delay
    setTimeout(() => {
      const nextBatch = allMessages.slice(
        Math.max(0, allMessages.length - currentLength - MESSAGES_PER_PAGE),
        allMessages.length - currentLength
      );
      
      if (nextBatch.length > 0) {
        setDisplayedMessages(prev => [...nextBatch, ...prev]);
        setHasMoreMessages(currentLength + nextBatch.length < allMessages.length);
        
        toast({
          description: `Loaded ${nextBatch.length} older messages`,
        });
      } else {
        setHasMoreMessages(false);
      }
      
      setIsLoadingMore(false);
    }, 500);
  };

  if (!selectedRoom) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center max-w-md px-4">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--primary-glow))] opacity-20" />
          <h2 className="text-2xl font-semibold mb-2 text-foreground">Welcome to Chat</h2>
          <p className="text-muted-foreground">Select a conversation to start chatting</p>
        </div>
      </div>
    );
  }


  const roomName = getDirectChatName(selectedRoom, currentUser.id);
  const participants = getChatRoomParticipants(selectedRoom);

  const handleSend = () => {
    if (!messageInput.trim() && !uploadedFile) return;
    
    // Create new message
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      chatRoomId: selectedRoom.id,
      senderId: currentUser.id,
      content: messageInput,
      timestamp: new Date(),
      status: 'sent',
      type: uploadedFile ? (uploadedFile.type === 'image' ? 'image' : 'file') : 'text',
    };

    // Add to displayed messages
    setDisplayedMessages(prev => [...prev, newMessage]);
    
    toast({
      title: 'Message sent',
      description: uploadedFile ? 'File uploaded successfully' : 'Message delivered',
    });

    setMessageInput('');
    setUploadedFile(null);
    setReplyingTo(null);
    setIsUserScrolling(false); // Reset scroll flag to auto-scroll
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessageInput(prev => prev + emoji);
  };

  const handleFileSelect = (file: File, type: 'image' | 'file') => {
    // Create preview for images
    let preview: string | undefined;
    if (type === 'image') {
      preview = URL.createObjectURL(file);
    }
    
    setUploadedFile({ file, type, preview });
    toast({
      title: 'File attached',
      description: `${file.name} ready to send`,
    });
  };

  const handleReply = (message: Message) => {
    setReplyingTo(message);
  };

  const getRoomAvatar = () => {
    if (selectedRoom.avatar) return selectedRoom.avatar;
    if (selectedRoom.type === 'direct') {
      const otherUserId = selectedRoom.participants.find(id => id !== currentUser.id);
      return getUserById(otherUserId || '')?.avatar;
    }
    return undefined;
  };

  const getOnlineStatus = () => {
    if (selectedRoom.type !== 'direct') return null;
    const otherUserId = selectedRoom.participants.find(id => id !== currentUser.id);
    const otherUser = getUserById(otherUserId || '');
    return otherUser?.status;
  };

  return (
    <div className="flex-1 flex bg-background overflow-hidden">
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <div className="h-16 border-b border-border px-6 flex items-center justify-between bg-card">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage src={getRoomAvatar()} />
                <AvatarFallback>{roomName[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              {selectedRoom.type === 'direct' && getOnlineStatus() === 'online' && (
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-[hsl(var(--online))] border-2 border-card shadow-[0_0_6px_hsl(var(--online))]" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-foreground">{roomName}</h2>
                {selectedRoom.type === 'temporary' && (
                  <Badge variant="secondary" className="text-xs">Temporary</Badge>
                )}
              </div>
              {selectedRoom.type === 'direct' ? (
                <p className="text-xs text-muted-foreground">
                  {getOnlineStatus() === 'online' ? 'Active now' : 'Offline'}
                </p>
              ) : (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  <span>{selectedRoom.participants.length} members</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {selectedRoom.type !== 'direct' && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowGroupInfo(!showGroupInfo)}
              >
                <Info className="h-5 w-5" />
              </Button>
            )}
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 px-6 py-4">
          <div 
            className="space-y-4 max-w-4xl mx-auto"
            ref={scrollAreaRef}
            onScroll={handleScroll}
          >
            {/* Loading indicator at top */}
            {isLoadingMore && (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}
            
            {/* Show "no more messages" indicator */}
            {!hasMoreMessages && displayedMessages.length > MESSAGES_PER_PAGE && (
              <div className="flex justify-center py-2">
                <Badge variant="secondary" className="text-xs">
                  No more messages
                </Badge>
              </div>
            )}

            {displayedMessages.map((message) => (
              <MessageBubble 
                key={message.id} 
                message={message}
                isCurrentUser={message.senderId === currentUser.id}
                onReply={handleReply}
              />
            ))}
            
            {isTyping && (
              <div className="flex items-center gap-2 animate-fade-in">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={getRoomAvatar()} />
                  <AvatarFallback>{roomName[0]}</AvatarFallback>
                </Avatar>
                <div className="bg-[hsl(var(--message-received))] text-[hsl(var(--message-received-foreground))] rounded-2xl px-4 py-2 border border-border">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            
            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-border bg-card">
          <div className="max-w-4xl mx-auto space-y-2">
            {/* Reply Preview */}
            {replyingTo && (
              <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg animate-fade-in">
                <div className="flex-1 text-sm">
                  <p className="text-muted-foreground">Replying to {getUserById(replyingTo.senderId)?.username}</p>
                  <p className="truncate">{replyingTo.content}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6"
                  onClick={() => setReplyingTo(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* File Preview */}
            {uploadedFile && (
              <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg animate-fade-in">
                {uploadedFile.type === 'image' && uploadedFile.preview && (
                  <img 
                    src={uploadedFile.preview} 
                    alt="Preview" 
                    className="h-16 w-16 object-cover rounded"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <Badge variant="secondary" className="mb-1">
                    {uploadedFile.type === 'image' ? 'Image' : 'File'}
                  </Badge>
                  <p className="text-sm truncate">{uploadedFile.file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6"
                  onClick={() => setUploadedFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Input Row */}
            <div className="flex items-end gap-2">
              <div className="flex gap-2">
                <FileUpload onFileSelect={handleFileSelect} />
                <EmojiPicker onEmojiSelect={handleEmojiSelect} />
              </div>
              
              <div className="flex-1 relative">
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Type a message..."
                  className="pr-12 resize-none bg-background/50 border-border/50"
                />
              </div>

              <Button 
                onClick={handleSend}
                disabled={!messageInput.trim() && !uploadedFile}
                className="h-10 w-10 p-0 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary-glow))] hover:opacity-90 transition-opacity"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Group Info Panel */}
      {showGroupInfo && selectedRoom.type !== 'direct' && (
        <GroupInfoPanel room={selectedRoom} onClose={() => setShowGroupInfo(false)} />
      )}
    </div>
  );
};

export default ChatPanel;
