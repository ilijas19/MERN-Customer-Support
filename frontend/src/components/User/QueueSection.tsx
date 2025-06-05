import { IoIosAlert } from "react-icons/io";
import type { ApiError } from "../../utils/isApiError";
import type { Socket } from "socket.io-client";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import type { SocketUser } from "../../types";

type QueueProps = {
  error: ApiError;
  socket: Socket;
  connected: boolean;
};

const QueueSection = ({ error, socket, connected }: QueueProps) => {
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const [usersInQueue, setUsersInQueue] = useState<number>(0);
  const [inQueue, setInQueue] = useState<boolean>(false);

  const handleQueueJoin = () => {
    socket.emit("joinQueue", { ...currentUser, socketId: socket.id });
    setInQueue(true);
  };

  useEffect(() => {
    if (socket && connected) {
      socket.emit("getQueueUsers", (data: SocketUser[]) => {
        setUsersInQueue(data.length);
      });

      socket.on("updateQueue", (data: SocketUser[]) => {
        setUsersInQueue(data.length);
      });
    }
  }, [socket, connected]);

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
            {inQueue ? (
              <h2 className="text-green-600 mt-3 not-sm:text-sm px-1 text-center">
                Queue Joined, Operator Will Open Your Chat as Soon it's Possible
              </h2>
            ) : (
              <button
                onClick={handleQueueJoin}
                className=" bg-emerald-600 mt-4 px-2 py-1 rounded-lg cursor-pointer hover:bg-emerald-700 transition-colors"
              >
                Join Operator Queue
              </button>
            )}
            <p className="text-gray-400 mt-2">
              Users in queue : {usersInQueue}
            </p>
          </>
        )}
      </div>
    </section>
  );
};
export default QueueSection;
