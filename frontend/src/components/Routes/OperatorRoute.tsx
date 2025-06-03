import { Navigate, Outlet } from "react-router-dom";
import { useGetCurrentUserQuery } from "../../redux/api/authApiSlice";
import Loader from "../Loader";
import { useEffect } from "react";
import { setCurrentUser } from "../../redux/features/authSlice";
import { useDispatch } from "react-redux";

const OperatorRoute = () => {
  const { data: currentUser, isLoading } = useGetCurrentUserQuery();

  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUser) {
      dispatch(setCurrentUser(currentUser.currentUser));
    }
  }, [currentUser, dispatch]);

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
