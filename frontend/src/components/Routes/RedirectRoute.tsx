import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "../../pages/layout/Home";
import type { RootState } from "../../redux/store";

const RedirectRoute = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth);

  if (currentUser?.role === "user") {
    return <Navigate to="/chat" replace />;
  }
  if (currentUser?.role === "operator") {
    return <Navigate to="/operatorChat" replace />;
  }
  return <Home />;
};
export default RedirectRoute;
