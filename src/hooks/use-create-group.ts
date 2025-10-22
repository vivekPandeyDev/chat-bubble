// src/hooks/use-create-group.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGroup, CreateGroupRequest } from "@/api/groupApi";
import { toast } from "@/hooks/use-toast";
import { AxiosErrorWithProblem } from "@/type/error";
import { useState } from "react";

export const useCreateGroup = () => {
  const queryClient = useQueryClient();
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const mutation = useMutation({
    mutationFn: (data: CreateGroupRequest) => createGroup(data),

    onSuccess: (data) => {
      console.group("✅ Group Creation Success");
      console.info("Group created successfully.");
      console.info("Group Name:", data.success);
      console.info("Room ID:", data.data);
      console.groupEnd();

      // Clear any previous validation errors
      setValidationErrors([]);

      // Optional: Invalidate group-related queries if any
      queryClient.invalidateQueries({ queryKey: ["rooms"] });

      toast({
        title: "Group Created",
        description: `${data.data} has been created successfully.`,
      });
    },

    onError: (error: AxiosErrorWithProblem) => {
      setValidationErrors([]);

      if (error?.code === "ERR_NETWORK" || !error.response || error.response.data?.status >= 500) {
        toast({
          title: "Group Creation Failed",
          description: "Something went wrong. Please try again later.",
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
        title: "Group Creation Failed",
        description: error.message || "Unexpected error occurred.",
        variant: "destructive",
      });
    },
  });

  return { mutation, validationErrors };
};
