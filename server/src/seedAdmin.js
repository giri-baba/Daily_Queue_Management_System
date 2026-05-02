import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import User from "./models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../.env") });

const seedAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const existingAdmin = await User.findOne({ role: "Admin" });
  if (existingAdmin) {
    existingAdmin.isActive = true;
    existingAdmin.emailVerified = true;
    existingAdmin.verificationStatus = "EmailVerified";
    await existingAdmin.save();
    console.log("Admin already exists:", existingAdmin.email);
    console.log("Admin verification flags updated");
    await mongoose.disconnect();
    return;
  }

  await User.create({
    name: "System Admin",
    email: "admin@dqms.com",
    password: "Admin@123",
    phone: "9999999999",
    role: "Admin",
    isActive: true,
    emailVerified: true,
    verificationStatus: "EmailVerified"
  });

  console.log("Admin created");
  console.log("Email: admin@dqms.com");
  console.log("Password: Admin@123");
  await mongoose.disconnect();
};

seedAdmin().catch((error) => {
  console.error(error);
  process.exit(1);
});
