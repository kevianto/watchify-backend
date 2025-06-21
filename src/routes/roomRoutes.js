import express from "express";
import {
  createRoom,
  joinRoom,
  leaveRoom,
  destroyRoom,
  getRoomInfo
} from "../controllers/roomController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createRoom);
router.post("/join", protect, joinRoom);
router.post("/leave", protect, leaveRoom);
router.delete("/:roomId", protect, destroyRoom);
router.get("/:roomId", protect, getRoomInfo);

export default router;
