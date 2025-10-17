
import { useMutation } from "@tanstack/react-query";
import { generateToken } from "@/api/tokenApi";
import type { TokenSuccessResponse, TokenErrorResponse } from "@/type/token";

interface TokenRequest {
  email: string;
  password: string;
}

export const useGenerateToken = () =>
  useMutation<TokenSuccessResponse, TokenErrorResponse, TokenRequest>({
    mutationFn: generateToken,
    onSuccess: (data) => {
      console.log("Token generated for username:", data.data.username);
    },
    onError: (error) => {
      console.error("Error generating token:", error);
    },
  });
