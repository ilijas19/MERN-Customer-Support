import React, { useEffect, useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import {
  useGetCurrentUserQuery,
  useRegisterMutation,
} from "../../redux/api/authApiSlice";
import { isApiError } from "../../utils/isApiError";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

const Register = () => {
  const { data: currentUser, isLoading } = useGetCurrentUserQuery();

  const [formProps, setFormProps] = useState({
    fullName: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const [registerApiHandler, { isLoading: registerLoading }] =
    useRegisterMutation();

  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await registerApiHandler(formProps).unwrap();
      navigate("/login");
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.error("Something Went Wrong");
      }
    }
  };

  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="py-10 px-3 w-full">
      <form
        onSubmit={onSubmit}
        className="max-w-[600px] mx-auto shadow-xl p-4 bg-gray-700 rounded-lg flex flex-col  "
      >
        <h2 className="text-center font-semibold text-xl">Welcome</h2>
        <p className="text-center text-gray-300">Register new account</p>
        <label className="text-gray-200">Full Name</label>
        <div className="flex items-center gap-2 focus-within:border-sky-600 border-2 border-gray-600 px-3 py-2 rounded-lg mb-2">
          <FaEnvelope className="text-sky-600" />
          <input
            value={formProps.fullName}
            onChange={(e) =>
              setFormProps({ ...formProps, fullName: e.target.value })
            }
            type="text"
            placeholder="Enter Your Full Name"
            className="outline-none"
          />
        </div>
        <label className="text-gray-200">Email</label>
        <div className="flex items-center gap-2 focus-within:border-sky-600 border-2 border-gray-600 px-3 py-2 rounded-lg mb-2">
          <FaEnvelope className="text-sky-600" />
          <input
            value={formProps.email}
            onChange={(e) =>
              setFormProps({ ...formProps, email: e.target.value })
            }
            type="text"
            placeholder="Enter Your Email"
            className="outline-none"
          />
        </div>
        <label className="text-gray-200">Password</label>
        <div
          className="flex items-center gap-2 focus-within:border-sky-600 border-2 border-gray-600 px-3 py-2 rounded-lg mb-2
        "
        >
          <FaLock className="text-sky-600" />
          <input
            value={formProps.password}
            onChange={(e) =>
              setFormProps({ ...formProps, password: e.target.value })
            }
            type="password"
            placeholder="Enter Your Password"
            className="outline-none"
          />
        </div>
        <label className="text-gray-200">Repeat Password</label>
        <div className="flex items-center gap-2 focus-within:border-sky-600 border-2 border-gray-600 px-3 py-2 rounded-lg">
          <FaLock className="text-sky-600" />
          <input
            value={formProps.repeatPassword}
            onChange={(e) =>
              setFormProps({ ...formProps, repeatPassword: e.target.value })
            }
            type="password"
            placeholder="Repeat Password"
            className="outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={registerLoading}
          className="bg-sky-600 font-semibold mt-4 py-1 rounded cursor-pointer hover:bg-sky-700 transition-colors"
        >
          Sign Up
        </button>
      </form>
      <p className="text-center mt-1">
        Already a member?{" "}
        <Link to={"/login"} className="text-sky-600">
          Sign In
        </Link>
      </p>
    </section>
  );
};
export default Register;
