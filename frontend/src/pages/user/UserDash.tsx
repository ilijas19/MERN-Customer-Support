import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const UserDash = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser?.role !== "user") {
      navigate("/");
    }
  }, [currentUser]);

  return <div>UserDash</div>;
};
export default UserDash;
