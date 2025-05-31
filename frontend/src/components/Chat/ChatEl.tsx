import type { Chat } from "../../types";
import { formatTime } from "../../utils/formatTime";

type ChatElProps = {
  chat: Chat;
  setSelectedChat: (chat: Chat) => void;
};

const ChatEl = ({ chat, setSelectedChat }: ChatElProps) => {
  return (
    <li
      onClick={() => {
        setSelectedChat(chat);
      }}
      className="px-3 py-2 hover:bg-gray-700 transition-colors cursor-pointer flex gap-2"
    >
      <img src={chat.user.profilePicture} className="size-12 rounded-full" />
      <div>
        <p className="font-semibold">{chat.user.fullName}</p>
        <p className="text-sm text-gray-400">
          {chat.lastMessage ? chat.lastMessage.text : "No Messages Yet"}
        </p>
      </div>
      <p className="self-center ml-auto text-xs text-gray-500">
        {chat.lastMessage
          ? formatTime(chat.lastMessage.createdAt)
          : formatTime(chat.createdAt)}
      </p>
    </li>
  );
};
export default ChatEl;
