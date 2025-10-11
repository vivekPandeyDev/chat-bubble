import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings as SettingsIcon, Bell, LogOut, Moon, Sun, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { getCurrentUser } from '@/data/mockData';
import { useTheme } from 'next-themes';

const Settings = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const currentUser = getCurrentUser();
  
  const [profile, setProfile] = useState({
    username: currentUser.username,
    email: currentUser.email,
    status: currentUser.status,
  });

  const [notifications, setNotifications] = useState({
    messages: true,
    mentions: true,
    groupInvites: true,
    sounds: true,
    desktop: true,
  });

  const handleLogout = () => {
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out',
    });
    navigate('/login');
  };

  const handleProfileUpdate = () => {
    toast({
      title: 'Profile updated',
      description: 'Your profile has been successfully updated',
    });
  };

  const handleAvatarChange = () => {
    toast({
      description: 'Avatar upload feature coming soon',
    });
  };

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
          <Button variant="outline" onClick={() => navigate('/chat')}>
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
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Update your profile information and avatar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={currentUser.avatar} />
                    <AvatarFallback className="text-2xl">
                      {profile.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" onClick={handleAvatarChange}>
                    Change Avatar
                  </Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={profile.username}
                      onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={profile.status === 'online' ? 'default' : 'outline'}
                        onClick={() => setProfile({ ...profile, status: 'online' })}
                        className="flex-1"
                      >
                        Online
                      </Button>
                      <Button
                        variant={profile.status === 'offline' ? 'default' : 'outline'}
                        onClick={() => setProfile({ ...profile, status: 'offline' })}
                        className="flex-1"
                      >
                        Offline
                      </Button>
                    </div>
                  </div>
                </div>

                <Button onClick={handleProfileUpdate} className="w-full">
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>Irreversible actions</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  className="w-full"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize how the app looks and feels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Theme</Label>
                    <p className="text-sm text-muted-foreground">
                      Choose between light and dark mode
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={theme === 'light' ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => setTheme('light')}
                    >
                      <Sun className="h-5 w-5" />
                    </Button>
                    <Button
                      variant={theme === 'dark' ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => setTheme('dark')}
                    >
                      <Moon className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sound Effects</Label>
                    <p className="text-sm text-muted-foreground">
                      Play sounds for notifications and messages
                    </p>
                  </div>
                  <Switch
                    checked={notifications.sounds}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, sounds: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose what notifications you want to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New Messages</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when you receive new messages
                    </p>
                  </div>
                  <Switch
                    checked={notifications.messages}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, messages: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Mentions</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when someone mentions you
                    </p>
                  </div>
                  <Switch
                    checked={notifications.mentions}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, mentions: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Group Invites</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when you're added to a group
                    </p>
                  </div>
                  <Switch
                    checked={notifications.groupInvites}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, groupInvites: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Desktop Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Show browser notifications even when app is in background
                    </p>
                  </div>
                  <Switch
                    checked={notifications.desktop}
                    onCheckedChange={(checked) => {
                      if (checked && 'Notification' in window) {
                        Notification.requestPermission().then((permission) => {
                          if (permission === 'granted') {
                            setNotifications({ ...notifications, desktop: true });
                            toast({
                              title: 'Desktop notifications enabled',
                              description: "You'll receive browser notifications",
                            });
                          }
                        });
                      } else {
                        setNotifications({ ...notifications, desktop: false });
                      }
                    }}
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
