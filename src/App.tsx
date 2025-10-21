import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, Routes, Route, createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Chat from "@/pages/Chat";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import { queryClient } from "@/queryClient";
import Error from "./pages/Error";

const router = createBrowserRouter(
  [
    { path: "/", element: <Index /> },
    { path: "/login", element: <PublicRoute><Login /></PublicRoute> },
    { path: "/signup", element: <PublicRoute><Signup /></PublicRoute> },
    { path: "/chat", element: <ProtectedRoute><Chat /></ProtectedRoute> },
    { path: "/settings", element: <ProtectedRoute><Settings /></ProtectedRoute> },
    {path : "/error", element: <Error />},
    { path: "*", element: <NotFound /> },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  }
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
