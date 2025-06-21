import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  isAnonymous: { type: Boolean, default: false }
});

export default mongoose.model("User", userSchema);
