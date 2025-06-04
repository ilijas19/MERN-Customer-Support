import { useGetOperatorChatsQuery } from "../../redux/api/adminApiSlice";
import Loader from "../Loader";

type Props = {
  operatorId: string;
};

const OperatorChats = ({ operatorId }: Props) => {
  const { data: chats, isLoading } = useGetOperatorChatsQuery(operatorId);
  if (isLoading) {
    return <Loader />;
  }

  return (
    <ul className="flex flex-col gap-2">
      {chats?.map((chat) => (
        <li key={chat._id} className="bg-gray-700 p-3 rounded-lg flex gap-3">
          <img
            src={chat.user.profilePicture}
            className="size-12 rounded-full"
          />
          <div>
            <h3 className="font-semibold text-sky-600">{chat.user.fullName}</h3>
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
        </li>
      ))}
      {chats?.length === 0 && (
        <h3 className="text-lg text-gray-400">No Active Chats</h3>
      )}
    </ul>
  );
};
export default OperatorChats;
