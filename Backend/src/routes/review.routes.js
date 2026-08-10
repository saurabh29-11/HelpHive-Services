import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createReview, getHelperReviews } from "../controllers/review.controller.js";

const router = Router();

// Public route to get reviews for a helper
router.route("/helper/:helperId").get(getHelperReviews);

// Protected route to create a review
router.route("/").post(verifyJWT, createReview);

export default router;