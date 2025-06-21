import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  roomId: String,
  hostId: String,
   users: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
}],
  videoUrl: String,
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

export default mongoose.model("Room", roomSchema);
