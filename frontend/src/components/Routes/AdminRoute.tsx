import { Navigate, Outlet } from "react-router-dom";
import { useGetCurrentUserQuery } from "../../redux/api/authApiSlice";
import Loader from "../Loader";

const AdminRoute = () => {
  const { data: currentUser, isLoading } = useGetCurrentUserQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (!currentUser) {
    return <Navigate to={"/login"} />;
  }
  if (currentUser.currentUser.role !== "admin") {
    return <Navigate to={"/"} />;
  }
  return <Outlet />;
};
export default AdminRoute;
