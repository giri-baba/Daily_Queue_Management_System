import Feedback from "../models/Feedback.js";
import { createAuditLog } from "../utils/audit.js";

export const createFeedback = async (req, res) => {
  const feedback = await Feedback.create({
    user: req.user._id,
    token: req.body.token,
    rating: req.body.rating,
    message: req.body.message
  });

  await createAuditLog(req.user, "CREATE_FEEDBACK", `Rating ${req.body.rating}`);
  res.status(201).json(feedback);
};

export const getFeedback = async (req, res) => {
  const feedback = await Feedback.find()
    .populate("user", "name email")
    .populate("token", "tokenNumber")
    .sort({ createdAt: -1 });
  res.json(feedback);
};
