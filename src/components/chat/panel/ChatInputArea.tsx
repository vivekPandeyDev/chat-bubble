//Contains emoji picker, file upload, reply preview, and send button.
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import EmojiPicker from './EmojiPicker';
import FileUpload from './FileUpload';
import { useToast } from '@/hooks/use-toast';
import { useSendTextMessage } from '@/hooks/use-send-message';

interface ChatInputAreaProps {
  senderId: string;
  selectedRoomId: string;
  onMessageSent: () => void;
  onTypingChange?: (isTyping: boolean) => void;
}

const ChatInputArea = ({ senderId, selectedRoomId, onMessageSent, onTypingChange }: ChatInputAreaProps) => {
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const { mutation } = useSendTextMessage(selectedRoomId);

  const handleSend = () => {
    if (!message.trim()) return;
    toast({ title: 'Message sent', description: message });
    mutation.mutate({ content: message, messageType: 'TEXT', senderId: senderId }, {
      onSuccess: () => {
        setMessage('');
        onMessageSent();
      }
    }
    );

  };
  const handleTyping = (value: string) => {
    setMessage(value);

    if (onTypingChange) {
      onTypingChange(true);

      // clear previous timeout
      if (typingTimeout.current) clearTimeout(typingTimeout.current);

      // stop typing after 1.5s of inactivity
      typingTimeout.current = setTimeout(() => {
        onTypingChange(false);
      }, 3500);
    }
  };

  return (
    <div className="p-4 border-t border-border bg-card">
      <div className="max-w-4xl mx-auto flex items-end gap-2">
        <FileUpload onFileSelect={() => { }} />
        <EmojiPicker onEmojiSelect={emoji => handleTyping(message + emoji)} />
        <Input
          value={message}
          onChange={e => handleTyping(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type a message..."
          className="flex-1 bg-background/50 border-border/50"
        />
        <Button
          onClick={handleSend}
          disabled={!message.trim()}
          className="h-10 w-10 p-0 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary-glow))]"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInputArea;
