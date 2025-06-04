type FormProps = {
  onClose: () => void;
  handleDeleteChat: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  deleteChatLoading: boolean;
};

const DeleteChatForm = ({
  onClose,
  handleDeleteChat,
  deleteChatLoading,
}: FormProps) => {
  return (
    <form onSubmit={handleDeleteChat}>
      <h2 className="text-center text-xl">Delete Account</h2>
      <p className="text-center text-gray-300 mt-3">
        Are you sure that you want to{" "}
        <span className="text-red-600">DELETE</span>
        {""} this chat? This action is irreversible !
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
          disabled={deleteChatLoading}
          className="bg-red-700 px-3 py-1 font-semibold rounded cursor-pointer"
        >
          Delete
        </button>
      </div>
    </form>
  );
};
export default DeleteChatForm;
