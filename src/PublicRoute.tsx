import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";

export default function PublicRoute({ children }: { children: JSX.Element }) {
  const { isLoggedIn,username } = useContext(AuthContext);
  if (isLoggedIn) return <Navigate to="/chat" replace />;
  return children;
}
