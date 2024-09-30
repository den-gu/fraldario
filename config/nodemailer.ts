import nodemailer from "nodemailer"

// const email = process.env.EMAIL;
// const password = process.env.EMAIL_PASS;

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: "gmail",
    port: 465, // 587
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

export const mailOptions = {
    from: process.env.EMAIL,
    to: process.env.EMAIL
}