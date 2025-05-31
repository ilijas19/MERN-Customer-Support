import type { Message as MessageType } from "../../types";
import { formatTime } from "../../utils/formatTime";

type MessageProps = {
  message: MessageType;
  currentUserId: string;
};

const Message = ({ message, currentUserId }: MessageProps) => {
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
    return <li>image</li>;
  }
};

export default Message;
