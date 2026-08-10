import { Router } from "express";
import { getAllHelpers, getHelperProfile } from "../controllers/helper.controller.js";

const router = Router();

// Public routes, no authentication needed to browse helpers
router.route("/").get(getAllHelpers);
router.route("/:id").get(getHelperProfile);

export default router;