import { useState } from "react";
import { useGetAllUsersQuery } from "../../redux/api/adminApiSlice";
import Loader from "../../components/Loader";
import { FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import Modal from "../../components/Modal";
import AddOperatorForm from "../../components/Forms/AddOperatorForm";
import DeleteUserForm from "../../components/Forms/DeleteUserForm";
import type { User } from "../../types";
import { useNavigate } from "react-router-dom";

const OperatorsPage = () => {
  const [page, setPage] = useState<number>(1);
  const [fullName, setFullName] = useState<string>("");
  const [isAddOperatorMenuOpen, setAddOperatorMenuOpen] =
    useState<boolean>(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [deletingUser, setDeletingUser] = useState<User>();

  const navigate = useNavigate();

  const {
    data: operators,
    isLoading,
    refetch,
  } = useGetAllUsersQuery({
    role: "operator",
    fullName,
    page,
  });
  // console.log(operators);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="p-4">
      <div className="flex sm:justify-between not-sm:flex-col not-sm:px-1 not-sm:gap-2 sm:items-center">
        <div className="flex flex-col gap-1">
          <h3 className="sm:text-2xl  text-xl">Manage Operators</h3>
          <p
            className="text-gray-400 not-sm:text-sm 
      "
          >
            Total Operators: {operators?.totalUsers}
          </p>
        </div>
        <div className="flex  h-10 justify-between gap-2">
          <div className="flex items-center bg-gray-700 border-gray-600 border px-2 py-1 rounded-lg gap-2 not-sm:grow not-sm:">
            <FaSearch />
            <input
              type="text"
              className="outline-none"
              placeholder="Search"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <button
            onClick={() => setAddOperatorMenuOpen(true)}
            className=" px-3  font-semibold rounded-lg flex items-center gap-1 bg-sky-600 text-sm cursor-pointer hover:bg-sky-700 transition-colors "
          >
            <span className="not-sm:hidden">Add Operator</span> <FaPlus />
          </button>
        </div>
      </div>

      <div className="sm:overflow-hidden overflow-x-scroll  border border-b-0 border-gray-700  rounded-2xl  shadow-lg custom-scrollbar mt-3">
        <table className=" w-full not-sm:text-sm  ">
          <thead className="">
            <tr className="bg-gray-800">
              <th className="w-16 py-2 px-4 text-nowrap  text-sky-400">
                Photo
              </th>
              <th className="w-40 py-2 px-6 text-nowrap  text-sky-400">
                Full Name
              </th>
              <th className="w-40 py-2 px-6 text-nowrap  text-sky-400">
                Email
              </th>
              <th className="w-1 py-2 px-2 text-nowrap  text-sky-400">Chats</th>
              <th className="w-1 py-2 px-3 text-nowrap  text-sky-400">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {operators?.users.map((user) => (
              <tr
                onClick={() => navigate(`/profile/${user._id}`)}
                className="border-b border-gray-700 hover:bg-gray-800 transition-all duration-300 cursor-pointer"
              >
                <td className="py-2 place-items-center  border-gray-700">
                  <img
                    src={user.profilePicture}
                    alt=""
                    className="sm:size-11 size-10 rounded-full border border-gray-800"
                  />
                </td>
                <td className="px-3 place-items-center  border-gray-700">
                  <p className="font-semibold">{user.fullName}</p>
                </td>
                <td className="px-3 place-items-center  border-gray-700">
                  <p className="text-gray-300">{user.email}</p>
                </td>
                <td className="px-3 place-items-center  border-gray-700">
                  <p className="text-sky-400 text-nowrap   bg-gray-700 px-3 py-0.5 rounded-xl">
                    {user.chats?.length}{" "}
                    {user.chats?.length === 1 ? "chat" : "chats"}
                  </p>
                </td>
                <td className="">
                  <div className="flex justify-center gap-3">
                    <FaTrash
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingUser(user);
                        setDeleteModalOpen(true);
                      }}
                      className="text-red-700 cursor-pointer"
                      size={17}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
        hidden={!operators?.hasNextPage}
        className="flex justify-center mt-3 gap-3"
      >
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className={`${
            page <= 1 ? " cursor-not-allowed " : "cursor-pointer"
          } bg-gray-700 px-3 py-0.5 font-semibold rounded-lg`}
        >
          Prev
        </button>
        <button
          className={`${
            operators?.hasNextPage ? "cursor-pointer" : "cursor-not-allowed"
          } bg-gray-700 px-3 py-0.5 font-semibold rounded-lg`}
        >
          Next
        </button>
      </div>
      {/* ADD OPERATOR MODAL */}
      <Modal
        isModalOpen={isAddOperatorMenuOpen}
        onClose={() => setAddOperatorMenuOpen(false)}
      >
        <AddOperatorForm
          onClose={() => setAddOperatorMenuOpen(false)}
          refetch={refetch}
        />
      </Modal>
      {/* DELETE OPERATOR MODAL */}
      <Modal
        isModalOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      >
        <DeleteUserForm
          refetch={refetch}
          onClose={() => setDeleteModalOpen(false)}
          deletingUser={deletingUser}
        />
      </Modal>
    </section>
  );
};
export default OperatorsPage;
