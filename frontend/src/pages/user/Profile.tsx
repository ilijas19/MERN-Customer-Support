import {
  FaCalendar,
  FaEnvelope,
  FaUser,
  FaUserAstronaut,
} from "react-icons/fa";
import Loader from "../../components/Loader";
import { useGetMyProfileQuery } from "../../redux/api/usersApiSlice";
import { capitalize } from "../../utils/capitalize";
import { useState } from "react";
import { BsGear } from "react-icons/bs";
import EditProfileForm from "../../components/Forms/EditProfileForm";
import { RiLogoutBoxLine } from "react-icons/ri";
import { useLogoutMutation } from "../../redux/api/authApiSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { isApiError } from "../../utils/isApiError";
import { toast } from "react-toastify";
import { logout } from "../../redux/features/authSlice";
import { apiSlice } from "../../redux/api/apiSlice";
const Profile = () => {
  const { data: user, isLoading, refetch } = useGetMyProfileQuery();
  const [isEditFormOpen, setEditFormOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [logoutApiHandler, { isLoading: logoutLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      const res = await logoutApiHandler().unwrap();
      toast.success(res.msg);
      dispatch(logout());
      dispatch(apiSlice.util.resetApiState());
      navigate("/login");
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.error("Something Went Wrong");
      }
    }
  };

  if (isLoading) {
    return <Loader />;
  }
  return (
    <section className="max-w-[900px] mx-auto sm:mt-4 flex flex-col">
      <div className="bg-gray-800 text-white shadow-2xl sm:rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6 relative">
        <img
          src={user?.profilePicture}
          alt="Profile"
          className="w-32 h-32 rounded-full border-4 border-sky-500 object-cover shadow-md"
        />
        <ul className="flex-1 space-y-2">
          <li className="flex items-center text-2xl font-bold gap-3">
            {user?.role === "operator" ? (
              <FaUserAstronaut className="text-sky-400" />
            ) : (
              <FaUser className="text-sky-400" />
            )}
            {user?.fullName}
          </li>

          <li className="flex items-center text-gray-300 gap-3">
            <FaEnvelope className="text-gray-400" />
            {user?.email}
          </li>

          <li className="flex items-center text-gray-400 gap-3">
            <FaCalendar className="text-gray-500" />
            Joined: {user?.createdAt?.toString().split("T")[0]}
          </li>

          <li>
            <span className="inline-block bg-sky-600/30 text-sky-300 px-3 py-1 text-sm font-semibold rounded-full mt-1">
              {capitalize(user!.role)}
            </span>
          </li>
        </ul>
        <BsGear
          onClick={() => setEditFormOpen(!isEditFormOpen)}
          className="absolute top-3 right-3 cursor-pointer hover:text-sky-500 transition-colors"
          size={24}
        />
        <button
          onClick={handleLogout}
          disabled={logoutLoading}
          className="absolute top-3 left-3 cursor-pointer text-red-600 transition-colors sm:hidden"
        >
          <RiLogoutBoxLine className="" size={24} />
        </button>
      </div>

      {user && isEditFormOpen && (
        <EditProfileForm user={user} refetch={refetch} />
      )}
    </section>
  );
};
export default Profile;
