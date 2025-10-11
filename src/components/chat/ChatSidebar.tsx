import { Search, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockChatRooms, getCurrentUser, getDirectChatName, getUserById } from '@/data/mockData';
import { ChatRoom } from '@/data/mockData';
import { cn } from '@/lib/utils';
import CreateGroupDialog from './CreateGroupDialog';

interface ChatSidebarProps {
  selectedRoom: ChatRoom | null;
  onSelectRoom: (room: ChatRoom) => void;
}

const ChatSidebar = ({ selectedRoom, onSelectRoom }: ChatSidebarProps) => {
  const currentUser = getCurrentUser();

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getRoomAvatar = (room: ChatRoom) => {
    if (room.avatar) return room.avatar;
    if (room.type === 'direct') {
      const otherUserId = room.participants.find(id => id !== currentUser.id);
      return getUserById(otherUserId || '')?.avatar;
    }
    return undefined;
  };

  const getRoomName = (room: ChatRoom) => {
    return getDirectChatName(room, currentUser.id);
  };

  return (
    <div className="w-80 border-r border-border bg-[hsl(var(--sidebar-bg))] flex flex-col h-screen flex-shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-primary/20">
              <AvatarImage src={currentUser.avatar} />
              <AvatarFallback>{currentUser.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-foreground">{currentUser.username}</h2>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-[hsl(var(--online))] shadow-[0_0_8px_hsl(var(--online))]" />
                <span className="text-xs text-muted-foreground">Online</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search chats..." 
            className="pl-9 bg-background/50 border-border/50"
          />
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {mockChatRooms.map((room) => {
            const isActive = selectedRoom?.id === room.id;
            return (
              <button
                key={room.id}
                onClick={() => onSelectRoom(room)}
                className={cn(
                  "w-full p-3 rounded-lg mb-1 transition-all duration-200",
                  "hover:bg-[hsl(var(--sidebar-hover))] text-left",
                  isActive && "bg-[hsl(var(--sidebar-active))] text-[hsl(var(--sidebar-active-foreground))]"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={getRoomAvatar(room)} />
                      <AvatarFallback>{getRoomName(room)[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    {room.type === 'direct' && (
                      <div className={cn(
                        "absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[hsl(var(--sidebar-bg))]",
                        getUserById(room.participants.find(id => id !== currentUser.id) || '')?.status === 'online' 
                          ? "bg-[hsl(var(--online))]" 
                          : "bg-[hsl(var(--offline))]"
                      )} />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "font-medium truncate",
                          isActive ? "text-[hsl(var(--sidebar-active-foreground))]" : "text-foreground"
                        )}>
                          {getRoomName(room)}
                        </span>
                        {room.type === 'temporary' && (
                          <Badge variant="outline" className="text-xs py-0 px-1.5">Temp</Badge>
                        )}
                      </div>
                      {room.lastMessage && (
                        <span className={cn(
                          "text-xs",
                          isActive ? "text-[hsl(var(--sidebar-active-foreground))]/70" : "text-muted-foreground"
                        )}>
                          {formatTimestamp(room.lastMessage.timestamp)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className={cn(
                        "text-sm truncate",
                        isActive ? "text-[hsl(var(--sidebar-active-foreground))]/80" : "text-muted-foreground"
                      )}>
                        {room.lastMessage?.content || 'No messages yet'}
                      </p>
                      {room.unreadCount > 0 && (
                        <Badge 
                          className="ml-2 bg-accent text-accent-foreground font-medium px-2 py-0.5 min-w-[20px] justify-center"
                        >
                          {room.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>

      {/* New Group Button */}
      <div className="p-4 border-t border-border">
        <CreateGroupDialog />
      </div>
    </div>
  );
};

export default ChatSidebar;
