import { useState } from 'react';
import { Bell, Check, MessageSquare, AtSign, Users, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { mockNotifications, type Notification } from '@/data/mockData';
import { formatDistanceToNow } from 'date-fns';
import { toast } from '@/hooks/use-toast';

export const NotificationPanel = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
    toast({
      description: 'Marked as read',
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast({
      description: 'All notifications marked as read',
    });
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="h-4 w-4" />;
      case 'mention':
        return <AtSign className="h-4 w-4" />;
      case 'group_invite':
        return <Users className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="h-8 text-xs"
              >
                <Check className="h-4 w-4 mr-1" />
                Mark all read
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-100px)] mt-4">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <Bell className="h-12 w-12 mb-4 opacity-50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification, index) => (
                <div key={notification.id}>
                  <div
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      notification.read
                        ? 'bg-muted/30'
                        : 'bg-accent/50 hover:bg-accent/70'
                    }`}
                    onClick={() => !notification.read && markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1 text-primary">{getIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-semibold">{notification.title}</p>
                          {!notification.read && (
                            <div className="h-2 w-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{notification.content}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </div>
                  {index < notifications.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
