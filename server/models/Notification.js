
import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["message", "comment", "post", "like"], required: true },
    text: { type: String, required: true },
    link: { type: String, required: true },
    read: { type: Boolean, default: false },
    senderPhoto: { type: String }, 
    senderName: { type: String },   
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", NotificationSchema);

export default Notification;
