import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    role: { type: String, enum: ["Admin", "Manager", "Staff", "User"], default: "User" },
    googleId: { type: String },
    isActive: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },
    otp: { type: String, select: false },
    otpExpiry: { type: Date, select: false },
    otpType: {
      type: String,
      enum: ["email_verification", "password_reset", null],
      default: null
    },
    failedOtpAttempts: { type: Number, default: 0 },
    lastOtpSentAt: { type: Date },
    verificationStatus: {
      type: String,
      enum: ["Pending", "EmailVerified"],
      default: "Pending"
    },
    twoFactorEnabled: { type: Boolean, default: false }
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.password === "google-login") return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);
