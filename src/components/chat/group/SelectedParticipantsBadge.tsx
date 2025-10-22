import { Badge } from "@/components/ui/badge";

const SelectedParticipantsBadge = ({ selectedUsers }: any) => {
  if (selectedUsers.length === 0) return null;
  return (
    <div className="flex items-center gap-2">
      <Badge variant="secondary">
        {selectedUsers.length} participant
        {selectedUsers.length > 1 ? "s" : ""} selected
      </Badge>
    </div>
  );
};

export default SelectedParticipantsBadge;
