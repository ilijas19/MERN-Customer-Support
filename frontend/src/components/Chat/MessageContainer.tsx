import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import Loader from "../Loader";
import type { getChatMessagesRes, Message as MessageType } from "../../types";
import Message from "./Message";
import { useEffect, useRef, useState } from "react";
import type { Socket } from "socket.io-client";
import Modal from "../Modal";
import ImagePreview from "../ImagePreview";

type MessageContainerProps = {
  chatMessages: getChatMessagesRes | undefined;
  messagesLoading: boolean;
  messagesPage: number;
  setMessagesPage: (num: number) => void;
  socket: Socket | null;
};

const MessageContainer = ({
  chatMessages,
  messagesLoading,
  messagesPage,
  setMessagesPage,
  socket,
}: MessageContainerProps) => {
  const { selectedChat } = useSelector((state: RootState) => state.chat);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [showingMessages, setShowingMessages] = useState<MessageType[]>([]);
  const [isPreviewModalOpen, setPreviewModalOpen] = useState<boolean>(false);
  const [selectedImgUrl, setSelectedImgUrl] = useState<string>("");

  // Reset messages when chat changes
  useEffect(() => {
    setShowingMessages([]);
  }, [selectedChat?._id]);

  useEffect(() => {
    if (!chatMessages) return;

    const newMessages = [...chatMessages.messages].reverse();

    if (messagesPage === 1) {
      setShowingMessages(newMessages);
    } else {
      setShowingMessages((prev) => {
        const existingIds = new Set(prev.map((m) => m._id));
        const filteredNew = newMessages.filter((m) => !existingIds.has(m._id));
        return [...filteredNew, ...prev];
      });
    }
  }, [chatMessages, messagesPage]);

  useEffect(() => {
    if (selectedChat && messagesPage === 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [showingMessages, messagesPage, selectedChat]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: MessageType) => {
      //  new message to the state
      setShowingMessages((prev) => {
        if (prev.some((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });
    };

    socket.on("messageFromServer", handleNewMessage);

    return () => {
      socket.off("messageFromServer", handleNewMessage);
    };
  }, [socket]);

  return (
    <ul className="overflow-y-auto flex flex-col gap-4 p-4 h-[calc(100vh-11.2rem)] custom-scrollbar">
      {!selectedChat && (
        <h2 className="text-center text-gray-500">
          Start or Join an Existing Chat!
        </h2>
      )}
      {messagesLoading && <Loader />}

      {chatMessages?.hasNextPage && selectedChat && (
        <button
          onClick={() => setMessagesPage(messagesPage + 1)}
          disabled={messagesLoading || !chatMessages?.hasNextPage}
          className="bg-gray-700 w-fit self-center px-3 py-1 rounded-lg cursor-pointer hover:bg-gray-600 transition-all duration-300 disabled:opacity-50"
        >
          {messagesLoading ? "Loading..." : "Load older messages"}
        </button>
      )}

      {selectedChat &&
        !messagesLoading &&
        showingMessages.map((message) => (
          <Message
            message={message}
            key={message._id}
            currentUserId={currentUser!.userId}
            setPreviewModalOpen={setPreviewModalOpen}
            setSelectedImgUrl={setSelectedImgUrl}
          />
        ))}

      <div ref={messagesEndRef} />
      <Modal
        isModalOpen={isPreviewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
      >
        <ImagePreview
          onClose={() => setPreviewModalOpen(false)}
          selectedImgUrl={selectedImgUrl}
        />
      </Modal>
    </ul>
  );
};

export default MessageContainer;
