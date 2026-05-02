import mongoose from "mongoose";

const relationshipSchema = new mongoose.Schema(
  {
    requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    relatedPerson: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    relationType: { type: String, enum: ["Friend", "Relative"], required: true },
    otp: { type: String, required: true },
    otpExpiresAt: { type: Date, required: true },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" }
  },
  { timestamps: true }
);

export default mongoose.model("Relationship", relationshipSchema);
