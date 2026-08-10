import { Router } from 'express';
import { 
    createRazorpayOrder, 
    verifyRazorpayPayment, 
    createEscrowPayment, 
    getBookingPayment, 
    updateEscrowStatus 
} from '../controllers/payment.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();
router.use(verifyJWT);

router.route("/razorpay/order").post(createRazorpayOrder);
router.route("/razorpay/verify").post(verifyRazorpayPayment);
router.route("/escrow").post(createEscrowPayment);
router.route("/booking/:bookingId").get(getBookingPayment);
router.route("/escrow/:paymentId").patch(updateEscrowStatus);

export default router;
