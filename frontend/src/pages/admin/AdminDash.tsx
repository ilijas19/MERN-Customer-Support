import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../redux/store";
import DashBox from "../../components/DashBox";
import { FaUser, FaUserAstronaut, FaUsers } from "react-icons/fa";

const AdminDash = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser?.role !== "admin") {
      navigate("/");
    }
  }, [currentUser]);

  return (
    <>
      <h2 className="text-2xl my-4 mx-4 text-center">Admin Dashboard</h2>
      <div className="text-white flex flex-wrap justify-around px-6 max-w-[900px] mx-auto gap-4">
        <DashBox
          label="Manage Operators"
          to="/operators"
          icon={<FaUserAstronaut />}
        />
        <DashBox label="Manage Users" to="/operators" icon={<FaUsers />} />{" "}
        <DashBox label="Profile" to="/operators" icon={<FaUser />} />
      </div>
    </>
  );
};
export default AdminDash;
