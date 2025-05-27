import { useState } from "react";
import { FaLock } from "react-icons/fa";
import { GrContactInfo } from "react-icons/gr";
import { IoMdMail } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { isApiError } from "../../utils/isApiError";
import { toast } from "react-toastify";
import { useCreateOperatorAccountMutation } from "../../redux/api/adminApiSlice";
type FormProps = {
  onClose: () => void;
  refetch: () => void;
};
const AddOperatorForm = ({ onClose, refetch }: FormProps) => {
  const [props, setProps] = useState({
    fullName: "",
    email: "",
    password: "",
    passwordRe: "",
  });

  const [addOperatorApiHandler, { isLoading }] =
    useCreateOperatorAccountMutation();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (props.password !== props.passwordRe) {
        toast.error("Passwords do not match");
      }
      const res = await addOperatorApiHandler({
        fullName: props.fullName,
        email: props.email,
        password: props.password,
      }).unwrap();
      toast.success(res.msg);
      refetch();
      onClose();
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.error("Something Went Wrong");
      }
    }
  };

  return (
    <form onSubmit={onSubmit} className="relative flex flex-col gap-0.5">
      <IoMdClose
        onClick={onClose}
        className="absolute right-0 text-red-600 cursor-pointer"
        size={26}
      />
      <h2 className="text-center text-xl">Add New Operator</h2>
      <label className="text-gray-300">Full Name</label>
      <div className="flex items-center gap-2 border border-gray-700 rounded-lg px-3 py-2 mb-2">
        <GrContactInfo size={24} className="text-sky-700" />
        <input
          value={props.fullName}
          onChange={(e) => setProps({ ...props, fullName: e.target.value })}
          type="text"
          placeholder="Enter Full Name"
          className="outline-none"
        />
      </div>
      <label className="text-gray-300">Email</label>
      <div className="flex items-center gap-2 border border-gray-700 rounded-lg px-3 py-2 mb-2">
        <IoMdMail size={24} className="text-sky-700" />
        <input
          value={props.email}
          onChange={(e) => setProps({ ...props, email: e.target.value })}
          type="email"
          placeholder="Enter Email"
          className="outline-none"
        />
      </div>
      <label className="text-gray-300">Password</label>
      <div className="flex items-center gap-2 border border-gray-700 rounded-lg px-3 py-2 mb-2">
        <FaLock size={22} className="text-sky-700" />
        <input
          value={props.password}
          onChange={(e) => setProps({ ...props, password: e.target.value })}
          type="password"
          placeholder="Enter Password"
          className="outline-none"
        />
      </div>
      <label className="text-gray-300">Repeat Password</label>
      <div className="flex items-center gap-2 border border-gray-700 rounded-lg px-3 py-2 mb-2">
        <FaLock size={22} className="text-sky-700" />
        <input
          value={props.passwordRe}
          onChange={(e) => setProps({ ...props, passwordRe: e.target.value })}
          type="password"
          placeholder="Repeat Password"
          className="outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="text-center w-full bg-sky-700 rounded-lg py-1 mt-2 font-semibold hover:bg-sky-600 transition-colors cursor-pointer"
      >
        Submit
      </button>
    </form>
  );
};
export default AddOperatorForm;
