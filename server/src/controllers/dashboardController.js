import User from "../models/User.js";
import QueueToken from "../models/QueueToken.js";
import Feedback from "../models/Feedback.js";
import Relationship from "../models/Relationship.js";

export const getDashboardStats = async (req, res) => {
  const [
    users,
    staff,
    managers,
    waiting,
    serving,
    completed,
    skipped,
    cancelled,
    forwarded,
    rescheduled,
    feedback,
    relationships
  ] =
    await Promise.all([
      User.countDocuments({ role: "User" }),
      User.countDocuments({ role: "Staff" }),
      User.countDocuments({ role: "Manager" }),
      QueueToken.countDocuments({ status: "Waiting" }),
      QueueToken.countDocuments({ status: "Serving" }),
      QueueToken.countDocuments({ status: "Completed" }),
      QueueToken.countDocuments({ status: "Skipped" }),
      QueueToken.countDocuments({ status: "Cancelled" }),
      QueueToken.countDocuments({ status: "Forwarded" }),
      QueueToken.countDocuments({ status: "Rescheduled" }),
      Feedback.countDocuments(),
      Relationship.countDocuments({ status: "Approved" })
    ]);

  res.json({
    users,
    staff,
    managers,
    waiting,
    serving,
    completed,
    skipped,
    cancelled,
    forwarded,
    rescheduled,
    feedback,
    relationships
  });
};
