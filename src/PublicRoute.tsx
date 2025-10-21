import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";

export default function PublicRoute({ children }: { children: JSX.Element }) {
  const { isLoggedIn } = useContext(AuthContext);
  
  if (isLoggedIn){ 
    console.info("User is already logged in. Redirecting to /chat.");
    return <Navigate to="/chat" replace />;
  }
  return children;
}
