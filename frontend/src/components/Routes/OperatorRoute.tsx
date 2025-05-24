import { Navigate, Outlet } from "react-router-dom";
import { useGetCurrentUserQuery } from "../../redux/api/authApiSlice";
import Loader from "../Loader";

const OperatorRoute = () => {
  const { data: currentUser, isLoading } = useGetCurrentUserQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (!currentUser) {
    return <Navigate to={"/login"} />;
  }
  if (currentUser.currentUser.role !== "operator") {
    return <Navigate to={"/"} />;
  }
  return <Outlet />;
};
export default OperatorRoute;
