import { FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import {
  useGetCurrentUserQuery,
  useLoginMutation,
} from "../../redux/api/authApiSlice";
import { useEffect, useState } from "react";
import { isApiError } from "../../utils/isApiError";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../../redux/features/authSlice";
import Loader from "../../components/Loader";

const Login = () => {
  const { data: currentUser, isLoading: currentUserLoading } =
    useGetCurrentUserQuery();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [loginApiHandler, { isLoading }] = useLoginMutation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await loginApiHandler({ email, password }).unwrap();
      console.log(res.currentUser);

      navigate("/");
      dispatch(setCurrentUser(res.currentUser));
      toast.success(res.msg);
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
  }, [currentUser]);

  if (currentUserLoading) {
    return <Loader />;
  }

  return (
    <section className="py-10">
      <form
        onSubmit={onSubmit}
        className="max-w-[600px] mx-auto shadow-xl p-4 bg-gray-700 rounded-lg flex flex-col  "
      >
        <h2 className="text-center font-semibold text-xl">Welcome</h2>
        <p className="text-center text-gray-300">Sign in to continue</p>
        <label className="text-gray-200">Email</label>
        <div className="flex items-center gap-2 focus-within:border-sky-600 border-2 border-gray-600 px-3 py-2 rounded-lg mb-2">
          <FaEnvelope className="text-sky-600" />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Enter Your Email"
            className="outline-none"
          />
        </div>
        <label className="text-gray-200">Password</label>
        <div className="flex items-center gap-2 focus-within:border-sky-600 border-2 border-gray-600 px-3 py-2 rounded-lg">
          <FaLock className="text-sky-600" />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Enter Your Password"
            className="outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-sky-600 font-semibold mt-4 py-1 rounded cursor-pointer hover:bg-sky-700 transition-colors"
        >
          Sign In
        </button>
      </form>
      <p className="text-center mt-1">
        Not a member?{" "}
        <Link to={"/register"} className="text-sky-600">
          Register Now
        </Link>
      </p>
    </section>
  );
};
export default Login;
