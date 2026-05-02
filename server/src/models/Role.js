import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, enum: ["Admin", "Manager", "Staff", "User"], unique: true },
    permissions: [{ type: String }]
  },
  { timestamps: true }
);

export default mongoose.model("Role", roleSchema);
