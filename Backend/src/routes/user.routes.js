import { Router } from "express";
import { 
    loginUser, 
    logoutUser, 
    registerUser, 
    refreshAccessToken,
    updateUserProfile, // Renamed from updateWorkerProfile
    updateVerificationDocuments, // Add this import
    getCurrentUser
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([{ name: "profileImage", maxCount: 1 }]),
  registerUser
);

router.route("/login").post(loginUser);

// --- Secured Routes ---
router.use(verifyJWT);

router.route("/logout").post(logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/me").get(getCurrentUser);

// Generic route for any user (user or worker) to update their profile
router.route("/me/profile").patch(
    upload.fields([
        { name: "profileImage", maxCount: 1 },
        { name: "galleryImages", maxCount: 5 }
    ]),
    updateUserProfile
);

// New route specifically for a worker to upload verification documents
router.route("/me/verification-documents").patch(
    upload.fields([
        { name: "idProof", maxCount: 1 },
        { name: "policeVerification", maxCount: 1 },
        { name: "panCard", maxCount: 1 }
    ]),
    updateVerificationDocuments
);

export default router;