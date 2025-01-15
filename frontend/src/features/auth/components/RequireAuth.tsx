import { useSelector } from "react-redux";
import { selectedCurrentToken } from "../authSlice";
import { Navigate, Outlet, useLocation } from "react-router";

const RequireAuth = () => {
  const token = useSelector(selectedCurrentToken);
  const location = useLocation();

  return (
    token
      ? <Outlet />
      : <Navigate to="/" state={{ from: location.pathname }} replace />
  )
}

export default RequireAuth;