import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

import ConnectToDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import { setupSocket } from "./socket/index.js";
dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {   cors: {
    origin: "http://localhost:5173/" || "https://watchify-seven.vercel.app/", // Replace with your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],}
}});

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/rooms", roomRoutes);

setupSocket(io);
// Handle socket connection
io.on("connection", (socket) => {
  console.log("⚡ A user connected:", socket.id);

  socket.on("createRoom", (roomData) => {
    console.log("Room created:", roomData);
    // Emit roomCreated or other events if needed
  });

  socket.on("disconnect", () => {
    console.log("🚪 User disconnected:", socket.id);
  });
});

app.listen(PORT, async () => {
  await ConnectToDB();
  console.log(`app running at http://localhost:${PORT}`);
});

