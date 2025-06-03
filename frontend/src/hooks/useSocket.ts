import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { ORIGIN_URL } from "../redux/constants";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

let socket: Socket;

const useSocket = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    socket = io(ORIGIN_URL);

    socket.on("connect", () => {
      setConnected(true);

      socket.emit("joined", { ...currentUser, socketId: socket.id });
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUser]);

  return { socket, connected };
};

export default useSocket;
