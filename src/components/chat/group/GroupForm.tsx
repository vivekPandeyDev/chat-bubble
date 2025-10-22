import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const GroupForm = ({
  groupName,
  setGroupName,
  isTemporary,
  setIsTemporary,
  search,
  setSearch,
}: any) => (
  <>
    <div className="space-y-2">
      <Label htmlFor="group-name">Group Name</Label>
      <Input
        id="group-name"
        placeholder="Enter group name..."
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />
    </div>

    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <Label>Temporary Group</Label>
        <p className="text-xs text-muted-foreground">Expires in 24 hours</p>
      </div>
      <Switch checked={isTemporary} onCheckedChange={setIsTemporary} />
    </div>

    <div className="space-y-2">
      <Label htmlFor="user-search">Add Participants</Label>
      <Input
        id="user-search"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  </>
);

export default GroupForm;
