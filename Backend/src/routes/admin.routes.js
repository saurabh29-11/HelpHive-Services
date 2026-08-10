import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";
import {
    getAllUsers,
    getWorkerVerificationRequests,
    updateWorkerVerification,
    getWorkerDetails,
} from "../controllers/admin.controller.js"; // We will create this next

const router = Router();

router.use(verifyJWT, verifyAdmin);

router.route("/users").get(getAllUsers);
router.route("/verification-requests").get(getWorkerVerificationRequests);
router.route("/worker/:workerId").get(getWorkerDetails); // New route to get full details, including documents
router.route("/verify-worker/:workerId").patch(updateWorkerVerification);


export default router;