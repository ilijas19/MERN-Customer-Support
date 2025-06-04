import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import Loader from "../Loader";
import type { getChatMessagesRes, Message as MessageType } from "../../types";
import Message from "./Message";
import { useEffect, useRef } from "react";

type MessageContainerProps = {
  chatMessages: getChatMessagesRes | undefined;
  messagesLoading: boolean;
  showingMessages: MessageType[];
  messagesPage: number;
  setMessagesPage: (num: number) => void;
};

const MessageContainer = ({
  chatMessages,
  messagesLoading,
  showingMessages,
  messagesPage,
  setMessagesPage,
}: MessageContainerProps) => {
  const { selectedChat } = useSelector((state: RootState) => state.chat);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [showingMessages, setShowingMessages] = useState<MessageType[]>([]);

  useEffect(() => {
    if (messagesPage === 1 && chatMessages) {
      setShowingMessages([]);
      setShowingMessages([...chatMessages.messages].reverse());
    }
    if (messagesPage > 1 && chatMessages) {
      const newMessages = [...chatMessages.messages].reverse();
      setShowingMessages((prev) => [...newMessages, ...prev]);
    }
  }, [chatMessages, messagesPage]);

  useEffect(() => {
    if (messagesPage === 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [showingMessages, messagesPage]);

  return (
    <ul className="overflow-y-auto flex flex-col gap-4 p-4 h-[calc(100vh-11.2rem)] custom-scrollbar">
      {/* no  selecte chat */}
      {!selectedChat && (
        <h2 className="text-center text-gray-500">
          Start or Join an Existing Chat!
        </h2>
      )}

      {messagesLoading && <Loader />}

      {/* no messages */}
      {selectedChat && chatMessages && chatMessages.messages.length === 0 && (
        <h2 className="text-center text-gray-500">No messages yet</h2>
      )}
      {/* Load older messages button */}
      {chatMessages?.hasNextPage && selectedChat && (
        <button
          onClick={() => setMessagesPage(messagesPage + 1)}
          disabled={messagesLoading}
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
          />
        ))}
      <div ref={messagesEndRef} />
    </ul>
  );
};
export default MessageContainer;
