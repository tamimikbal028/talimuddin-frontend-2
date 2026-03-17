import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authHooks } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth: boolean;
}

const ProtectedRoute = ({ children, requireAuth }: ProtectedRouteProps) => {
  const { isAuthenticated } = authHooks.useUser();
  const location = useLocation();

  // Auth required but not logged in → Send to Login page
  // Save current path in location.state to return after login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Already logged in but trying to access login/register → Send to Home
  // Logged in user doesn't need to see the login page
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
