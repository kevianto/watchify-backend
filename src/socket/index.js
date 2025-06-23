export const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("New socket connection");

    // Join a room
    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    // Leave a room
    socket.on("leave-room", (roomId) => {
      socket.leave(roomId);
      console.log(`Socket ${socket.id} left room ${roomId}`);
    });

    // Handle video control actions from the frontend
    socket.on("video-control", ({ roomId, action, currentTime }) => {
      console.log(`Video action: ${action} in room: ${roomId}`);

      switch (action) {
        case "play":
          socket.to(roomId).emit("play");
          break;
        case "pause":
          socket.to(roomId).emit("pause");
          break;
        case "seek":
          socket.to(roomId).emit("seek", { time: currentTime });
          break;
        default:
          console.warn(`Unknown action: ${action}`);
      }
    });

    // Real-time chat messaging
    socket.on("send-message", ({ roomId, message }) => {
    io.to(roomId).emit("receive-message", message);

    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`Socket ${socket.id} disconnected`);
    });
  });
};
