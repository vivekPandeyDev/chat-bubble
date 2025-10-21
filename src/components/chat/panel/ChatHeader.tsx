//Contains avatar, name, online status, and actions.
import { Info, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
interface ChatHeaderProps {
  avatar: string | null;
  roomName: string;
  status: string;
  onToggleGroupInfo: () => void;
}

const ChatHeader = ({ avatar, roomName, status, onToggleGroupInfo }: ChatHeaderProps) => {


  return (
    <div className="h-16 border-b border-border px-6 flex items-center justify-between bg-card">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={avatar} />
          <AvatarFallback>{roomName}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold text-foreground">{roomName}</h2>
          <p className="text-xs text-muted-foreground">
            {status}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onToggleGroupInfo}>
          <Info className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;