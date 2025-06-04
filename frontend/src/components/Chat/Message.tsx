import type { Message as MessageType } from "../../types";
import { formatTime } from "../../utils/formatTime";

type MessageProps = {
  message: MessageType;
  currentUserId: string;
  setPreviewModalOpen: (bol: boolean) => void;
  setSelectedImgUrl: (str: string) => void;
};

const Message = ({
  message,
  currentUserId,
  setPreviewModalOpen,
  setSelectedImgUrl,
}: MessageProps) => {
  const isCurrentUser = message.sender._id === currentUserId;

  if (message.type === "message") {
    return (
      <li
        className={`${
          isCurrentUser
            ? "self-end bg-sky-800  rounded-br-none"
            : "self-start bg-gray-700  rounded-bl-none"
        } px-3 py-2  rounded-3xl shadow-xl flex flex-col  sm:w-[60%] w-[70%]`}
      >
        <p
          className={`${
            !isCurrentUser ? "text-sky-600 " : ""
          } font-semibold text-lg `}
        >
          {message.sender.fullName}
        </p>
        <p className="text-gray-100 not-sm:text-sm mb-1  ">{message.text}</p>
        <p className="text-xs self-end text-gray-400">
          {formatTime(message.createdAt)}
        </p>
      </li>
    );
  }
  if (message.type === "image") {
    return (
      <li
        className={`sm:w-[60%] w-[70%] cursor-pointer ${
          isCurrentUser ? "self-end   " : "self-start "
        }`}
      >
        <img
          onClick={() => {
            setPreviewModalOpen(true);
            setSelectedImgUrl(message.imageUrl ?? "");
          }}
          src={message.imageUrl}
          alt=""
          className="object-contain rounded-lg shadow-xl w-full  max-h-[300px]"
        />
        <p className="text-gray-100 not-sm:text-sm mb-1  ">{message.text}</p>
        <p className="text-xs self-end text-gray-400">
          {formatTime(message.createdAt)}
        </p>
      </li>
    );
  }
};

export default Message;
