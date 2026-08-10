import { Router } from 'express';
import { 
    smartMatchmaking, 
    generateBio, 
    summarizeReviews, 
    scanDocumentOCR 
} from '../controllers/ai.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Public / Semi-public AI routes
router.route("/match").post(smartMatchmaking);
router.route("/summary/:helperId").get(summarizeReviews);

// Secured AI routes
router.route("/generate-bio").post(verifyJWT, generateBio);
router.route("/verify-doc").post(verifyJWT, scanDocumentOCR);

export default router;
