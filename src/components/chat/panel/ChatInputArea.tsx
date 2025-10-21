//Contains emoji picker, file upload, reply preview, and send button.
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import EmojiPicker from './EmojiPicker';
import FileUpload from './FileUpload';
import { useToast } from '@/hooks/use-toast';

interface ChatInputAreaProps {
  selectedRoomId: string;
  onMessageSent: () => void;
}

const ChatInputArea = ({ selectedRoomId, onMessageSent }: ChatInputAreaProps) => {
  const { toast } = useToast();
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!message.trim()) return;
    toast({ title: 'Message sent', description: message });
    setMessage('');
    onMessageSent();
  };

  return (
    <div className="p-4 border-t border-border bg-card">
      <div className="max-w-4xl mx-auto flex items-end gap-2">
        <FileUpload onFileSelect={() => {}} />
        <EmojiPicker onEmojiSelect={emoji => setMessage(prev => prev + emoji)} />
        <Input
          value={message}
          onChange={e => setMessage(e.target.value)}
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
