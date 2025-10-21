import type { MouseEvent } from 'react';
import { Settings, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { UserResponse } from '@/type/user';

interface ChatSidebarHeaderProps {
  currentUser: UserResponse;
}

const ChatSidebarHeader = ({ currentUser }: ChatSidebarHeaderProps) => {
  const navigate = useNavigate();

  function navigateToSettings(event: MouseEvent<HTMLButtonElement>) {
    navigate('/settings');
  }

  return (
    <div className="p-4 border-b border-border">
      {/* Profile + settings */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-primary/20">
            <AvatarImage src={currentUser.avatarUrl} />
            <AvatarFallback>{currentUser.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-foreground">{currentUser.username}</h2>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-[hsl(var(--online))] shadow-[0_0_8px_hsl(var(--online))]" />
              <span className="text-xs text-muted-foreground">{currentUser.status}</span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={navigateToSettings}>
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search chats..." className="pl-9 bg-background/50 border-border/50" />
      </div>
    </div>
  );
};

export default ChatSidebarHeader;
