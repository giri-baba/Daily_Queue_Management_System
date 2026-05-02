import express from "express";
import {
  createAdminOrManager,
  forgotPassword,
  getProfile,
  getUsersVerificationStatus,
  googleCallback,
  googleLogin,
  login,
  resendEmailOtp,
  resetPassword,
  signup,
  verifyEmailOtp
} from "../controllers/authController.js";
import { allowRoles, protect } from "../middleware/authMiddleware.js";
import otpRateLimit from "../middleware/otpRateLimit.js";
import { requireFields } from "../middleware/validateRequest.js";

const router = express.Router();

router.post("/signup", requireFields("name", "email", "password"), signup);
router.post("/login", requireFields("email", "password"), login);
router.post("/verify-email", otpRateLimit, requireFields("email", "otp"), verifyEmailOtp);
router.post("/resend-email-otp", otpRateLimit, requireFields("email"), resendEmailOtp);
router.post("/forgot-password", otpRateLimit, requireFields("email"), forgotPassword);
router.post("/reset-password", otpRateLimit, requireFields("email", "otp", "newPassword"), resetPassword);
router.get("/profile", protect, getProfile);
router.get("/users/verification-status", protect, allowRoles("Admin"), getUsersVerificationStatus);
router.post("/admin-or-manager", protect, allowRoles("Admin"), createAdminOrManager);
router.get("/google", googleLogin);
router.get("/google/callback", googleCallback);

export default router;
