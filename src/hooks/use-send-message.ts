import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMessage } from "@/api/messageApi";
import { toast } from "@/hooks/use-toast";
import { AxiosErrorWithProblem } from "@/type/error";
import { useState } from "react";
import { SendTextMessageRequest } from "@/type/message";

export const useSendTextMessage = (roomId: string) => {
  const queryClient = useQueryClient();
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const mutation = useMutation({
    mutationFn: (data: SendTextMessageRequest) => sendMessage(roomId, data),

    onSuccess: (data) => {
      console.group("✅ Message Sent Successfully");
      console.info("Message ID:", data.data.messageId);
      console.groupEnd();

      // clear validation errors if any
      setValidationErrors([]);

      // refresh the room messages
      //queryClient.invalidateQueries({ queryKey: ["messages", roomId] });

      toast({
        title: "Message Sent",
        description: "Your message was sent successfully.",
      });
    },

    onError: (error: AxiosErrorWithProblem) => {
      console.group("❌ Message Send Failed");
      console.error("Error Code:", error.code);
      console.error("Error Message:", error.message);
      console.groupEnd();
      setValidationErrors([]);

      if (error?.code === "ERR_NETWORK" || !error.response || error.response.data?.status >= 500) {
        toast({
          title: "Send Failed",
          description: "Unable to send the message. Please try again later.",
          variant: "destructive",
        });
        return;
      }

      if (error.response?.data?.title === "VALIDATION_ERROR") {
        const errors = error.message
          .split(";")
          .map((msg) => msg.trim())
          .filter(Boolean);
        setValidationErrors(errors);
        return;
      }

      toast({
        title: "Send Failed",
        description: error.message || "Unexpected error occurred.",
        variant: "destructive",
      });
    },
  });

  return { mutation, validationErrors };
};
