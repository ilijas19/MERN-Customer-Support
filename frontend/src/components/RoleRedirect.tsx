import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { Navigate } from "react-router-dom";

const RoleRedirect = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth);

  if (!currentUser) return <Navigate to="/login" replace />;

  switch (currentUser.role) {
    case "admin":
      return <Navigate to="/admin-dashboard" replace />;
    case "operator":
      return <Navigate to="/operator-dashboard" replace />;
    default:
      return <Navigate to="/user-dashboard" replace />;
  }
};
export default RoleRedirect;
