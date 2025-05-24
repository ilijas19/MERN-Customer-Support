import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser?.role !== "admin") {
      navigate("/");
    }
  }, [currentUser]);

  return (
    <div className="text-white">
      <h2 className="text-center font-semibold">aaa</h2>
    </div>
  );
};
export default AdminPage;
