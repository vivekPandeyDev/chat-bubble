import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { User, Settings as SettingsIcon, Bell } from "lucide-react";
import { useTheme } from "next-themes";
import { AuthContext } from "@/context/AuthContext";
import { useCurrentUser } from "@/hooks/use-current-user";
import ProfileTab from "@/components/settting/ProfileTab";
import AppearanceTab from "@/components/settting/AppearanceTab";
import NotificationsTab from "@/components/settting/NotificationsTab";

const Settings = () => {
  const { data: currentUser, isLoading } = useCurrentUser();
  const { logout } = useContext(AuthContext)!;
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  console.log("Current User in Settings:", currentUser);
  if (isLoading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container max-w-4xl mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/chat")}>
            Back to Chat
          </Button>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <SettingsIcon className="h-4 w-4 mr-2" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileTab currentUser={currentUser} logout={logout} />
          </TabsContent>

          <TabsContent value="appearance">
            <AppearanceTab theme={theme} setTheme={setTheme} />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
