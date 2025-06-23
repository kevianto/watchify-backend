import express from "express";
import http from "http"; // ✅ Needed for raw server
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

import ConnectToDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import { setupSocket } from "./socket/index.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app); // ✅ Socket.IO attaches to *this* server

// ✅ CORS config
const allowedOrigins = [
  "http://localhost:5173",
  "https://watchify-seven.vercel.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());

// ✅ REST API routes
app.use("/auth", authRoutes);
app.use("/rooms", roomRoutes);

// ✅ Attach Socket.IO to HTTP server
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  }
});

// ✅ Setup custom socket logic
setupSocket(io);

// ✅ Optional: test route
app.get("/", (req, res) => {
  res.send("Watchify backend is running.");
});

// ✅ Start server
server.listen(PORT, async () => {
  await ConnectToDB();
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
