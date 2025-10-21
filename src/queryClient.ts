// queryClient.ts
import { QueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.message || "Operation failed.",
          variant: "destructive",
        });
      }
    },
  },
});
