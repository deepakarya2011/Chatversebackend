import Message from "../models/Message.js";

export const sendMessage =
    async (req, res) => {

        try {

            const {
                conversationId,
                text
            } = req.body;

            const message =
                await Message.create({

                    conversationId,

                    sender:
                        req.user._id,

                    text

                });

            const populatedMessage =
                await Message.findById(
                    message._id
                ).populate(
                    "sender",
                    "name"
                );

            res.status(201)
                .json(populatedMessage);

        } catch (error) {

            res.status(500).json({

                message:
                    error.message

            });

        }

    };

export const getMessages = async (req, res) => {

    try {

        const { conversationId } =
            req.params;

        const messages =
            await Message.find({
                conversationId
            })
                .populate("sender", "name")
                .sort({ createdAt: 1 });

        res.json(messages);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};