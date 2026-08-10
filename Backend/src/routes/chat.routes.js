import { Router } from 'express';
import { sendMessage, getChatHistory } from '../controllers/chat.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();
router.use(verifyJWT);

router.route("/send").post(sendMessage);
router.route("/booking/:bookingId").get(getChatHistory);

export default router;
