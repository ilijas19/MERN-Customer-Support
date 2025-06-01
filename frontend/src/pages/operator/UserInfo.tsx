import { useParams } from "react-router-dom";
import { useGetSingleUserQuery } from "../../redux/api/adminApiSlice";
import Loader from "../../components/Loader";
import { isApiError } from "../../utils/isApiError";
import {
  FaCalendar,
  FaEnvelope,
  FaUser,
  FaUserAstronaut,
} from "react-icons/fa";
import { capitalize } from "../../utils/capitalize";

const UserInfo = () => {
  const { id } = useParams();
  const { data: user, isLoading, error } = useGetSingleUserQuery(id ?? "");

  if (isLoading) return <Loader />;
  if (error) {
    return (
      <h2 className="text-red-600 text-lg p-3">
        {isApiError(error) ? error.data.msg : "Something Went Wrong"}
      </h2>
    );
  }

  return (
    <section className="max-w-[900px] mx-auto sm:mt-10 mt-3 px-4 w-full">
      {/* User Info */}
      <div className="bg-gray-800 text-white shadow-2xl rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6">
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
      </div>
    </section>
  );
};
export default UserInfo;
