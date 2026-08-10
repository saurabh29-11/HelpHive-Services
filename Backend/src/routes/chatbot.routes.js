import { Router } from "express";
import { queryChatbot } from "../controllers/chatbot.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// This route can be public, but you could add verifyJWT if you only want logged-in users to use it.
router.route("/query").post(queryChatbot);

export default router;