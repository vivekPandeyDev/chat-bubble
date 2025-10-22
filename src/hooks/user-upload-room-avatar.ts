import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { uploadRoomAvatar } from "@/api/roomApi";
import axios from "axios";

export const useUploadRoomAvatar = (roomId: string,userId : string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadRoomAvatar(roomId, file),

    onSuccess: (_) => {
      // Invalidate the room info cache
      queryClient.invalidateQueries({ queryKey: ["roomInfo", roomId] });
      queryClient.invalidateQueries({ queryKey: ["rooms","user", userId] });
      
      toast({
        title: "Avatar Updated",
        description: "Group avatar has been updated successfully.",
      });
    },

    onError: (error: unknown) => {
      let message = "Failed to upload room avatar";
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
