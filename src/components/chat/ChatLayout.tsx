import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';
import ChatSidebar from './ChatSidebar';
import ChatPanel from './ChatPanel';
import { NotificationPanel } from './NotificationPanel';
import { Button } from '@/components/ui/button';
import { ChatRoom, getUnreadNotifications } from '@/data/mockData';

const ChatLayout = () => {
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Simulate desktop notification for demo
  useEffect(() => {
    const unreadNotifications = getUnreadNotifications('user-1');
    if (unreadNotifications.length > 0 && 'Notification' in window && Notification.permission === 'granted') {
      const latestNotif = unreadNotifications[0];
      // Only show for demo purposes - in real app, this would be triggered by WebSocket
      const showNotification = () => {
        new Notification(latestNotif.title, {
          body: latestNotif.content,
          icon: '/favicon.ico',
          tag: latestNotif.id,
        });
      };
      // Uncomment to test: showNotification();
    }
  }, []);

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      <div className="flex h-full">
        <ChatSidebar 
          selectedRoom={selectedRoom} 
          onSelectRoom={setSelectedRoom}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-16 border-b bg-background/50 backdrop-blur-sm flex items-center justify-between px-4 flex-shrink-0">
          <div className="text-lg font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Chat
          </div>
          <div className="flex items-center gap-2">
            <NotificationPanel />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/settings')}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <ChatPanel selectedRoom={selectedRoom} />
      </div>
      </div>
    </div>
  );
};

export default ChatLayout;
