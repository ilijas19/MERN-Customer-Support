import { Navigate, Outlet } from "react-router-dom";
import { useGetCurrentUserQuery } from "../../redux/api/authApiSlice";
import Loader from "../Loader";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../../redux/features/authSlice";

const AuthRoute = () => {
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
    return <Navigate to={"/login"} replace />;
  }

  if (currentUser) {
    return <Outlet />;
  }
};
export default AuthRoute;
