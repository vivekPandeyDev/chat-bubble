// queryClient.ts
import { QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "An error occurred while fetching data.",
        variant: "destructive",
      });
    }
  })
  ,
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
