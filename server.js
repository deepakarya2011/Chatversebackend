import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import connectDB from "./config/db.js";
import messageRoutes from "./routes/messageRoutes.js";

import authRoutes from "./routes/authRoutes.js";
import protect from "./middleware/authMiddleware.js";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

connectDB();

const app = express();

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/profile", protect, (req, res) => {

    res.json({
        message: "Welcome Deepak"
    });

});

app.use(
    "/api/messages",
    messageRoutes
);

app.use("/api/users", userRoutes);

app.use(
    "/api/conversations",
    conversationRoutes
);

app.get("/", (req, res) => {
    res.send("Server Running");
});

io.on("connection", (socket) => {

    console.log(
        "User Connected:",
        socket.id
    );

    socket.on("join", (userId) => {

        socket.join(userId);

        console.log(
            `${userId} joined room`
        );

    });

    socket.on(
        "sendMessage",
        (messageData) => {

            io.to(
                messageData.receiverId
            ).emit(
                "receiveMessage",
                messageData
            );

        }
    );

    socket.on("disconnect", () => {

        console.log(
            "User Disconnected:",
            socket.id
        );

    });

});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {

    console.log(`Server Running On Port ${PORT}`);

});

export default app;