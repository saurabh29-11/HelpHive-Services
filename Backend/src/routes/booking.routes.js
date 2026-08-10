import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    createBooking,
    getReceivedBookings,
    getSentBookings,
    updateBookingStatus,
    cancelBooking,
} from "../controllers/booking.controller.js"; // We will create this controller next

const router = Router();

// Apply verifyJWT middleware to all routes in this file
router.use(verifyJWT);

router.route("/").post(createBooking);

router.route("/sent").get(getSentBookings);
router.route("/received").get(getReceivedBookings);

router.route("/:bookingId/status").patch(updateBookingStatus);
router.route("/:bookingId/cancel").patch(cancelBooking);

export default router;