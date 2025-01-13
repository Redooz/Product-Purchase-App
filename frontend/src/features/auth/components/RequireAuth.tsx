import { useSelector } from "react-redux";
import { selecteCurrentToken } from "../authSlice";
import { Navigate, Outlet, useLocation } from "react-router";

const RequireAuth = () => {
  const token = useSelector(selecteCurrentToken);
  const location = useLocation();

  return (
    token
      ? <Outlet />
      : <Navigate to="/login" state={{ from: location.pathname }} replace />
  )
}

export default RequireAuth;