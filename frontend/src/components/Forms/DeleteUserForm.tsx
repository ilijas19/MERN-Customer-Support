import { toast } from "react-toastify";
import { useDeleteAccountMutation } from "../../redux/api/adminApiSlice";
import { isApiError } from "../../utils/isApiError";
import type { User } from "../../types";

type FormProps = {
  refetch: () => void;
  onClose: () => void;
  deletingUser: User | undefined;
};

const DeleteUserForm = ({ refetch, onClose, deletingUser }: FormProps) => {
  const [deleteApiHandler, { isLoading }] = useDeleteAccountMutation();
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await deleteApiHandler(deletingUser!._id).unwrap();
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
    <form onSubmit={onSubmit}>
      <h2 className="text-center text-xl">Delete Account</h2>
      <p className="text-center text-gray-300 mt-3">
        Are you sure that you want to{" "}
        <span className="text-red-600">DELETE</span> {deletingUser?.fullName}'s
        account? This action is irreversible !
      </p>
      <div className="flex justify-center mt-5 gap-3">
        <button
          onClick={onClose}
          type="button"
          className="bg-white text-black font-semibold px-3 py-1 cursor-pointer rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-red-700 px-3 py-1 font-semibold rounded cursor-pointer"
        >
          Delete
        </button>
      </div>
    </form>
  );
};
export default DeleteUserForm;
