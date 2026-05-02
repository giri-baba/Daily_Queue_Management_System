import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: mongoose.Schema.Types.ObjectId, ref: "QueueToken" },
    rating: { type: Number, min: 1, max: 5, required: true },
    message: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);
