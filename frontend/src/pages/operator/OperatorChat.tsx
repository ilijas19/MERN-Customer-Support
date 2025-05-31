import { useEffect, useRef, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import {
  useGetChatMessagesQuery,
  useGetMyChatsQuery,
} from "../../redux/api/operatorApiSlice";
import Loader from "../../components/Loader";
import ChatEl from "../../components/Chat/ChatEl";
import { RiMenuFold4Line, RiMenuUnfold4Line } from "react-icons/ri";
import type { Chat, Message as MessageType } from "../../types";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { IoSend } from "react-icons/io5";
import Message from "../../components/Chat/Message";
const OperatorChat = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  // CHATS
  const [selectedChats, setSelectedChats] = useState<string>("queue");
  const [chatsPage] = useState(1);
  const [isChatSidebarOpen, setChatSidebarOpen] = useState(false);
  const { data: chats, isLoading: chatsLoading } = useGetMyChatsQuery({
    page: chatsPage,
  });
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  /////////

  ///MESSAGES
  const [messagesPage, setMessagesPage] = useState(1);
  const [showingMessages, setShowingMessages] = useState<MessageType[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const {
    data: chatMessages,
    isLoading: messagesLoading,
    isFetching,
  } = useGetChatMessagesQuery(
    { chatId: selectedChat?._id ?? "", page: messagesPage },
    { skip: !selectedChat }
  );
  ////

  useEffect(() => {
    if (messagesPage === 1 && chatMessages) {
      setShowingMessages([]);
      setShowingMessages([...chatMessages.messages].reverse());
    }
    if (messagesPage > 1 && chatMessages) {
      const newMessages = [...chatMessages.messages].reverse();
      setShowingMessages((prev) => [...newMessages, ...prev]);
    }
  }, [chatMessages]);

  useEffect(() => {
    if (messagesPage === 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [showingMessages, messagesPage]);

  useEffect(() => {
    setMessagesPage(1);
  }, [selectedChat]);

  return (
    <section className="max-w-[1200px] grid grid-cols-[1.6fr_3fr] mx-auto relative w-full ">
      {/* MENU */}
      <div
        className={`bg-gray-800 shadow-xl sm:border-r sm:border-gray-700 not-md:fixed top-0 left-0 h-full md:w-full sm:w-[65%] w-[80%] z-40
          transform transition-transform duration-300 ease-in-out
          ${isChatSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0`}
      >
        {/* header */}
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
            onChange={(e) => setSelectedChats(e.target.value)}
            className={`bg-gray-700 rounded-lg p-1 font-semibold outline-none border-gray-700 w-full cursor-pointer ${
              selectedChats === "queue"
                ? "text-yellow-600"
                : selectedChats === "active"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            <option className="text-yellow-600" value="queue">
              Queue
            </option>
            <option className="text-green-600" value="active">
              Active Chats
            </option>
            <option className="text-red-600" value="closed">
              Closed Chats
            </option>
          </select>
        </div>
        {/* chat list */}
        <ul>
          {chatsLoading && <Loader />}
          {chats?.chats.map((chat) => (
            <ChatEl
              key={chat._id}
              chat={chat}
              setSelectedChat={setSelectedChat}
            />
          ))}
        </ul>
      </div>

      {/* CHAT */}
      <div className="not-md:col-span-2 flex flex-col ">
        <h2 className="flex items-center font-semibold justify-center p-2 text-xl gap-2 text-sky-700 border-b border-gray-700 relative">
          <RiMenuFold4Line
            size={24}
            onClick={() => setChatSidebarOpen(true)}
            className="md:hidden absolute left-3 cursor-pointer text-white"
          />
          {selectedChat ? `${selectedChat.user.fullName}` : "Chat"}
        </h2>
        {/* _messages */}
        <ul className="overflow-y-auto flex flex-col gap-4 p-4 h-[calc(100vh-11.2rem)] custom-scrollbar">
          {messagesLoading && <Loader />}

          {/* Load older messages button */}
          {chatMessages?.hasNextPage && (
            <button
              onClick={() => setMessagesPage(messagesPage + 1)}
              disabled={isFetching}
              className="bg-gray-700 w-fit self-center px-3 py-1 rounded-lg cursor-pointer hover:bg-gray-600 transition-all duration-300 disabled:opacity-50"
            >
              {isFetching ? "Loading..." : "Load older messages"}
            </button>
          )}

          {selectedChat &&
            !messagesLoading &&
            showingMessages.map((message) => (
              <Message
                message={message}
                key={message._id}
                currentUserId={currentUser!.userId}
              />
            ))}
          {chatMessages && chatMessages.messages.length === 0 && (
            <h2 className="text-center text-gray-500">No messages yet</h2>
          )}

          {!selectedChat && (
            <h2 className="text-center text-gray-500">
              Start or Join an Existing Chat!
            </h2>
          )}
          <div ref={messagesEndRef} />
        </ul>

        {/* send message input */}
        {selectedChat && !messagesLoading && (
          <div className=" border-t border-gray-700 bg-gray-800 p-3">
            <form className="flex gap-2">
              <input
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
              <button
                type="button"
                className="hover:text-sky-400 transition-colors"
              >
                Attach Image
              </button>
              <span>Press Enter to send</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default OperatorChat;
