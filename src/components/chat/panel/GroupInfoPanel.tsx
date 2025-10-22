import { useState } from 'react';
import { X, UserPlus, Crown, UserMinus, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { RoomInfo } from '@/type/room';
import { User } from '@/type/user';

interface GroupInfoPanelProps {
  room: RoomInfo;
  currentUser: User;
  onClose: () => void;
}

const GroupInfoPanel = ({ room, currentUser, onClose }: GroupInfoPanelProps) => {
  console.log('GroupInfoPanel rendered for room:', room, 'and user:', currentUser);
  const { toast } = useToast();

  const participants = room.participants;
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);

  const handleRemoveUser = (userId: string) => {
    setSelectedUserId(userId);
    setShowRemoveDialog(true);
  };

  const confirmRemove = () => {
    console.log('Removing user:', selectedUserId);
    toast({
      title: 'User removed',
      description: 'User has been removed from the group',
    });
    setShowRemoveDialog(false);
    setSelectedUserId(null);
  };

const getTimeRemaining = () => {
  if (room.permanent || !room.expiresAt) return null;
  const expiresAt = new Date(room.expiresAt);
  const now = new Date(room.createdAt);
  const diff = expiresAt.getTime() - now.getTime();
  if (diff <= 0) return "Expired";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours <= 0 && minutes <= 0) return "Less than a minute left";
  if (hours <= 0) return `${minutes}m left`;
  return `${hours}h ${minutes}m left`;
};

  return (
    <div className="w-80 border-l border-border bg-card flex flex-col animate-slide-in-right">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-center">
        <h3 className="font-semibold text-foreground text-xl">Group Info</h3>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Group Details */}
          <div className="text-center space-y-3">
            <Avatar className="h-20 w-20 mx-auto">
              <AvatarImage src={room.roomProfileUrl} />
              <AvatarFallback>{room.roomName?.[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-lg">{room.roomName}</h2>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Badge variant={room.type === 'TEMPORARY' ? 'destructive' : 'secondary'}>
                  {room.type === 'TEMPORARY' ? 'Temporary' : 'Permanent'}
                </Badge>
                <Badge variant="outline">
                  {participants.length} members
                </Badge>
              </div>
            </div>
          </div>

          {/* Temporary Group Expiry */}
          {room.type === 'TEMPORARY' && room.expiresAt && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <div className="flex items-center gap-2 text-destructive">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">Expires in {getTimeRemaining()}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                This group will be automatically deleted after expiry
              </p>
            </div>
          )}

          <Separator />

          {/* Participants */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm text-foreground">Members</h4>
              {room.admins.find((admin) => admin.userId === currentUser.userId) && (
                <Button variant="ghost" size="sm" className="h-8">
                  <UserPlus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              )}
            </div>

            <div className="space-y-2">
              {participants.map((user) => (
                
                <div
                  key={user.userId}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-lg transition-colors",
                    "hover:bg-muted"
                  )}
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatarUrl} />
                      <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className={cn(
                      "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card",
                      user.status === 'ONLINE' ? 'bg-[hsl(var(--online))]' : 'bg-[hsl(var(--offline))]'
                    )} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm truncate">{user.username}</p>
                      {user.userId === currentUser.userId && (
                        <Badge variant="outline" className="text-xs">You</Badge>
                      )}
                      {/* Mock admin badge - first user is admin */}
                      {user.userId === participants[0].userId && (
                        <Crown className="h-3 w-3 text-primary" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground capitalize">{user.status}</p>
                  </div>

                  {room.admins.find((admin) => admin.userId === user.userId) && user.userId !== currentUser.userId && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleRemoveUser(user.userId)}
                    >
                      <UserMinus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Actions */}
      <div className="p-4 border-t border-border space-y-2">
        {room.admins.find((admin) => admin.userId === currentUser.userId) && (
          <Button variant="outline" className="w-full" size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Members
          </Button>
        )}
        <Button variant="destructive" className="w-full" size="sm">
          Leave Group
        </Button>
      </div>

      {/* Remove User Dialog */}
      <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this member from the group? They won't be able to see new messages.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemove} className="bg-destructive text-destructive-foreground">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GroupInfoPanel;
