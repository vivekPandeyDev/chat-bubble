import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Volume2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const NotificationsTab = () => {
  const [notifications, setNotifications] = useState(() => {
    const stored = localStorage.getItem("notifications");
    return stored
      ? JSON.parse(stored)
      : {
        messages: true,
        mentions: true,
        groupInvites: true,
        sounds: true,
        desktop: true,
      };
  });

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);
  
  const handleDesktopToggle = (checked: boolean) => {
    if (checked && "Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          setNotifications({ ...notifications, desktop: true });
          toast({ title: "Desktop notifications enabled", description: "You'll receive browser notifications" });
        }
      });
    } else {
      setNotifications({ ...notifications, desktop: false });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Choose what notifications you want to receive</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {[
          { key: "messages", label: "New Messages", desc: "Get notified when you receive new messages" },
          { key: "mentions", label: "Mentions", desc: "Get notified when someone mentions you" },
          { key: "groupInvites", label: "Group Invites", desc: "Get notified when you're added to a group" },
        ].map((item) => (
          <div key={item.key}>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{item.label}</Label>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
              <Switch
                checked={notifications[item.key as keyof typeof notifications]}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, [item.key]: checked })
                }
              />
            </div>
            <Separator />
          </div>
        ))}

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Desktop Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Show browser notifications even when app is in background
            </p>
          </div>
          <Switch
            checked={notifications.desktop}
            onCheckedChange={handleDesktopToggle}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Sound Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Play a sound when you receive notifications
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <Switch
              checked={notifications.sounds}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, sounds: checked })
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsTab;
