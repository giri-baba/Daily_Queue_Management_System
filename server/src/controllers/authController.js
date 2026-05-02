import passport from "passport";
import User from "../models/User.js";
import Staff from "../models/Staff.js";
import generateToken from "../utils/generateToken.js";
import { createAuditLog } from "../utils/audit.js";
import { maskEmail } from "../utils/mask.js";
import {
  canSendOtp,
  generateOtp,
  saveOtpOnUser,
  updateVerificationStatus,
  verifyStoredOtp
} from "../services/otpService.js";
import { sendOtpEmail } from "../services/mailService.js";

const sendUserResponse = (res, user, statusCode = 200) => {
  res.status(statusCode).json({
    token: generateToken(user),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      emailVerified: user.emailVerified,
      verificationStatus: user.verificationStatus,
      twoFactorEnabled: user.twoFactorEnabled
    }
  });
};

export const signup = async (req, res) => {
  const { name, email, password, phone, role = "User", department, counterNumber } = req.body;

  const allowedSignupRoles = ["User", "Staff"];
  if (!allowedSignupRoles.includes(role)) {
    return res.status(400).json({ message: "Only User and Staff signup is open" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: "Email already registered" });

  const user = await User.create({ name, email, password, phone, role });

  if (role === "Staff") {
    await Staff.create({
      user: user._id,
      department: department || "General",
      counterNumber: counterNumber || 1
    });
  }

  const otp = generateOtp();
  await saveOtpOnUser(user, otp, "email_verification");
  await sendOtpEmail({ to: user.email, name: user.name, otp, purpose: "Email Verification" });

  await createAuditLog(user, "SIGNUP", `${role} account created. Email OTP sent.`);
  res.status(201).json({
    message: "Signup successful. Please verify your email OTP before login.",
    email: user.email,
    maskedEmail: maskEmail(user.email),
    userId: user._id
  });
};

export const login = async (req, res) => {
  const { email, password, expectedRole } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  if (!user.emailVerified || !user.isActive) {
    return res.status(403).json({
      message: "Please verify your email OTP before login",
      email: user.email,
      maskedEmail: maskEmail(user.email)
    });
  }

  if (expectedRole && user.role !== expectedRole) {
    return res.status(403).json({ message: `Please use the ${user.role} login page` });
  }

  await createAuditLog(user, "LOGIN", `${user.role} logged in`);
  sendUserResponse(res, user);
};

export const createAdminOrManager = async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  if (!["Admin", "Manager"].includes(role)) {
    return res.status(400).json({ message: "Role must be Admin or Manager" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: "Email already registered" });

  const user = await User.create({
    name,
    email,
    password,
    phone,
    role,
    emailVerified: true,
    isActive: true,
    verificationStatus: "EmailVerified"
  });
  await createAuditLog(req.user, "CREATE_ROLE_USER", `Created ${role}: ${email}`);
  res.status(201).json({ message: `${role} created`, user });
};

export const verifyEmailOtp = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email }).select("+otp +otpExpiry");

  if (!user) return res.status(404).json({ message: "User not found" });

  const result = await verifyStoredOtp(user, otp, "email_verification");
  if (!result.valid) return res.status(400).json({ message: result.message });

  user.emailVerified = true;
  user.isActive = true;
  updateVerificationStatus(user);
  await user.save();

  await createAuditLog(user, "VERIFY_EMAIL", "Email verified by OTP");
  sendUserResponse(res, user);
};

export const resendEmailOtp = async (req, res) => {
  const { email, type = "email_verification" } = req.body;
  const user = await User.findOne({ email }).select("+otp +otpExpiry");

  if (!user) return res.status(404).json({ message: "User not found" });
  if (type === "email_verification" && user.emailVerified) {
    return res.status(400).json({ message: "Email already verified" });
  }

  const cooldown = canSendOtp(user);
  if (!cooldown.allowed) {
    return res.status(429).json({ message: `Please wait ${cooldown.waitSeconds} seconds before resending OTP` });
  }

  const otp = generateOtp();
  await saveOtpOnUser(user, otp, type);
  await sendOtpEmail({
    to: user.email,
    name: user.name,
    otp,
    purpose: type === "password_reset" ? "Password Reset" : "Email Verification"
  });

  res.json({ message: "OTP sent successfully", maskedEmail: maskEmail(user.email), waitSeconds: 60 });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email }).select("+otp +otpExpiry");

  if (!user) {
    return res.json({ message: "If this email exists, a reset OTP has been sent" });
  }

  const cooldown = canSendOtp(user);
  if (!cooldown.allowed) {
    return res.status(429).json({ message: `Please wait ${cooldown.waitSeconds} seconds before resending OTP` });
  }

  const otp = generateOtp();
  await saveOtpOnUser(user, otp, "password_reset");
  await sendOtpEmail({ to: user.email, name: user.name, otp, purpose: "Password Reset" });

  await createAuditLog(user, "FORGOT_PASSWORD", "Password reset OTP sent");
  res.json({ message: "If this email exists, a reset OTP has been sent", maskedEmail: maskEmail(email) });
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ email }).select("+otp +otpExpiry +password");

  if (!user) return res.status(404).json({ message: "User not found" });

  const result = await verifyStoredOtp(user, otp, "password_reset");
  if (!result.valid) return res.status(400).json({ message: result.message });

  user.password = newPassword;
  await user.save();

  await createAuditLog(user, "RESET_PASSWORD", "Password reset completed");
  res.json({ message: "Password reset successful. Please login with your new password." });
};

export const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json({ user });
};

export const getUsersVerificationStatus = async (req, res) => {
  const users = await User.find()
    .select("name email phone role emailVerified verificationStatus isActive createdAt")
    .sort({ createdAt: -1 });

  res.json(users);
};

export const googleLogin = passport.authenticate("google", {
  scope: ["profile", "email"],
  session: false
});

export const googleCallback = (req, res, next) => {
  passport.authenticate("google", { session: false }, (error, user) => {
    if (error || !user) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=google_login_failed`);
    }
    const token = generateToken(user);
    res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
  })(req, res, next);
};
