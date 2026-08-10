import { Router } from 'express';
import { markAttendance, getBookingAttendance } from '../controllers/attendance.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();
router.use(verifyJWT);

router.route("/mark").post(markAttendance);
router.route("/booking/:bookingId").get(getBookingAttendance);

export default router;
