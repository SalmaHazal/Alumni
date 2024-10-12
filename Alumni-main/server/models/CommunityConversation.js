import mongoose from "mongoose";

const communityConversationSchema = new mongoose.Schema(
  {
    messages: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Message",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const CommunityConversation = mongoose.model("CommunityConversation", communityConversationSchema);

export default CommunityConversation;
