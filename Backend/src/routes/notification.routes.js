import { Router } from 'express';
import { getUserNotifications, markNotificationRead } from '../controllers/notification.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();
router.use(verifyJWT);

router.route("/").get(getUserNotifications);
router.route("/read").patch(markNotificationRead);

export default router;
