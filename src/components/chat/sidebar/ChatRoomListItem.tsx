import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { ChatRoomProjection } from '@/type/room';

interface ChatRoomListItemProps {
  room: ChatRoomProjection;
  isActive: boolean;
  onSelect: () => void;
}

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

const ChatRoomListItem = ({ room, isActive, onSelect }: ChatRoomListItemProps) => {
  const avatar = room.roomProfileUrl;
  const name = room.roomName;
  const unreadCount = room.unreadCount || 1;
  return (
    <button
      onClick={onSelect}
      className={cn(
        'w-full p-3 rounded-lg mb-1 transition-all duration-200 text-left',
        'hover:bg-[hsl(var(--sidebar-hover))]',
        isActive && 'bg-[hsl(var(--sidebar-active))] text-[hsl(var(--sidebar-active-foreground))]'
      )}
    >
      <div className="flex items-start gap-3">
        <div className="relative">
          <Avatar className="h-12 w-12">
            <AvatarImage src={avatar} />
            <AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'font-medium truncate',
                  isActive
                    ? 'text-[hsl(var(--sidebar-active-foreground))]'
                    : 'text-foreground'
                )}
              >
                {name}
              </span>
              {room.roomType === 'TEMPORARY' && (
                <Badge variant="outline" className="text-xs py-0 px-1.5">
                  Temp
                </Badge>
              )}
            </div>
            {room.lastTextMessage && (
              <span
                className={cn(
                  'text-xs',
                  isActive
                    ? 'text-[hsl(var(--sidebar-active-foreground))]/70'
                    : 'text-muted-foreground'
                )}
              >
                {/* TODO : update backend to fetch last message time stamp */}
                {formatTimestamp(new Date("2025-10-21T09:15:00Z"))}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <p
              className={cn(
                'text-sm truncate',
                isActive
                  ? 'text-[hsl(var(--sidebar-active-foreground))]/80'
                  : 'text-muted-foreground'
              )}
            >
              {room.lastTextMessage || 'No messages yet'}
            </p>
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-accent text-accent-foreground font-medium px-2 py-0.5 min-w-[20px] justify-center">
                {unreadCount}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </button>
  );
};

export default ChatRoomListItem;
