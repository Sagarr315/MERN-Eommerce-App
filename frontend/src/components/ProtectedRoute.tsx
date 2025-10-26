import { useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ 
  children, 
  type = "auth" // "auth" for protected, "guest" for login/register
}: { 
  children: React.ReactElement;
  type?: "auth" | "guest";
}) => {
  const auth = useContext(AuthContext);
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsChecking(false), 100);
    return () => clearTimeout(timer);
  }, [location]);

  //  Show loading while checking authentication
  if (isChecking) {
    return <div className="spinner-border text-primary" />;
  }

  //  GUEST ROUTES (login/register) - Redirect if already logged in
  if (type === "guest" && auth?.token) {
    return <Navigate to={auth.user?.role === "admin" ? "/admin" : "/user"} replace />;
  }

  //  PROTECTED ROUTES - Redirect to login if not authenticated
  if (type === "auth" && !auth?.token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;