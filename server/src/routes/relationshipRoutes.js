import express from "express";
import {
  addRelationship,
  getMyRelationships,
  verifyRelationshipOtp
} from "../controllers/relationshipController.js";
import { protect } from "../middleware/authMiddleware.js";
import { requireEmailVerified } from "../middleware/verificationMiddleware.js";

const router = express.Router();

router.get("/", protect, getMyRelationships);
router.post("/", protect, requireEmailVerified, addRelationship);
router.post("/verify", protect, verifyRelationshipOtp);

export default router;
