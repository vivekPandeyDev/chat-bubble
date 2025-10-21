import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isLoggedIn, username } = useContext(AuthContext);
  console.info("ProtectedRoute - isLoggedIn:", isLoggedIn, "username:", username);
  if (!isLoggedIn){ 
    console.warn("Access denied. User is not logged in.");
    return <Navigate to="/login" replace />;
  }
  return children;
}
