import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isLoggedIn } = useContext(AuthContext);
  console.log("ProtectedRoute - isLoggedIn:", isLoggedIn);
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;
}
