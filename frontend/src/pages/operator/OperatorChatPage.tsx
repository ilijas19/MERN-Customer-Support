import { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import {
  useCreateChatMutation,
  useGetMyChatsQuery,
} from "../../redux/api/operatorApiSlice";
import Loader from "../../components/Loader";
import ChatEl from "../../components/Chat/ChatEl";
import { RiMenuUnfold4Line } from "react-icons/ri";
import OperatorChatTab from "../../components/operator/OperatorChatTab";
import useSocket from "../../hooks/useSocket";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import type { Chat, SocketUser } from "../../types";
import { isApiError } from "../../utils/isApiError";
import { toast } from "react-toastify";
import { setSelectedChat } from "../../redux/features/chatSlice";

const OperatorChat = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const { socket, connected } = useSocket();

  const dispatch = useDispatch();

  const [selectedChats, setSelectedChats] = useState<
    "queue" | "active" | "closed"
  >("active");
  const [chatsPage] = useState(1);
  const [menuChatsQuery, setMenuChatsQuery] = useState<
    "queue" | "active" | "closed"
  >("active");
  const [isChatSidebarOpen, setChatSidebarOpen] = useState(false);
  const [showingChats, setShowingChats] = useState<Chat[]>([]);
  const [queueUsers, setQueueUsers] = useState<SocketUser[]>([]);

  const {
    data: chats,
    isLoading: chatsLoading,
    refetch: refetchChats,
  } = useGetMyChatsQuery(
    {
      page: chatsPage,
      isActive:
        menuChatsQuery === "active"
          ? true
          : menuChatsQuery === "closed"
          ? false
          : true,
    },
    { skip: menuChatsQuery === "queue" }
  );

  const [startChatApiHandler, { isLoading: startChatLoading }] =
    useCreateChatMutation();

  const handleChatStart = async (user: SocketUser) => {
    try {
      console.log(user);

      if (startChatLoading) return;
      const res = await startChatApiHandler({ userId: user.userId }).unwrap();
      dispatch(setSelectedChat(res.chat));
      socket.emit("startChat", user.socketId);
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
    if (!chats) return;

    if (menuChatsQuery === "queue") {
      setShowingChats([]);
    } else {
      setShowingChats(chats?.chats);
      refetchChats();
    }
  }, [menuChatsQuery, refetchChats, chats]);

  //SOCKET ID
  useEffect(() => {
    if (socket && connected) {
      socket.emit("getQueueUsers");

      socket.on("updateQueue", (data: SocketUser[]) => {
        setQueueUsers(data);
      });
      return () => {
        socket.disconnect();
      };
    }
  }, [socket, connected, currentUser]);

  useEffect(() => {
    // console.log(queueUsers);
  }, [queueUsers]);

  return (
    <section className="max-w-[1200px] grid grid-cols-[1.6fr_3fr] mx-auto relative w-full ">
      {/* MENU */}
      <div
        className={`bg-gray-800 shadow-xl sm:border-r sm:border-gray-700 not-md:fixed top-0 left-0 h-full md:w-full sm:w-[65%] w-[80%] z-40
          transform transition-transform duration-300 ease-in-out
          ${isChatSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0`}
      >
        {/* _header */}
        <h2 className="flex items-center font-semibold justify-center p-2 text-xl gap-2 text-sky-700 border-b border-gray-700 relative">
          <FaInfoCircle size={22} />
          Operator Chat
          <RiMenuUnfold4Line
            size={24}
            onClick={() => setChatSidebarOpen(false)}
            className="md:hidden absolute right-3 text-white cursor-pointer"
          />
        </h2>
        <div className="p-3">
          <select
            onChange={(e) => {
              setMenuChatsQuery(
                e.target.value as "queue" | "active" | "closed"
              );
              setSelectedChats(e.target.value as "queue" | "active" | "closed");
            }}
            className={`bg-gray-700 rounded-lg p-1 font-semibold outline-none border-gray-700 w-full cursor-pointer ${
              selectedChats === "queue"
                ? "text-yellow-600"
                : selectedChats === "active"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            <option className="text-green-600" value="active">
              Active Chats
            </option>
            <option className="text-yellow-600" value="queue">
              Queue
            </option>
            <option className="text-red-600" value="closed">
              Closed Chats
            </option>
          </select>
        </div>
        {/* CHAT LIST */}
        <ul>
          {/* join socket room on joining chat */}
          {chatsLoading && <Loader />}
          {showingChats.map((chat) => (
            <ChatEl
              key={chat._id}
              chat={chat}
              setChatSidebarOpen={setChatSidebarOpen}
              socket={socket}
            />
          ))}

          {/* join socket room on creating chat */}
          {selectedChats === "queue" &&
            queueUsers.map((user) => (
              <li
                key={user.userId}
                onClick={() => {
                  handleChatStart(user);
                  setChatSidebarOpen(false);
                }}
                className="px-3 py-2 hover:bg-gray-700 transition-colors cursor-pointer flex gap-2"
              >
                <img
                  src={user.profilePicture}
                  className="size-12 rounded-full"
                />
                <div>
                  <p className="font-semibold">{user.fullName}</p>
                  <p className="text-sm text-gray-400">Start Chat</p>
                </div>
              </li>
            ))}
        </ul>
      </div>

      {/* CHAT TAB*/}
      <OperatorChatTab
        setChatSidebarOpen={setChatSidebarOpen}
        refetch={refetchChats}
        selectedChats={selectedChats}
        socket={socket}
      />
    </section>
  );
};

export default OperatorChat;
