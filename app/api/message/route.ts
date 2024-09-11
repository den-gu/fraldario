import { mailOptions, transporter } from '@/config/nodemailer'
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';
import fs from 'fs';

export async function POST(req: Request) {
  try {
    // Parse the request body to extract form data
    const { subject, message, attachment } = await req.json();

    // Configure the Nodemailer transporter
    const updatedMailOptions = {
        ...mailOptions,
        to: "denilsondavid.me@gmail.com",
        // ...generateEmailContent({subject, message, attachment}),
        subject: subject,
        html: `
          <html>
            <body>
              <h1>New Ticket on Your Website</h1>
              <p>A new resume/cv has been submitted on example.com</p>
              <p>**Anexos:** ${attachment.name}</p>
            </body>
          </html>
        `,
        attachments: [
            {
              filename: attachment.name, // Name of the attachment
            //   content: new Buffer(attachment.data), // Content of the attachment (Base64 or Buffer)
              // stream as an attachment
              content: fs.createReadStream(`../../../uploads/${attachment.name}.${attachment.type}`),
              contentType: attachment.type, // MIME type of the attachment (e.g., 'application/pdf', 'image/jpeg')
            },
          ],
    };

    await transporter.sendMail(updatedMailOptions);

    // Send the email with the configured options
    // const info = await transporter.sendMail(mailOptions);

    // Respond with success message
    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (err) {
    // Respond with error message if something goes wrong
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}



// // pages/api/upload.ts
// import type { NextApiRequest, NextApiResponse } from 'next';
// import Busboy from 'busboy';
// import fs from 'fs';
// import path from 'path';
// import { createTransport } from 'nodemailer';

// const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

// export async function POST(req: NextApiRequest, res: NextApiResponse) {
//     if (req.method !== 'POST') {
//         return res.status(405).json({ message: 'Method not allowed' });
//     }

//     // @ts-ignore
//     const busboy = new Busboy({ headers: req.headers });
//     const fields: { [key: string]: any } = {};
//     let fileBuffer: Buffer | undefined;
//     let fileName: string | undefined;

//     // Handle form fields
//     busboy.on('field', (fieldname: any, val: any) => {
//         fields[fieldname] = val;
//     });

//     // Handle file upload
//     busboy.on('file', (fieldname: any, file: any, filename: any, encoding: any, mimetype: any) => {
//         fileName = filename;
//         const chunks: Buffer[] = [];
//         file.on('data', (chunk: any) => {
//             chunks.push(chunk);
//         });
//         file.on('end', () => {
//             fileBuffer = Buffer.concat(chunks);
//         });
//     });

//     busboy.on('finish', async () => {
//         if (!fileBuffer || !fileName) {
//             return res.status(400).json({ message: 'File or file name missing' });
//         }

//         // Convert Buffer to Base64
//         const fileBase64 = fileBuffer.toString('base64');

//         // Configure nodemailer
//         const transporter = createTransport({
//             service: 'gmail', // or another service
//             auth: {
//                 user: process.env.EMAIL_USER,
//                 pass: process.env.EMAIL_PASS,
//             },
//         });

//         const mailOptions = {
//             from: 'denilsondavid.me@gmail.com',
//             to: 'denilsondavid.me@gmail.com',
//             subject: fields.subject || 'No Subject',
//             text: fields.message || 'No Message',
//             attachments: [
//                 {
//                     filename: fileName,
//                     content: fileBase64,
//                     encoding: 'base64',
//                     contentType: 'application/octet-stream', // Set appropriate MIME type
//                 },
//             ],
//         };

//         try {
//             await transporter.sendMail(mailOptions);
//             res.status(200).json({ message: 'Email sent successfully!' });
//         } catch (error) {
//             console.error('Failed to send email:', error);
//             res.status(500).json({ message: 'Failed to send email' });
//         }
//     });

//     req.pipe(busboy);
// }
