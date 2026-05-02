import express from "express";
import { createFeedback, getFeedback } from "../controllers/feedbackController.js";
import { allowRoles, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, allowRoles("User"), createFeedback);
router.get("/", protect, allowRoles("Admin", "Manager"), getFeedback);

export default router;
