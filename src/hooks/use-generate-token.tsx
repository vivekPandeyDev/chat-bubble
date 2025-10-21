
import { useMutation } from "@tanstack/react-query";
import { generateToken } from "@/api/userApi";
import type { TokenSuccessResponse } from "@/type/token";
import { AxiosErrorWithProblem } from "@/type/error";
import { toast } from "@/hooks/use-toast";
interface TokenRequest {
  email: string;
  password: string;
}

// returns a mutation hook for generating tokens
export const useGenerateToken = () =>
  useMutation<TokenSuccessResponse, AxiosErrorWithProblem, TokenRequest>({
    mutationFn: generateToken,
    onError: (error) => {
      let variant : 'default' | 'destructive' = 'default';
      if (error?.code === 'ERR_NETWORK' || !error.response ||   error.response.data?.status >= 500) {
        variant = 'destructive';
      }
      toast({
        title: "Login Failed",
        description: error.message || "Unable to login. Please check your credentials and try again.",
        variant,
      });
    },
  });
