import { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { useGetMyChatsQuery } from "../../redux/api/operatorApiSlice";
import Loader from "../../components/Loader";
import ChatEl from "../../components/Chat/ChatEl";
import { RiMenuUnfold4Line } from "react-icons/ri";
import OperatorChatTab from "../../components/operator/OperatorChatTab";

const OperatorChat = () => {
  // CHATS

  const [selectedChats, setSelectedChats] = useState<
    "queue" | "active" | "closed"
  >("active");
  const [chatsPage] = useState(1);
  const [menuChatsQuery, setMenuChatsQuery] = useState<
    "queue" | "active" | "closed"
  >("active");
  const [isChatSidebarOpen, setChatSidebarOpen] = useState(false);
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

  useEffect(() => {
    refetchChats();
  }, [menuChatsQuery, refetchChats]);

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
        {/* _chat list */}
        <ul>
          {chatsLoading && <Loader />}
          {chats?.chats.map((chat) => (
            <ChatEl key={chat._id} chat={chat} />
          ))}
        </ul>
      </div>

      {/* CHAT TAB*/}
      <OperatorChatTab
        setChatSidebarOpen={setChatSidebarOpen}
        refetch={refetchChats}
      />
    </section>
  );
};

export default OperatorChat;
