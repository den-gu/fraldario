import nodemailer from "nodemailer"

const email = process.env.EMAIL;
const password = process.env.EMAIL_PASS;

export const transporter = nodemailer.createTransport({
    // host: "smtp.ethereal.email",
    service: "gmail",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: email,
      pass: password,
    },
  });

export const mailOptions = {
    from: email,
    to: email
}