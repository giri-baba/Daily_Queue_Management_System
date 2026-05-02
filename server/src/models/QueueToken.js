import mongoose from "mongoose";

const queueTokenSchema = new mongoose.Schema(
  {
    tokenNumber: { type: String, required: true, unique: true },
    queueName: { type: String, default: "general" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    collectedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["Waiting", "Serving", "Completed", "Skipped", "Cancelled", "Forwarded", "Rescheduled"],
      default: "Waiting"
    },
    qrCode: { type: String },
    counterNumber: { type: Number, default: 1 },
    estimatedWaitMinutes: { type: Number, default: 10 },
    scheduledFor: { type: Date },
    forwardedToDepartment: { type: String },
    note: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("QueueToken", queueTokenSchema);
