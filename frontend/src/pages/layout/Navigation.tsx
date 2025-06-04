import { IoMdMenu } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { useState } from "react";
import { MdClose } from "react-icons/md";
import {
  FaFacebookMessenger,
  FaUser,
  FaUserAstronaut,
  FaUserFriends,
} from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { capitalize } from "../../utils/capitalize";
import { Link, useNavigate } from "react-router-dom";
import { isApiError } from "../../utils/isApiError";
import { toast } from "react-toastify";
import { useLogoutMutation } from "../../redux/api/authApiSlice";
import { logout } from "../../redux/features/authSlice";
import { apiSlice } from "../../redux/api/apiSlice";
const Navigation = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [isMenuOpen, setMenuOpen] = useState<boolean>(false);
  const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiHandler, { isLoading: logoutLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    if (logoutLoading) return;
    try {
      const res = await logoutApiHandler().unwrap();
      dispatch(logout());
      dispatch(apiSlice.util.resetApiState());
      setDropdownOpen(false);
      setMenuOpen(false);
      navigate("/login");
      toast.success(res.msg);
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.error("Someting Went Wrong");
      }
    }
  };

  return (
    currentUser && (
      <>
        {/* Navigation bar */}
        <nav className="border-b  border-gray-700 px-3 py-2 flex items-center justify-between shadow-lg">
          <h2 className="text-xl font-semibold text-sky-600 ">
            Customer Support
          </h2>
          <IoMdMenu
            size={27}
            className="cursor-pointer"
            onClick={() => setMenuOpen(true)}
          />
        </nav>
        {/* popup menu */}
        <ul
          className={`fixed top-0 right-0 z-50 sm:w-[22rem] w-full h-full
  transition-transform duration-300 ease-in-out
  bg-gradient-to-b from-gray-800 to-gray-900 text-white
  shadow-2xl px-5 py-6 flex flex-col rounded-l-xl
  ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <MdClose
            className="absolute top-4 right-4 cursor-pointer text-sky-500 hover:text-white transition-colors"
            size={26}
            onClick={() => setMenuOpen(false)}
          />

          <h2 className="text-2xl font-bold text-center text-sky-400 mb-6 tracking-widee">
            Menu
          </h2>

          {currentUser.role === "admin" && (
            <>
              <Link
                onClick={() => setMenuOpen(false)}
                to={"/operatorsList"}
                className="flex items-center gap-4 cursor-pointer px-4 py-3 hover:bg-gray-600/60 rounded-lg transition-all"
              >
                <FaUserAstronaut className="text-sky-500" size={20} />
                <span className="text-base font-medium">Manage Operators</span>
              </Link>
              <Link
                onClick={() => setMenuOpen(false)}
                to={"/usersList"}
                className="flex items-center gap-4 cursor-pointer px-4 py-3 hover:bg-gray-600/60 rounded-lg transition-all"
              >
                <FaUser className="text-sky-500" size={20} />
                <span className="text-base font-medium">Manage Users</span>
              </Link>
            </>
          )}
          {currentUser.role === "operator" && (
            <>
              <Link
                onClick={() => setMenuOpen(false)}
                to={"/operatorChat"}
                className="flex items-center gap-4 cursor-pointer px-4 py-3 hover:bg-gray-600/60 rounded-lg transition-all"
              >
                <FaUserAstronaut className="text-sky-500" size={20} />
                <span className="text-base font-medium">Operator Chat</span>
              </Link>
            </>
          )}
          {currentUser.role === "user" && (
            <>
              <Link
                onClick={() => setMenuOpen(false)}
                to={"/chat"}
                className="flex items-center gap-4 cursor-pointer px-4 py-3 hover:bg-gray-600/60 rounded-lg transition-all"
              >
                <FaFacebookMessenger className="text-sky-500" size={20} />
                <span className="text-base font-medium">Chat</span>
              </Link>
            </>
          )}

          <Link
            onClick={() => setMenuOpen(false)}
            to={"/profile"}
            className="flex items-center gap-4 cursor-pointer px-4 py-3 hover:bg-gray-600/60 rounded-lg transition-all"
          >
            <FaUserFriends className="text-sky-500" size={20} />
            <span className="text-base font-medium">Profile</span>
          </Link>

          {/* profile div */}
          <div className="mt-auto flex items-center gap-3 bg-gray-800 px-3 py-2 rounded-xl relative">
            <img
              src={currentUser.profilePicture}
              alt="User"
              className="h-10 w-10 rounded-full object-cover bg-gray-600"
            />
            <div>
              <p className="font-semibold text-sky-400">
                {currentUser.fullName}
              </p>
              <p className="text-sm text-gray-400">
                {capitalize(currentUser.role)}
              </p>
            </div>
            <BsThreeDots
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              className="ml-auto text-gray-400 cursor-pointer hover:text-white transition-colors"
              size={20}
            />
            {isDropdownOpen && (
              <ul className="absolute bg-gray-700 border border-gray-400  right-3 top-0 -translate-y-[70%] flex flex-col  w-24">
                <Link
                  to={"/profile"}
                  className=" py-1 border-b border-gray-600 hover:bg-gray-500 w-full text-center cursor-pointer font-semibold"
                >
                  Profile
                </Link>
                <li
                  onClick={handleLogout}
                  className="py-1 hover:bg-gray-500  cursor-pointer w-full text-center font-semibold"
                >
                  Logout
                </li>
              </ul>
            )}
          </div>
        </ul>
      </>
    )
  );
};
export default Navigation;
