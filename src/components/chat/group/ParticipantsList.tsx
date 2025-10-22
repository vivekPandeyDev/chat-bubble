import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";

const ParticipantsList = ({
  availableUsers,
  selectedUsers,
  handleUserToggle,
  isLoading,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: any) => (
  <div className="space-y-2">
    <Label>Select Participants</Label>
    <ScrollArea className="h-64 rounded-md border border-border p-2 space-y-1">
      {isLoading && <p className="text-sm text-muted-foreground p-2">Loading users...</p>}

      {!isLoading && availableUsers.length === 0 && (
        <p className="text-sm text-muted-foreground p-2">
          Start typing to search for users.
        </p>
      )}

      {availableUsers.map((user: any) => (
        <div
          key={user.userId}
          className="flex items-center space-x-3 py-2 px-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
          onClick={() => handleUserToggle(user.userId)}
        >
          <Checkbox
            checked={selectedUsers.includes(user.userId)}
            onCheckedChange={() => handleUserToggle(user.userId)}
          />
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatarUrl} />
            <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium text-sm">{user.username}</p>
            <div className="flex items-center gap-1">
              <div
                className={`h-2 w-2 rounded-full ${
                  user.status === "ONLINE"
                    ? "bg-[hsl(var(--online))]"
                    : "bg-[hsl(var(--offline))]"
                }`}
              />
              <span className="text-xs text-muted-foreground capitalize">
                {user.status}
              </span>
            </div>
          </div>
        </div>
      ))}

      {hasNextPage && (
        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </ScrollArea>
  </div>
);

export default ParticipantsList;
