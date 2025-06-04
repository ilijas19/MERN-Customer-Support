import { useGetSingleChatQuery } from "../redux/api/adminApiSlice";
import type { User } from "../types";
import Loader from "./Loader";

type Props = {
  user: User;
};

const UserActiveChat = ({ user }: Props) => {
  const { data: chat, isLoading } = useGetSingleChatQuery(
    user.joinedChat ?? "",
    { skip: !user.joinedChat }
  );
  console.log(chat);

  if (isLoading) {
    return <Loader />;
  }
  if (!chat) {
    return <h2 className="text-gray-400">User has no active chat</h2>;
  }
  return (
    <div key={chat._id} className="bg-gray-700 p-3 rounded-lg flex gap-3">
      <img src={chat.user.profilePicture} className="size-12 rounded-full" />
      <div>
        <h3 className="font-semibold text-sky-600">{chat.operator.fullName}</h3>
        <p className="text-sm text-gray-400">
          {chat.lastMessage ? (
            <>
              {chat.lastMessage.sender.fullName}:{" "}
              {chat.lastMessage.type === "image"
                ? "Image"
                : chat.lastMessage.text}
            </>
          ) : (
            "No Messages"
          )}
        </p>
      </div>
      <p
        className={`self-center ml-auto ${
          chat.isActive ? "text-sky-600" : "text-red-600"
        }`}
      >
        {chat.isActive ? "Active" : "Closed"}
      </p>
    </div>
  );
};
export default UserActiveChat;
