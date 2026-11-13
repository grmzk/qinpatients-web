import { Navigate, Outlet } from "react-router";

import { useAuth } from "../../features/auth";

function ProtectedRoute() {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
