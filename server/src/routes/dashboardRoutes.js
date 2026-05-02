import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { allowRoles, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, allowRoles("Admin", "Manager", "Staff"), getDashboardStats);

export default router;
