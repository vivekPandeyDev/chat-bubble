import { useState, useEffect, memo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { UserResponse } from "@/type/user";
import { useUploadProfileImage } from "@/hooks/user-profile-upload";

interface ProfileTabProps {
    currentUser: UserResponse;
    logout: () => void;
}

const ProfileTab = ({ currentUser, logout }: ProfileTabProps) => {
    console.log("Current User in ProfileTab:", currentUser);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const mutation = useUploadProfileImage(currentUser.userId);
    const [profile, setProfile] = useState({
        username: currentUser.username,
        email: currentUser.email,
        status: currentUser.status.toLowerCase(),
    });

    const handleLogout = () => {
        toast({ title: "Logged out", description: "You have been successfully logged out" });
        logout();
        navigate("/login");
    };

    const handleProfileUpdate = () => {

        toast({ title: "Profile updated", description: "Your profile has been successfully updated" });


    };

    const handleAvatarChange = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        fileInputRef.current?.click();
    };

    const uploadAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            mutation.mutate(e.target.files[0]);
            toast({ description: "Your profile Avatar has been successfully updated" });
        }
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>Update your profile information and avatar</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={currentUser.avatarUrl} />
                            <AvatarFallback className="text-2xl">
                                {profile.username.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <input
                            type="file"
                            accept="image/*"
                            id="avatarUpload"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={uploadAvatar}
                        />
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
                                    variant={profile.status === "online" ? "default" : "outline"}
                                    onClick={() => setProfile({ ...profile, status: "online" })}
                                    className="flex-1"
                                >
                                    Online
                                </Button>
                                <Button
                                    variant={profile.status === "offline" ? "default" : "outline"}
                                    onClick={() => setProfile({ ...profile, status: "offline" })}
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
                    <Button variant="destructive" onClick={handleLogout} className="w-full">
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                    </Button>
                </CardContent>
            </Card>
        </>
    );
};

export default memo(ProfileTab);
