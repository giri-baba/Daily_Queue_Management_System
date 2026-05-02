import AuditLog from "../models/AuditLog.js";

export const createAuditLog = async (user, action, details = "") => {
  await AuditLog.create({
    user: user?._id,
    role: user?.role,
    action,
    details
  });
};
