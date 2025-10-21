import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SignupRequest } from "@/type/user";
import { signupUser } from "@/api/userApi";
import { toast } from "./use-toast";
import { AxiosErrorWithProblem } from "@/type/error";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";

export const useSignup = () => {
    const queryClient = useQueryClient();
    const { logout } = useContext(AuthContext);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const mutation =  useMutation({
        mutationFn: (data: SignupRequest) => signupUser(data),
        onSuccess: (data) => {
            console.group("Signup Success");
            console.info("User created successfully.");
            console.info("User ID:", data.userId);
            console.info("Username:", data.username);
            console.info("Email:", data.email);
            console.info("Status:", data.status);
            console.groupEnd();
            console.info("Invalidating currentUser query cache and logging out user.");
            // Clear any previous validation errors
            setValidationErrors([]);
            queryClient.invalidateQueries({ queryKey: ["currentUser"] });
            logout();
        },
        onError: (error: AxiosErrorWithProblem) => {
            // Reset previous validation errors
            setValidationErrors([]);
            if (error?.code === "ERR_NETWORK" || !error.response || error.response.data?.status >= 500) {
                toast({
                    title: "Signup Failed",
                    description: "Something went wrong. Please try again.",
                    variant: "destructive",
                });
                return;
            }
            // Handle validation errors
            if (error.response?.data?.title === "VALIDATION_ERROR") {
                const errors = error.message
                    .split(";")
                    .map((msg) => msg.trim())
                    .filter(Boolean);

                setValidationErrors(errors);
                return;
            }
            // Handle other API errors
            toast({
                title: "Signup Failed",
                description: error.message || "Something went wrong. Please try again.",
                variant: "destructive",
            });
        },
    });

    return {mutation, validationErrors};
};
