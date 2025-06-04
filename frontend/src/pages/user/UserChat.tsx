import {
  useGetMyChatQuery,
  useGetMyMessagesQuery,
} from "../../redux/api/usersApiSlice";
import Loader from "../../components/Loader";
import { isApiError } from "../../utils/isApiError";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import QueueSection from "../../components/User/QueueSection";
import useSocket from "../../hooks/useSocket";
import ChatInput from "../../components/Chat/ChatInput";
import { setSelectedChat } from "../../redux/features/chatSlice";
import MessageContainer from "../../components/Chat/MessageContainer";

const UserChat = () => {
  const [page, setPage] = useState(1);
  const { socket, connected } = useSocket();

  const dispatch = useDispatch();

  const {
    data: chat,
    // isLoading: myChatLoading,
    error,
    refetch: refetchChat,
  } = useGetMyChatQuery({ page: 1 });

  const { data: messages, isLoading: messagesLoading } = useGetMyMessagesQuery(
    {
      page,
      chatId: chat?.chat._id ?? "",
    },
    { skip: !chat }
  );

  useEffect(() => {
    if (chat) {
      dispatch(setSelectedChat(chat.chat));
    }
  }, [chat, dispatch]);

  // SOCKET
  useEffect(() => {
    if (socket && connected) {
      if (chat) {
        socket.emit("joinChat", chat.chat._id);
      }
    }
    return () => {};
  }, [connected, socket, chat]);

  useEffect(() => {
    if (socket && connected) {
      socket.on("operatorJoined", () => {
        // TODO: Operator joined your chat message
        socket.emit("leaveQueue");
        refetchChat();
      });

      // socket.on("messageFromServer", (message: MessageType) => {
      //   console.log(message);
      // });

      socket.on("closeChat", () => {
        alert("Operator closed your chat");
        refetchChat();
      });
    }
    return () => {};
  }, [connected, socket, refetchChat]);

  if (messagesLoading) {
    return <Loader />;
  }
  // JOIN QUEUE SECTION
  if (error && isApiError(error)) {
    return <QueueSection error={error} socket={socket} connected={connected} />;
  }

  // CHAT SECTION
  return (
    <section className="w-full max-w-[900px] mx-auto">
      {/* CHAT */}
      <div className="w-full border-x border-gray-700">
        <h2 className="flex items-center font-semibold justify-center p-2 text-xl gap-2 text-sky-700 border-b border-gray-700 relative">
          Operator Chat
        </h2>

        {/* Messages container */}
        <MessageContainer
          chatMessages={messages}
          messagesLoading={messagesLoading}
          messagesPage={page}
          setMessagesPage={setPage}
          socket={socket}
        />
        {/* ////////////////////////////////// */}

        {chat?.chat.isActive ? (
          <ChatInput socket={socket} />
        ) : (
          chat?.chat && (
            <div className="border-t border-gray-700 bg-gray-800 p-3 flex items-center justify-between ">
              <h2 className="text-red-600">Operator Closed This Chat</h2>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default UserChat;
