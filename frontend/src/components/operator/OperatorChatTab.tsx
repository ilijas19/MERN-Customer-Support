import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { RiMenuFold4Line } from "react-icons/ri";
import { useEffect, useState } from "react";
import type { Message as MessageType } from "../../types";
import {
  useCloseChatMutation,
  useDeleteChatMutation,
  useGetChatMessagesQuery,
  useOpenChatMutation,
} from "../../redux/api/operatorApiSlice";
import { BsThreeDots } from "react-icons/bs";
import { isApiError } from "../../utils/isApiError";
import { toast } from "react-toastify";
import { clearSelectedChat } from "../../redux/features/chatSlice";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal";
import DeleteChatForm from "../Forms/DeleteChatForm";
import type { Socket } from "socket.io-client";
import ChatInput from "../Chat/ChatInput";
import MessageContainer from "../Chat/MessageContainer";

type ChatTabProps = {
  setChatSidebarOpen: (bool: boolean) => void;
  refetch: () => void;
  selectedChats: "queue" | "active" | "closed";
  socket: Socket;
};

const OperatorChatTab = ({
  setChatSidebarOpen,
  refetch,
  selectedChats,
  socket,
}: ChatTabProps) => {
  const { selectedChat } = useSelector((state: RootState) => state.chat);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [messagesPage, setMessagesPage] = useState(1);
  const [isChatDropdownOpen, setChatDropdownOpen] = useState(false);
  const [isDeleteChatModalOpen, setDeleteChatModalOpen] = useState(false);

  //__messages
  const { data: chatMessages, isLoading: messagesLoading } =
    useGetChatMessagesQuery(
      { chatId: selectedChat?._id ?? "", page: messagesPage },
      { skip: !selectedChat }
    );

  /// __open & close selectec chat functionality
  const [closeChatApiHandler, { isLoading: closeChatLoading }] =
    useCloseChatMutation();

  const [openChatApiHandler, { isLoading: openChatLoading }] =
    useOpenChatMutation();

  const handleCloseChat = async () => {
    try {
      const res = await closeChatApiHandler(selectedChat!._id ?? "").unwrap();
      toast.success(res.msg);
      refetch();
      dispatch(clearSelectedChat());
      setChatDropdownOpen(false);
      socket.emit("closeChat", selectedChat?.user._id);
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.error("Something Went Wrong");
      }
    }
  };

  const [deleteChatApiHandler, { isLoading: deleteChatLoading }] =
    useDeleteChatMutation();

  const handleDeleteChat = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await deleteChatApiHandler(selectedChat?._id ?? "").unwrap();
      toast.success(res.msg);
      dispatch(clearSelectedChat());
      //this refetch creates error that cant refetch query that has not been started
      if (selectedChats !== "queue") {
        refetch();
      }
      socket.emit("closeChat", selectedChat?.user._id);

      setDeleteChatModalOpen(false);
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.error("Something Went Wrong");
      }
    }
  };

  const handleOpenChat = async () => {
    try {
      const res = await openChatApiHandler(selectedChat!._id ?? "").unwrap();
      toast.success(res.msg);
      refetch();
      dispatch(clearSelectedChat());

      setChatDropdownOpen(false);
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.error("Something Went Wrong");
      }
    }
  };

  //_effects

  useEffect(() => {
    setMessagesPage(1);
  }, [selectedChat]);

  //socket
  useEffect(() => {
    if (socket) {
      socket.on("messageFromServer", (message: MessageType) => {
        console.log(message);
      });
    }
  }, [socket]);

  return (
    <div className="not-md:col-span-2 flex flex-col border-r border-gray-700">
      <h2 className="flex items-center font-semibold justify-center p-2 text-xl gap-2 text-sky-700 border-b border-gray-700 relative">
        <RiMenuFold4Line
          size={24}
          onClick={() => setChatSidebarOpen(true)}
          className="md:hidden absolute left-3 cursor-pointer text-white"
        />
        {selectedChat ? `${selectedChat.user.fullName}` : "Chat"}
        {selectedChat && (
          <>
            <BsThreeDots
              onClick={() => setChatDropdownOpen(!isChatDropdownOpen)}
              className="absolute right-3 text-white cursor-pointer"
            />
            {isChatDropdownOpen && (
              <ul className="absolute not-sm:text-sm text-base text-white bg-gray-700 flex flex-col top-7 p shadow-xl right-3 border border-gray-600 rounded">
                <button
                  onClick={() => {
                    navigate(`/info/${selectedChat.user._id}`);
                  }}
                  className="px-2 py-1 text-center border-b border-gray-600 hover:bg-gray-600 transition-all duration-300 cursor-pointer"
                >
                  View Profile
                </button>

                {selectedChat.isActive ? (
                  <button
                    disabled={closeChatLoading}
                    onClick={handleCloseChat}
                    className="p-1 text-center hover:bg-red-600 hover:text-white transition-all duration-300 cursor-pointer text-white"
                  >
                    Close Chat
                  </button>
                ) : (
                  <button
                    disabled={openChatLoading}
                    onClick={handleOpenChat}
                    className="p-1 text-center hover:bg-green-600 hover:text-white transition-all duration-300 cursor-pointer text-green-600"
                  >
                    Open Chat
                  </button>
                )}

                <button
                  onClick={() => setDeleteChatModalOpen(true)}
                  className="p-1 border-t border-gray-600 text-center hover:bg-red-600 hover:text-white transition-all duration-300 cursor-pointer text-red-600"
                >
                  Delete Chat
                </button>
              </ul>
            )}
          </>
        )}
      </h2>
      {/* _messages */}
      <MessageContainer
        chatMessages={chatMessages}
        messagesLoading={messagesLoading}
        messagesPage={messagesPage}
        setMessagesPage={setMessagesPage}
      />
      {/* ///////////////////////////////////// */}

      {/* _send message input */}
      {selectedChat && !messagesLoading && selectedChat.isActive ? (
        <ChatInput socket={socket} />
      ) : (
        selectedChat && (
          <div className="border-t border-gray-700 bg-gray-800 p-3 flex items-center justify-between ">
            <h2 className="text-red-600">You Closed This Chat</h2>
            <button
              disabled={openChatLoading}
              onClick={handleOpenChat}
              className="bg-green-700 px-2 py-1 rounded font-semibold hover:bg-green-600 transition-all duration-300 cursor-pointer"
            >
              Open Chat
            </button>
          </div>
        )
      )}
      <Modal
        isModalOpen={isDeleteChatModalOpen}
        onClose={() => setDeleteChatModalOpen(false)}
      >
        <DeleteChatForm
          onClose={() => setDeleteChatModalOpen(false)}
          handleDeleteChat={handleDeleteChat}
          deleteChatLoading={deleteChatLoading}
        />
      </Modal>
    </div>
  );
};
export default OperatorChatTab;
