import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useAvailableUsers } from "@/hooks/use-available-users";
import GroupForm from "./GroupForm";
import ParticipantsList from "./ParticipantsList";
import SelectedParticipantsBadge from "./SelectedParticipantsBadge";
import { useCreateGroup } from "@/hooks/use-create-group";
import { CreateGroupRequest } from "@/api/groupApi";
import { on } from "events";

const CreateGroupDialog = () => {
    const { toast } = useToast();
    const { data: currentUser } = useCurrentUser();

    const [open, setOpen] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [isTemporary, setIsTemporary] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useAvailableUsers(search);

    const { mutation, validationErrors } = useCreateGroup();
    const availableUsers = data?.pages.flatMap((page) => page.content) ?? [];
    //console.log("Available users:", availableUsers);

    const handleUserToggle = (userId: string) => {
        setSelectedUsers((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    const handleCreateGroup = () => {
        if (!groupName.trim()) {
            toast({
                title: "Group name required",
                description: "Please enter a name for your group",
                variant: "destructive",
            });
            return;
        }

        if (selectedUsers.length === 0) {
            toast({
                title: "No participants selected",
                description: "Please select at least one participant",
                variant: "destructive",
            });
            return;
        }

        const requestData: CreateGroupRequest = {
            createdById: currentUser!.userId,
            groupName: groupName.trim(),
            isPermanent: !isTemporary,
            initialParticipantIds: selectedUsers,
        };

        mutation.mutate(requestData, {
            onSuccess: () => {
                toast({
                    title: "Group created!",
                    description: `${groupName} has been created successfully`,
                });
                setOpen(false);
                setGroupName("");
                setIsTemporary(false);
                setSelectedUsers([]);
            },
            onError: (error) => {       
                console.error("Group creation error:", error);
            }
        });
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
                <GroupForm
                    groupName={groupName}
                    setGroupName={setGroupName}
                    isTemporary={isTemporary}
                    setIsTemporary={setIsTemporary}
                    search={search}
                    setSearch={setSearch}
                />

                <ParticipantsList
                    availableUsers={availableUsers}
                    selectedUsers={selectedUsers}
                    handleUserToggle={handleUserToggle}
                    isLoading={isLoading}
                    fetchNextPage={fetchNextPage}
                    hasNextPage={hasNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                />

                <SelectedParticipantsBadge selectedUsers={selectedUsers} />
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
