import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { mockUsers, getCurrentUser } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

const CreateGroupDialog = () => {
  const { toast } = useToast();
  const currentUser = getCurrentUser();
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [isTemporary, setIsTemporary] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const availableUsers = mockUsers.filter(u => u.id !== currentUser.id);

  const handleUserToggle = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      toast({
        title: 'Group name required',
        description: 'Please enter a name for your group',
        variant: 'destructive',
      });
      return;
    }

    if (selectedUsers.length === 0) {
      toast({
        title: 'No participants selected',
        description: 'Please select at least one participant',
        variant: 'destructive',
      });
      return;
    }

    // Mock group creation
    console.log('Creating group:', {
      name: groupName,
      isTemporary,
      participants: [...selectedUsers, currentUser.id],
    });

    toast({
      title: 'Group created!',
      description: `${groupName} has been created successfully`,
    });

    setOpen(false);
    setGroupName('');
    setIsTemporary(false);
    setSelectedUsers([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary-glow))] hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4 mr-2" />
          New Group
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Group Chat</DialogTitle>
          <DialogDescription>
            Create a new group to start chatting with multiple people
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Group Name */}
          <div className="space-y-2">
            <Label htmlFor="group-name">Group Name</Label>
            <Input
              id="group-name"
              placeholder="Enter group name..."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>

          {/* Temporary Group Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Temporary Group</Label>
              <p className="text-xs text-muted-foreground">
                Expires in 24 hours
              </p>
            </div>
            <Switch checked={isTemporary} onCheckedChange={setIsTemporary} />
          </div>

          {/* Participants Selection */}
          <div className="space-y-2">
            <Label>Select Participants</Label>
            <ScrollArea className="h-64 rounded-md border border-border p-2">
              {availableUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center space-x-3 py-2 px-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                  onClick={() => handleUserToggle(user.id)}
                >
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={() => handleUserToggle(user.id)}
                  />
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{user.username}</p>
                    <div className="flex items-center gap-1">
                      <div className={`h-2 w-2 rounded-full ${
                        user.status === 'online' ? 'bg-[hsl(var(--online))]' : 'bg-[hsl(var(--offline))]'
                      }`} />
                      <span className="text-xs text-muted-foreground capitalize">{user.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>

          {/* Selected Count */}
          {selectedUsers.length > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {selectedUsers.length} participant{selectedUsers.length > 1 ? 's' : ''} selected
              </Badge>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={handleCreateGroup}>
            Create Group
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupDialog;
