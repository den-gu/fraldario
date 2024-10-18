import nodemailer from "nodemailer"

const email = process.env.EMAIL;
const password = process.env.EMAIL_PASS;

export const transporter = nodemailer.createTransport({
    host: "mail.ofraldario.co.mz",
    port: 465,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: email,
      pass: password,
    },
    tls: {
      rejectUnauthorized: false,  // Accept self-signed certificates for dev
    },
    pool: true,  // Connection pooling enabled
    maxConnections: 5,  // Max connections allowed
    maxMessages: 100,  // Max messages per connection
    // dkim: {
    //   domainName: 'ofraldario.co.mz',
    //   keySelector: 'default',
    //   // privateKey: fs.readFileSync('/path/to/dkim-private-key.pem'),
    // },
    debug: true,  // Enable debugging
  });


export const mailOptions = {
    from: email,
    to: email
}