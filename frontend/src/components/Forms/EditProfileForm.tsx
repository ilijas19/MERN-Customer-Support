import { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { GrContactInfo } from "react-icons/gr";
import { isApiError } from "../../utils/isApiError";
import { toast } from "react-toastify";
import { useUploadImageMutation } from "../../redux/api/uploadApiSlice";
import type { User } from "../../types";
import {
  useDeleteProfileMutation,
  useUpdatePasswordMutation,
  useUpdateProfileMutation,
} from "../../redux/api/usersApiSlice";
import Loader from "../Loader";
import { useLogoutMutation } from "../../redux/api/authApiSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/features/authSlice";
import { apiSlice } from "../../redux/api/apiSlice";

type FormProps = {
  user: User;
  refetch: () => void;
};

const EditProfileForm = ({ user, refetch }: FormProps) => {
  const [formType, setFormType] = useState<"info" | "password" | "delete">(
    "info"
  );
  const [editProps, setEditProps] = useState({
    email: user.email,
    fullName: user.fullName,
    profilePicture: user.profilePicture,
  });

  const [passwordProps, setPasswordProps] = useState({
    oldPassword: "",
    newPassword: "",
    reNewPassword: "",
  });

  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [uploadApiHandler, { isLoading: uploadLoading }] =
    useUploadImageMutation();

  const [updateInfoApiHandler, { isLoading: updateInfoLoading }] =
    useUpdateProfileMutation();

  const [updatePasswordAPiHandler, { isLoading: updatePasswordLoading }] =
    useUpdatePasswordMutation();

  const [deleteProfileApiHandler, { isLoading: deleteProfileLoading }] =
    useDeleteProfileMutation();

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

  const uploadHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.files && e.target.files.length > 0) {
        const formData = new FormData();
        formData.append("image", e.target.files[0]);
        const res = await uploadApiHandler(formData).unwrap();
        toast.success(res.msg);
        setEditProps({ ...editProps, profilePicture: res.url });
      }
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.error("Something Went Wrong");
      }
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (formType === "info") {
        const res = await updateInfoApiHandler(editProps).unwrap();
        toast.success(res.msg);
        refetch();
        return;
      }
      if (formType === "password") {
        const res = await updatePasswordAPiHandler(passwordProps).unwrap();
        toast.success(res.msg);
        return;
      }
      if (formType === "delete") {
        await deleteProfileApiHandler({ password }).unwrap();
        await logoutApiHandler();
        dispatch(logout());
        navigate("/login");
      }
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.error("Something Went Wrong");
      }
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="bg-gray-800 shadow-xl rounded-lg p-4 mt-4"
    >
      {/* switch form buttons */}
      <div className="flex gap-2 text-sm not-sm:justify-center">
        <button
          type="button"
          onClick={() => setFormType("info")}
          className={`sm:px-3 px-1  py-1 ${
            formType === "info" ? "bg-sky-500 font-semibold" : "bg-gray-700"
          } rounded-lg cursor-pointer`}
        >
          Edit Info
        </button>
        <button
          type="button"
          onClick={() => setFormType("password")}
          className={`sm:px-3 px-1  py-1 ${
            formType === "password" ? "bg-sky-500 font-semibold" : "bg-gray-700"
          } rounded-lg cursor-pointer`}
        >
          Update Password
        </button>
        <button
          type="button"
          onClick={() => setFormType("delete")}
          className={`sm:px-3 px-1  py-1 ${
            formType === "delete" ? "bg-sky-500 font-semibold" : "bg-gray-700"
          } rounded-lg cursor-pointer`}
        >
          Delete Profile
        </button>
        <button
          onClick={handleLogout}
          disabled={logoutLoading}
          type="button"
          className="px-3 py-1 bg-red-700 hover:bg-red-800 transition-colors rounded-lg cursor-pointer ml-auto font-semibold not-sm:hidden"
        >
          Logout
        </button>
      </div>
      {/* forms */}
      <div className="mt-3">
        {formType === "info" && (
          <>
            <label>Full Name</label>
            <div className="flex items-center gap-2 bg-gradient-to-tl from-gray-800 to-gray-900  px-3 py-2 rounded-lg border-gray-700 border-2 focus-within:border-sky-700 mb-2">
              <GrContactInfo className="text-sky-600" />
              <input
                value={editProps.fullName}
                onChange={(e) =>
                  setEditProps({ ...editProps, fullName: e.target.value })
                }
                type="text"
                placeholder="Enter Full Name"
                className="outline-none"
              />
            </div>{" "}
            <label>Email</label>
            <div className="flex items-center gap-2 bg-gradient-to-tl from-gray-800 to-gray-900  px-3 py-2 rounded-lg border-gray-700 border-2 focus-within:border-sky-700 mb-2">
              <FaEnvelope className="text-sky-600" />
              <input
                value={editProps.email}
                onChange={(e) =>
                  setEditProps({ ...editProps, email: e.target.value })
                }
                type="text"
                placeholder="Enter Email"
                className="outline-none"
              />
            </div>
            <label>Profile Picture</label>
            <div className="flex items-center gap-2 bg-gradient-to-tl from-gray-800 to-gray-900  px-3 py-2 rounded-lg border-gray-700 border-2 focus-within:border-sky-700 mb-2">
              <img
                src={editProps.profilePicture}
                className="h-5 w-5 bg-white object-cover"
              />
              <label htmlFor="image" className="w-full">
                {editProps.profilePicture === user.profilePicture
                  ? "Upload New Image"
                  : "Image Uploaded"}
              </label>

              <input
                disabled={uploadLoading}
                onChange={uploadHandler}
                id="image"
                type="file"
                placeholder="Enter Email"
                className="outline-none hidden"
              />
              {uploadLoading && <Loader size="small" />}
            </div>
            <button
              disabled={updateInfoLoading}
              className="w-full bg-sky-700 rounded-lg mt-2 py-1 cursor-pointer font-semibold hover:bg-sky-800 transition-colors"
            >
              Save
            </button>
          </>
        )}
        {formType === "password" && (
          <>
            <label>Old Password</label>
            <div className="flex items-center gap-2 bg-gradient-to-tl from-gray-800 to-gray-900  px-3 py-2 rounded-lg border-gray-700 border-2 focus-within:border-sky-700 mb-2">
              <FaLock className="text-sky-600" />
              <input
                value={passwordProps.oldPassword}
                onChange={(e) =>
                  setPasswordProps({
                    ...passwordProps,
                    oldPassword: e.target.value,
                  })
                }
                type="password"
                placeholder="Old Password"
                className="outline-none"
              />
            </div>{" "}
            <label>New Password</label>
            <div className="flex items-center gap-2 bg-gradient-to-tl from-gray-800 to-gray-900  px-3 py-2 rounded-lg border-gray-700 border-2 focus-within:border-sky-700 mb-2">
              <FaLock className="text-sky-600" />
              <input
                value={passwordProps.newPassword}
                onChange={(e) =>
                  setPasswordProps({
                    ...passwordProps,
                    newPassword: e.target.value,
                  })
                }
                type="password"
                placeholder="New Password"
                className="outline-none"
              />
            </div>
            <label>Confirm New Password</label>
            <div className="flex items-center gap-2 bg-gradient-to-tl from-gray-800 to-gray-900  px-3 py-2 rounded-lg border-gray-700 border-2 focus-within:border-sky-700 mb-2">
              <FaLock className="text-sky-600" />
              <input
                value={passwordProps.reNewPassword}
                onChange={(e) =>
                  setPasswordProps({
                    ...passwordProps,
                    reNewPassword: e.target.value,
                  })
                }
                type="password"
                placeholder="Confirm Password"
                className="outline-none"
              />
            </div>
            <button
              disabled={updatePasswordLoading}
              className="w-full bg-sky-700 rounded-lg mt-2 py-1 cursor-pointer font-semibold hover:bg-sky-800 transition-colors"
            >
              Update
            </button>
          </>
        )}
        {formType === "delete" && (
          <>
            <h2 className="text-red-700 mb-1">This action is irreversible</h2>
            <label>Password</label>
            <div className="flex items-center gap-2 bg-gradient-to-tl from-gray-800 to-gray-900  px-3 py-2 rounded-lg border-gray-700 border-2 focus-within:border-red-700 mb-2">
              <FaLock className="text-red-600" />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Enter Password"
                className="outline-none"
              />
            </div>
            <button
              disabled={deleteProfileLoading}
              className="w-full bg-red-700 rounded-lg mt-2 py-1 cursor-pointer font-semibold hover:bg-red-800 transition-colors"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </form>
  );
};
export default EditProfileForm;
