import express from "express";
import {
  callNextToken,
  cancelToken,
  completeToken,
  createToken,
  forwardToken,
  getMyTokens,
  getQueueStatus,
  rescheduleToken,
  skipToken
} from "../controllers/queueController.js";
import { allowRoles, protect } from "../middleware/authMiddleware.js";
import { requireEmailVerified } from "../middleware/verificationMiddleware.js";

const router = express.Router();

router.get("/", getQueueStatus);
router.get("/mine", protect, getMyTokens);
router.post("/", protect, allowRoles("User"), requireEmailVerified, createToken);
router.patch("/next", protect, allowRoles("Admin", "Manager", "Staff"), callNextToken);
router.patch("/:id/complete", protect, allowRoles("Admin", "Manager", "Staff"), completeToken);
router.patch("/:id/skip", protect, allowRoles("Admin", "Manager", "Staff"), skipToken);
router.patch("/:id/cancel", protect, allowRoles("Admin", "Manager", "Staff", "User"), cancelToken);
router.patch("/:id/reschedule", protect, allowRoles("Admin", "Manager", "Staff", "User"), rescheduleToken);
router.patch("/:id/forward", protect, allowRoles("Admin", "Manager", "Staff"), forwardToken);

export default router;
