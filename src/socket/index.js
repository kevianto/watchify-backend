export const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("New socket connection");

    socket.on("join-room", (roomId) => {
      socket.join(roomId);
    });

    socket.on("play", (roomId) => {
      socket.to(roomId).emit("play");
    });

    socket.on("pause", (roomId) => {
      socket.to(roomId).emit("pause");
    });

    socket.on("seek", ({ roomId, time }) => {
      socket.to(roomId).emit("seek", { time });
    });

    socket.on("send-message", ({ roomId, message }) => {
      socket.to(roomId).emit("receive-message", message);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  });
};
