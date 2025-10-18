import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadProfileImage } from "@/api/userApi";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

export const useUploadProfileImage = (userId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (file: File) => uploadProfileImage(userId, file),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["currentUser"] });
            toast({
                title: "Upload Successful",
                description: "Profile image uploaded successfully",
            });
        },
        onError: (error: unknown) => {
            let message = "Failed to upload profile image";
            if (axios.isAxiosError(error)) {
                message = error.response?.data?.detail || message;
            }
            toast({
                title: "Upload Failed",
                description: message,
                variant: "destructive",
            });
        },
    });
};


