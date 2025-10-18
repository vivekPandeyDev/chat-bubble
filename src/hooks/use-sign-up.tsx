// src/hooks/useSignup.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SignupRequest } from "@/type/user";
import { signupUser } from "@/api/userApi";
import { useNavigate } from "react-router-dom";
import { toast } from "./use-toast";

export const useSignup = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: SignupRequest) => signupUser(data),
        onSuccess: (data) => {
            console.log("✅ Signup successful:", data);
            queryClient.invalidateQueries({ queryKey: ["currentUser"] });
            navigate("/login");
        },
        onError: (error: any) => {
            let message = "Something went wrong. Please try again.";

            if (error.response) {
                console.error("❌ Signup failed:", error.response.data);
                const detail = error.response.data.detail || error.response.data.message || "Signup failed.";
                const messages = detail.split(";").map((m: string) => m.trim());
                console.log("Parsed error messages:", messages);
                // Show each message as a toast
                messages.forEach((message: string) => {
                    toast({
                        title: "Signup Failed",
                        description: message,
                        variant: "destructive",
                    });
                });
            } else {
                console.error("❌ Network error:", error);
                message = "Network error — please check your connection.";
                toast({
                    title: "Network Error",
                    description: message,
                    variant: "destructive",
                });
            }
            navigate("/signup");
        },
    });
};
