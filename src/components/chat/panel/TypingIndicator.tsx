// components/chat/TypingIndicator.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TypingIndicatorProps {
  avatarUrl?: string;
  username?: string;
}

const TypingIndicator = ({ avatarUrl, username }: TypingIndicatorProps) => {
  return (
    <div className="flex items-center gap-2 px-6 py-2 animate-fade-in">
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback>{username?.[0] ?? "?"}</AvatarFallback>
      </Avatar>
      <div className="bg-[hsl(var(--message-received))] text-[hsl(var(--message-received-foreground))] rounded-2xl px-4 py-2 border border-border">
        <div className="flex gap-1">
          <div
            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
