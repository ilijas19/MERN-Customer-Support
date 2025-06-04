import { useDispatch } from "react-redux";
import type { Chat } from "../../types";
import { formatTime } from "../../utils/formatTime";
import { setSelectedChat } from "../../redux/features/chatSlice";
import type { Socket } from "socket.io-client";

type ChatElProps = {
  chat: Chat;
  setChatSidebarOpen: (bol: boolean) => void;
  socket: Socket;
};

const ChatEl = ({ chat, setChatSidebarOpen, socket }: ChatElProps) => {
  const dispatch = useDispatch();
  return (
    <li
      onClick={() => {
        dispatch(setSelectedChat(chat));
        setChatSidebarOpen(false);
        socket.emit("joinChat", chat._id);
      }}
      className="px-3 py-2 hover:bg-gray-700 transition-colors cursor-pointer flex gap-2"
    >
      <img src={chat.user.profilePicture} className="size-12 rounded-full" />
      <div>
        <p className="font-semibold">{chat.user.fullName}</p>
        <p className="text-sm text-gray-400">
          {chat.lastMessage
            ? chat.lastMessage.type === "message"
              ? chat.lastMessage.text || "No messages Yet"
              : "Image"
            : "No messages Yet"}
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
