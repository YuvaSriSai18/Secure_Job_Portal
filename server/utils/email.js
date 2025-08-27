const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

async function sendVerificationEmail(email, token) {
  const verificationUrl = `${process.env.CLIENT_URL}/api/auth/verify/${token}`;

  const mailOptions = {
    from: `"Eraah" <${process.env.EMAIL_FROM || "noreply@eraah.com"}>`,
    to: email,
    subject: "Verify Your Email Address",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">Welcome to Eraah</h2>
        <p>Please click the button below to verify your email address:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email</a>
        </div>
        <p>If you can't click the button, copy and paste this link into your browser:</p>
        <p><a href="${verificationUrl}">${verificationUrl}</a></p>
        <p style="margin-top: 30px; font-size: 12px; color: #6b7280;">This link will expire in 24 hours.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

async function sendPasswordResetEmail(email, token) {
  const resetUrl = `${process.env.CLIENT_URL}/api/auth/reset-password/${token}`;
  const mailOptions = {
    from: `"Eraah" <${process.env.EMAIL_FROM || "noreply@eraah.com"}>`,
    to: email,
    subject: "Reset your password",
    html: `<p>Click here to reset: <a href="${resetUrl}">${resetUrl}</a></p>`,
  };
  await transporter.sendMail(mailOptions);
}

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
