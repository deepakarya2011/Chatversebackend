import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
    createConversation
}
from "../controllers/conversationController.js";

const router =
express.Router();

router.post(
    "/",
    protect,
    createConversation
);

export default router;