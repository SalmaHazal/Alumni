import Conversation from "../models/Conversation.js";

const getConversation = async (currentUserId) => {
  if (currentUserId) {
    const currentUserConversation = await Conversation.find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }],
    })
      .sort({ updatedAt: -1 })
      .populate("messages")
      .populate("sender")
      .populate("receiver");

    const conversation = currentUserConversation.map((conv) => {
      const countUnseenMsg = conv.messages.reduce((prev, current) => {
        const msgByUserId = current?.msgByUserId?.toString();
        if (msgByUserId !== currentUserId) {
          return prev + (current.seen ? 0 : 1);
        } else {
          return prev;
        }
      }, 0);
      return {
        _id: conv?._id,
        sender: conv?.sender,
        receiver: conv?.receiver,
        unseenMsg: countUnseenMsg,
        lastMsg: conv.messages[conv?.messages?.length - 1],
      };
    });

    return conversation;
  } else {
    return [];
  }
};

export default getConversation;
