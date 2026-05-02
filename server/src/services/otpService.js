import bcrypt from "bcryptjs";
import crypto from "crypto";

export const OTP_EXPIRY_MINUTES = 10;
export const OTP_COOLDOWN_SECONDS = 60;
export const MAX_OTP_ATTEMPTS = 5;

export const generateOtp = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

export const saveOtpOnUser = async (user, otp, otpType) => {
  user.otp = await bcrypt.hash(otp, 10);
  user.otpType = otpType;
  user.otpExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
  user.failedOtpAttempts = 0;
  user.lastOtpSentAt = new Date();
  await user.save();
};

export const canSendOtp = (user) => {
  if (!user.lastOtpSentAt) return { allowed: true, waitSeconds: 0 };

  const secondsSinceLastOtp = Math.floor((Date.now() - user.lastOtpSentAt.getTime()) / 1000);
  const waitSeconds = OTP_COOLDOWN_SECONDS - secondsSinceLastOtp;

  return {
    allowed: waitSeconds <= 0,
    waitSeconds: Math.max(waitSeconds, 0)
  };
};

export const verifyStoredOtp = async (user, otp, otpType) => {
  if (!user.otp || !user.otpExpiry || user.otpType !== otpType) {
    return { valid: false, message: "No active OTP request found" };
  }

  if (user.otpExpiry < new Date()) {
    return { valid: false, message: "OTP expired. Please resend OTP." };
  }

  if (user.failedOtpAttempts >= MAX_OTP_ATTEMPTS) {
    return { valid: false, message: "Too many wrong attempts. Please resend OTP." };
  }

  const matched = await bcrypt.compare(otp, user.otp);

  if (!matched) {
    user.failedOtpAttempts += 1;
    await user.save();
    return { valid: false, message: "Invalid OTP" };
  }

  user.otp = undefined;
  user.otpExpiry = undefined;
  user.otpType = null;
  user.failedOtpAttempts = 0;
  await user.save();

  return { valid: true };
};

export const updateVerificationStatus = (user) => {
  user.verificationStatus = user.emailVerified ? "EmailVerified" : "Pending";
};
