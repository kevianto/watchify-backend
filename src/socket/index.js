export const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 New socket connection:", socket.id);

    // ✅ Join a room
    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      console.log(`👥 Socket ${socket.id} joined room ${roomId}`);
    });

    // ✅ Leave a room
    socket.on("leave-room", (roomId) => {
      socket.leave(roomId);
      console.log(`🚪 Socket ${socket.id} left room ${roomId}`);
    });

    // ✅ Video sync controls
    socket.on("video-control", ({ roomId, action, currentTime }) => {
      console.log(`🎬 Video control received: ${action} | Room: ${roomId} | Time: ${currentTime ?? "N/A"}`);

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
          console.warn(`⚠️ Unknown video control action: ${action}`);
      }
    });

    // ✅ Real-time chat messaging
    socket.on("send-message", ({ roomId, sender, text, isAnonymous }) => {
      if (!roomId || !sender || !text) {
        console.warn("⚠️ Missing message data:", { roomId, sender, text });
        return;
      }

      const messagePayload = { sender, text, isAnonymous };
      console.log(`💬 Message from ${sender} in room ${roomId}:`, text);
      io.to(roomId).emit("receive-message", messagePayload);
    });

    // ✅ Handle disconnection
    socket.on("disconnect", () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });
};
