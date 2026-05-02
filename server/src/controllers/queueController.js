import QRCode from "qrcode";
import QueueToken from "../models/QueueToken.js";
import Relationship from "../models/Relationship.js";
import { createAuditLog } from "../utils/audit.js";
import { sendQueueUpdate } from "../socket.js";

const makeTokenNumber = async () => {
  const count = await QueueToken.countDocuments();
  return `DQMS-${String(count + 1).padStart(4, "0")}`;
};

export const createToken = async (req, res) => {
  const { queueName = "general", collectedBy } = req.body;

  if (collectedBy && collectedBy !== req.user._id.toString()) {
    const relation = await Relationship.findOne({
      requester: req.user._id,
      relatedPerson: collectedBy,
      status: "Approved"
    });

    if (!relation) {
      return res.status(403).json({ message: "Collector must be an approved friend or relative" });
    }
  }

  const tokenNumber = await makeTokenNumber();
  const qrPayload = JSON.stringify({
    tokenNumber,
    owner: req.user._id,
    collector: collectedBy || req.user._id
  });
  const qrCode = await QRCode.toDataURL(qrPayload);

  const token = await QueueToken.create({
    tokenNumber,
    queueName,
    user: req.user._id,
    collectedBy: collectedBy || req.user._id,
    qrCode
  });

  await createAuditLog(req.user, "CREATE_TOKEN", `Created token ${tokenNumber}`);
  sendQueueUpdate(queueName, { action: "CREATE_TOKEN", token });
  res.status(201).json(token);
};

export const getQueueStatus = async (req, res) => {
  const queueName = req.query.queueName || "general";
  const tokens = await QueueToken.find({ queueName })
    .populate("user", "name email")
    .populate("collectedBy", "name email")
    .sort({ createdAt: 1 });

  res.json(tokens);
};

export const getMyTokens = async (req, res) => {
  const tokens = await QueueToken.find({
    $or: [{ user: req.user._id }, { collectedBy: req.user._id }]
  }).sort({ createdAt: -1 });
  res.json(tokens);
};

export const callNextToken = async (req, res) => {
  const queueName = req.body.queueName || "general";

  await QueueToken.updateMany({ queueName, status: "Serving" }, { status: "Skipped" });

  const token = await QueueToken.findOneAndUpdate(
    { queueName, status: { $in: ["Waiting", "Rescheduled", "Forwarded", "Skipped"] } },
    { status: "Serving" },
    { new: true, sort: { createdAt: 1 } }
  );

  if (!token) return res.status(404).json({ message: "No waiting tokens found" });

  await createAuditLog(req.user, "NEXT_TOKEN", `Serving ${token.tokenNumber}`);
  sendQueueUpdate(queueName, { action: "NEXT_TOKEN", token });
  res.json(token);
};

const findTokenForUpdate = async (req, res, allowOwner = false) => {
  const token = await QueueToken.findById(req.params.id);

  if (!token) {
    res.status(404).json({ message: "Token not found" });
    return null;
  }

  if (allowOwner && token.user.toString() !== req.user._id.toString()) {
    res.status(403).json({ message: "You can update only your own token" });
    return null;
  }

  if (["Completed", "Cancelled"].includes(token.status)) {
    res.status(400).json({ message: `Token already ${token.status.toLowerCase()}` });
    return null;
  }

  return token;
};

export const completeToken = async (req, res) => {
  const token = await findTokenForUpdate(req, res);
  if (!token) return;

  token.status = "Completed";
  token.note = req.body.note || token.note || "Service completed";
  await token.save();
  await createAuditLog(req.user, "COMPLETE_TOKEN", `Completed ${token.tokenNumber}`);
  sendQueueUpdate(token.queueName, { action: "COMPLETE_TOKEN", token });
  res.json(token);
};

export const skipToken = async (req, res) => {
  const token = await findTokenForUpdate(req, res);
  if (!token) return;

  token.status = "Skipped";
  token.note = req.body.note || "Customer not available";
  await token.save();
  await createAuditLog(req.user, "SKIP_TOKEN", `Skipped ${token.tokenNumber}`);
  sendQueueUpdate(token.queueName, { action: "SKIP_TOKEN", token });
  res.json(token);
};

export const cancelToken = async (req, res) => {
  const isUser = req.user.role === "User";
  const token = await findTokenForUpdate(req, res, isUser);
  if (!token) return;

  token.status = "Cancelled";
  token.note = req.body.reason || "Cancelled";
  await token.save();

  await createAuditLog(req.user, "CANCEL_TOKEN", `Cancelled ${token.tokenNumber}`);
  sendQueueUpdate(token.queueName, { action: "CANCEL_TOKEN", token });
  res.json(token);
};

export const rescheduleToken = async (req, res) => {
  const isUser = req.user.role === "User";
  const token = await findTokenForUpdate(req, res, isUser);
  if (!token) return;

  if (!req.body.scheduledFor) {
    return res.status(400).json({ message: "New schedule date and time is required" });
  }

  token.status = "Rescheduled";
  token.scheduledFor = new Date(req.body.scheduledFor);
  token.note = req.body.note || "Token rescheduled";
  await token.save();

  await createAuditLog(req.user, "RESCHEDULE_TOKEN", `Rescheduled ${token.tokenNumber}`);
  sendQueueUpdate(token.queueName, { action: "RESCHEDULE_TOKEN", token });
  res.json(token);
};

export const forwardToken = async (req, res) => {
  const token = await findTokenForUpdate(req, res);
  if (!token) return;

  if (!req.body.department) {
    return res.status(400).json({ message: "Forward department is required" });
  }

  token.status = "Forwarded";
  token.forwardedToDepartment = req.body.department;
  token.note = req.body.note || `Forwarded to ${req.body.department}`;
  await token.save();

  await createAuditLog(req.user, "FORWARD_TOKEN", `Forwarded ${token.tokenNumber}`);
  sendQueueUpdate(token.queueName, { action: "FORWARD_TOKEN", token });
  res.json(token);
};
