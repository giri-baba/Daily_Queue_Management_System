import User from "../models/User.js";
import Relationship from "../models/Relationship.js";
import { generateOtp } from "../utils/generateOtp.js";
import { createAuditLog } from "../utils/audit.js";

export const addRelationship = async (req, res) => {
  const { email, relationType } = req.body;
  const relatedPerson = await User.findOne({ email });

  if (!relatedPerson) return res.status(404).json({ message: "User not found with this email" });
  if (relatedPerson._id.toString() === req.user._id.toString()) {
    return res.status(400).json({ message: "You cannot add yourself" });
  }

  const otp = generateOtp();
  const relationship = await Relationship.create({
    requester: req.user._id,
    relatedPerson: relatedPerson._id,
    relationType,
    otp,
    otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000)
  });

  // Demo-friendly OTP. In production, send this by SMS or email using OTP_API_KEY/EMAIL_USER.
  await createAuditLog(req.user, "ADD_RELATIONSHIP", `OTP generated for ${email}`);
  res.status(201).json({
    message: "Relationship request created. Share this OTP with the related person.",
    relationshipId: relationship._id,
    demoOtp: otp
  });
};

export const verifyRelationshipOtp = async (req, res) => {
  const { relationshipId, otp } = req.body;
  const relationship = await Relationship.findById(relationshipId);

  if (!relationship) return res.status(404).json({ message: "Relationship request not found" });
  if (relationship.relatedPerson.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Only the related person can approve this request" });
  }
  if (relationship.otp !== otp || relationship.otpExpiresAt < new Date()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  relationship.status = "Approved";
  await relationship.save();

  await createAuditLog(req.user, "VERIFY_RELATIONSHIP", "Relationship approved by OTP");
  res.json({ message: "Relationship approved", relationship });
};

export const getMyRelationships = async (req, res) => {
  const relationships = await Relationship.find({
    $or: [{ requester: req.user._id }, { relatedPerson: req.user._id }]
  })
    .populate("requester", "name email")
    .populate("relatedPerson", "name email")
    .sort({ createdAt: -1 });

  res.json(relationships);
};
