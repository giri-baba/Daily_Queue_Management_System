import express from "express";
import { getAuditLogs } from "../controllers/auditController.js";
import { allowRoles, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, allowRoles("Admin"), getAuditLogs);

export default router;
