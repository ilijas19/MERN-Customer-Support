import {
  FaFacebookMessenger,
  FaUser,
  FaUserAstronaut,
  FaUsers,
} from "react-icons/fa";
import DashBox from "../../components/DashBox";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const navigate = useNavigate();
  useEffect(() => {
    if (!currentUser) {
      navigate("/login", { replace: true });
    }
  }, [currentUser, navigate]);

  return (
    <section className="max-w-[1000px] mx-auto h-full w-full">
      <h2 className="text-2xl m-4 mb-5">Welcome, {currentUser?.fullName}</h2>
      <div className="text-white flex flex-wrap justify-around px-6 gap-4 not-sm:gap-8">
        <DashBox
          currentUserRole={currentUser?.role}
          allowedRoles={["operator"]}
          label="Operator Chat"
          to="operatorChat"
          icon={<FaFacebookMessenger />}
        />
        <DashBox
          currentUserRole={currentUser?.role}
          allowedRoles={["admin"]}
          label="Manage Operators"
          to="operatorsList"
          icon={<FaUserAstronaut />}
        />
        <DashBox
          currentUserRole={currentUser?.role}
          allowedRoles={["admin"]}
          label="Manage Users"
          to="usersList"
          icon={<FaUsers />}
        />
        <DashBox
          currentUserRole={currentUser?.role}
          allowedRoles={["admin", "operator"]}
          label="Profile"
          to="profile"
          icon={<FaUser />}
        />
      </div>
    </section>
  );
};
export default Home;
