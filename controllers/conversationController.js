import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

export const createConversation = async (req, res) => {
    try {
        const { receiverId } = req.body;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            });
        }

        // Messages bhi saath me fetch karo - ek hi round trip
        const messages = await Message.find({
            conversationId: conversation._id
        }).populate("sender", "name").sort({ createdAt: 1 });

        res.json({ conversation, messages });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};