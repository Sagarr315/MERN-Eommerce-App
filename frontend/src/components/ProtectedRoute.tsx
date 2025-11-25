import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactElement;
  type?: "auth" | "guest"; // "auth" = protected pages, "guest" = login/register only
}

const ProtectedRoute = ({ children, type = "auth" }: ProtectedRouteProps) => {
  const auth = useContext(AuthContext);
  const location = useLocation();

  // Missing context (should never happen)
  if (!auth) return null;

  const { token, loading } = auth;

  //  Prevent shaking / flicker: wait until auth loads
  if (loading) {
    return <div className="spinner-border text-primary" />;
  }

  //  Guest routes (Login/Register)
  if (type === "guest" && token) {
    return <Navigate to="/" replace />;
  }

  //  Protected routes (Admin/User pages)
  if (type === "auth" && !token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
