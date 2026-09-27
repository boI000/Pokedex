import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";

const ProtectedRoute = () => {
  const { currentUser, isAuthLoading } = useAuthContext();

  if (isAuthLoading) return <p className="state-message">Ładowanie sesji...</p>;
  if (!currentUser)
    return (
      <Navigate
        to="/login"
        replace
        state={{ message: "You need to log in to access this page" }}
      />
    );
  return <Outlet />;
};

export default ProtectedRoute;
