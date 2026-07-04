import Conversation from "../models/Conversation.js";

export const createConversation =
async (req, res) => {

    try {

        const { receiverId } = req.body;

        const senderId = req.user._id;

        let conversation =
        await Conversation.findOne({

            participants: {
                $all: [
                    senderId,
                    receiverId
                ]
            }

        });

        if (conversation) {

            return res.json(
                conversation
            );

        }

        conversation =
        await Conversation.create({

            participants: [
                senderId,
                receiverId
            ]

        });

        res.status(201).json(
            conversation
        );

    } catch (error) {

        res.status(500).json({

            message:
            error.message

        });

    }

};