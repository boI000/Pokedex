import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";

const GuestRoute = () => {
  const { currentUser, isAuthLoading } = useAuthContext();

  if (isAuthLoading) return <p>Loading</p>;
  if (!currentUser) return <Outlet />;
  return <Navigate to="/" replace />;
};

export default GuestRoute;
