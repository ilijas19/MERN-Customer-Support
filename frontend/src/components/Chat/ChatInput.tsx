import { useState } from "react";
import { IoSend } from "react-icons/io5";
import { useSelector } from "react-redux";
import type { Socket } from "socket.io-client";
import type { RootState } from "../../redux/store";
import { isApiError } from "../../utils/isApiError";
import { toast } from "react-toastify";
import { useUploadImageMutation } from "../../redux/api/uploadApiSlice";

type InputProps = {
  socket: Socket;
};
const ChatInput = ({ socket }: InputProps) => {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const { selectedChat } = useSelector((state: RootState) => state.chat);

  const [inputValue, setInputValue] = useState<string>("");
  const [inputImgUrl, setInputImgUrl] = useState<string>("");

  const [uploadApiHandler, { isLoading: uploadLoading }] =
    useUploadImageMutation();

  const handleMessageSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit("messageFromClient", {
      text: inputValue,
      from: currentUser,
      chatId: selectedChat?._id,
      imageUrl: inputImgUrl,
    });
    setInputValue("");
    setInputImgUrl("");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.files && e.target.files.length > 0) {
        const formData = new FormData();
        formData.append("image", e.target.files[0]);
        const res = await uploadApiHandler(formData).unwrap();
        setInputImgUrl(res.url);
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
    <div className=" border-t border-gray-700 bg-gray-800 p-3 ">
      <form className="flex gap-2" onSubmit={handleMessageSend}>
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          type="text"
          placeholder="Type your message..."
          className="flex-1 bg-gray-700 text-white rounded-full py-2 px-4 outline-none focus:ring-2 focus:ring-sky-500"
        />
        <button
          type="submit"
          className="bg-sky-600 hover:bg-sky-700 text-white rounded-full p-2 transition-colors duration-200"
          aria-label="Send message"
        >
          <IoSend size={20} />
        </button>
      </form>
      <div className="flex justify-between mt-2 text-xs text-gray-400">
        <div>
          <label className="cursor-pointer hover:text-sky-600" htmlFor="image">
            {uploadLoading
              ? "Uploading..."
              : inputImgUrl
              ? "Image Uploaded"
              : "Upload Image"}
          </label>
          <input
            disabled={uploadLoading}
            id="image"
            type="file"
            hidden
            onChange={handleImageUpload}
          />
        </div>
        <span>Press Enter to send</span>
      </div>
    </div>
  );
};
export default ChatInput;
