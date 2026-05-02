import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    role: { type: String },
    action: { type: String, required: true },
    details: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("AuditLog", auditLogSchema);
