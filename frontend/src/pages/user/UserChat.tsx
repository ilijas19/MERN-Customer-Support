import { IoSend } from "react-icons/io5";
import {
  useGetMyChatQuery,
  useGetMyMessagesQuery,
} from "../../redux/api/usersApiSlice";
import Loader from "../../components/Loader";
import { isApiError } from "../../utils/isApiError";
import { useEffect, useState, useRef } from "react";
import { IoIosAlert } from "react-icons/io";
import Message from "../../components/Chat/Message";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import type { Message as MessageType } from "../../types";

const UserChat = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [showingMessages, setShowingMessages] = useState<MessageType[]>([]);
  const [page, setPage] = useState(1);

  const {
    data: chat,
    // isLoading: myChatLoading,
    error,
    isFetching,
  } = useGetMyChatQuery({ page: 1 });

  const { data: messages, isLoading: messagesLoading } = useGetMyMessagesQuery(
    {
      page,
      chatId: chat?.chat._id ?? "",
    },
    { skip: !chat }
  );

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (page === 1 && messages) {
      setShowingMessages([...messages!.chatMessages].reverse());
    }
    if (page > 1 && messages) {
      const newMessages = [...messages.chatMessages].reverse();
      setShowingMessages((prev) => [...newMessages, ...prev]);
    }
  }, [messages]);

  useEffect(() => {
    if (page === 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [showingMessages, page]);

  if (messagesLoading) {
    return <Loader />;
  }

  if (error && isApiError(error)) {
    return (
      <section className="w-full max-w-[900px] mx-auto">
        <h2 className="flex items-center font-semibold justify-center p-2 text-xl gap-2 text-sky-700 border-b border-gray-700 relative">
          Operator Chat
        </h2>
        <div className="flex flex-col items-center mt-2">
          <IoIosAlert
            className="text-sky-600 bg-emerald-400 rounded-full my-4"
            size={44}
          />
          <h2 className="text-xl text-gray-200">{error.data.msg} ! </h2>

          {error.data.msg === "You Have No Active Conversation" && (
            <>
              <button className=" bg-emerald-600 mt-4 px-2 py-1 rounded-lg cursor-pointer hover:bg-emerald-700 transition-colors">
                Join Operator Queue
              </button>
              <p className="text-gray-400 mt-2">Users in queue : 3</p>
            </>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-[900px] mx-auto">
      {/* CHAT */}
      <div className="w-full border-x border-gray-700">
        <h2 className="flex items-center font-semibold justify-center p-2 text-xl gap-2 text-sky-700 border-b border-gray-700 relative">
          Operator Chat
        </h2>

        {/* Messages container */}
        <ul className="overflow-y-auto flex flex-col gap-4 p-4 h-[calc(100vh-11.2rem)] custom-scrollbar">
          {/* Load older messages button */}
          {messages?.hasNextPage && (
            <button
              onClick={() => setPage(page + 1)}
              disabled={isFetching}
              className="bg-gray-700 w-fit self-center px-3 py-1 rounded-lg cursor-pointer hover:bg-gray-600 transition-all duration-300 disabled:opacity-50"
            >
              {isFetching ? "Loading..." : "Load older messages"}
            </button>
          )}

          {/* Messages list */}
          {showingMessages.map((message) => (
            <Message
              message={message}
              key={message._id}
              currentUserId={currentUser!.userId}
            />
          ))}

          {showingMessages.length === 0 && !isFetching && (
            <h2 className="text-center text-gray-500">No messages yet</h2>
          )}

          {isFetching && page === 1 && (
            <div className="flex justify-center">
              <Loader />
            </div>
          )}
          <div ref={messagesEndRef} />
        </ul>

        {/* Message input */}
        <div className="border-t border-gray-700 bg-gray-800 p-3">
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
      </div>
    </section>
  );
};

export default UserChat;
