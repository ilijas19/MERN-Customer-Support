import { addUser, removeUser, getUser, getAllUsers } from "./userTracker.js";
import {
  addToQueue,
  removeFromQueue,
  getNextInQueue,
  getQueue,
} from "./queue.js";

const socketSetup = (io, socket) => {
  socket.on("joined", (currentUser) => {
    addUser(currentUser);
  });

  socket.on("getQueueUsers", () => {
    io.emit("updateQueue", getQueue());
  });

  socket.on("joinQueue", (currentUser) => {
    addToQueue(currentUser);
    io.emit("updateQueue", getQueue());
  });

  socket.on("startChat", (socketId) => {
    console.log(socketId);
    io.to(socketId).emit("operatorJoined");
  });

  socket.on("joinChat", (chatId) => {
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        socket.leave(room);
      }
    }
    socket.join(chatId);
    console.log(`Socket ${socket.id} joined room ${chatId}`);
  });

  socket.on("messageFromClient", (data) => {
    const message = {
      _id: Math.random().toString(),
      chat: data.chatId,
      sender: {
        fullName: data.from.fullName,
        profilePicture: data.from.profilePicture,
        _id: data.from.userId,
      },
      type: data.imageUrl ? "image" : "message",
      read: false,
      text: data.text,
      imageUrl: data.imageUrl || undefined,
      createdAt: new Date(),
    };

    io.to(data.chatId).emit("messageFromServer", message);
  });

  socket.on("closeChat", (userId) => {
    const user = getUser(userId);
    io.to(user.socketId).emit("closeChat");
  });

  socket.on("leaveQueue", () => {
    removeFromQueue(socket.id);
    io.emit("updateQueue", getQueue());
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    removeFromQueue(socket.id);

    io.emit("updateQueue", getQueue());
  });
};

export default socketSetup;
