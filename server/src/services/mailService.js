import nodemailer from "nodemailer";

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const hasRealEmailConfig = () => {
  return (
    process.env.EMAIL_USER &&
    process.env.EMAIL_PASS &&
    !process.env.EMAIL_USER.startsWith("your_") &&
    !process.env.EMAIL_PASS.startsWith("your_")
  );
};



export const sendOtpEmail = async ({ to, name, otp, purpose }) => {
  if (!hasRealEmailConfig()) {
    console.log(`[Email OTP Demo] ${purpose} OTP for ${to}: ${otp}`);
    return;
  }

  const transporter = createTransporter();

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject: `Smart DQMS ${purpose} OTP`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.5">
        <h2>Smart DQMS Verification</h2>
        <p>Hello ${name || "User"},</p>
        <p>Your OTP for <strong>${purpose}</strong> is:</p>
        <h1 style="letter-spacing:4px">${otp}</h1>
        <p>This OTP expires in 10 minutes. Do not share it with anyone.</p>
      </div>
    `
  });
};
