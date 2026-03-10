import { Navigate, Outlet } from "react-router-dom";
import { getSession } from "@/pages/Auth";

const ProtectedRoute = () => {
  const session = getSession();
  return session ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;