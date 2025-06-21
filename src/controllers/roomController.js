import Room from "../models/Room.js";
import { v4 as uuidv4 } from "uuid";
import User from "../models/User.js";

export const createRoom = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.isAnonymous) {
      return res.status(403).json({ error: "Anonymous users are not allowed to create rooms." });
    }

    const roomId = uuidv4();

    const room = await Room.create({
      roomId,
      hostId: req.user.id,
      users: [req.user.id],
      videoUrl: req.body.videoUrl
    });

    res.status(201).json(room);

  } catch (error) {
    console.error("CreateRoom Error:", error);
    res.status(500).json({ error: "Failed to create room" });
  }
};

export const joinRoom = async (req, res) => {
  try {
    const { roomId } = req.body;
    const room = await Room.findOne({ roomId });
    if (!room) return res.status(404).json({ error: "Room not found" });

    if (!room.users.includes(req.user.id)) {
      room.users.push(req.user.id);
      await room.save();
    }
    res.json({ message: "Joined room" });
  } catch (error) {
    console.error("JoinRoom Error:", error);
    res.status(500).json({ error: "Failed to join room" });
  }
};

export const leaveRoom = async (req, res) => {
  try {
    const { roomId } = req.body;

    // 1. Find the room
    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // 2. Remove user from the room
    room.users = room.users.filter(id => id.toString() !== req.user.id);
    await room.save();

    // 3. Delete anonymous user from DB if needed
    const user = await User.findById(req.user.id);
    if (user?.isAnonymous) {
      await User.findByIdAndDelete(req.user.id);
    }

    res.json({ message: "Left room. Anonymous user removed if applicable." });

  } catch (error) {
    console.error("LeaveRoom Error:", error);
    res.status(500).json({ error: "Failed to leave room" });
  }
};

export const destroyRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    if (room.hostId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Only the host can destroy the room" });
    }

    // 3. Check if host is anonymous and delete their account
    const host = await User.findById(room.hostId);
    if (host?.isAnonymous) {
      await User.findByIdAndDelete(host._id);
    }

    // 4. Delete the room
    await Room.deleteOne({ roomId });

    res.json({ message: "Room destroyed. Anonymous host removed if applicable." });

  } catch (error) {
    console.error("DestroyRoom Error:", error);
    res.status(500).json({ error: "Failed to destroy room" });
  }
};

export const getRoomInfo = async (req, res) => {
  try {
    const { roomId } = req.params;

    // Populate users with username and email
    const room = await Room.findOne({ roomId }).populate({
      path: 'users',
      select: 'username email'
    });

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    res.json(room);
  } catch (error) {
    console.error("GetRoomInfo Error:", error);
    res.status(500).json({ error: "Failed to get room info" });
  }
};
