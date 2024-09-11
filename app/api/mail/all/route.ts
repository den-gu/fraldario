import { mailOptions, transporter } from '@/config/nodemailer'
import { getStudents } from '@/lib/api';
import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import fs from 'fs'

const generateEmailContent = (data: any) => {    
      return {
        html: `<!DOCTYPE html>
<html>

<head>
    <title></title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet">
    <style type="text/css">
        body,
        table,
        td,
        a, p, span, b, h3, h1, * {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            font-family: "Inter", sans-serif;
        }

        p {
          font-weight: 500 !important;
        }

        body table td {
            padding: 0px 60px 0px 60px !important;
        }

        body {
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
        }
    </style>
</head>

<body style="background: #fff">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td bgcolor="#ffffff" align="center" style="padding: 0px 20px 0px 20px !important;"
                class="section-padding">
                <table border="0" cellpadding="40" cellspacing="0" width="100%"
                    style="max-width: 700px;border: 1px solid #cccccc;border-radius: 5px !important;"
                    class="responsive-table">
                    <tr>
                        <td style="padding: 0px 15px 0px 15px !important;"><br /></td>
                    </tr>
                    <tr style="margin-top: 5px !important;">
                        <td style="padding: 0px 15px 0px 15px !important;">
                            <img src="https://i.ibb.co/H4Wvchg/ofraldario.webp" width="170px" height="50px"
                                alt="Fraldario Logo" alt="ofraldario" border="0">
                        </td>
                    </tr>                
                    <tr>
                        <td style="padding: 0px 15px 0px 15px !important;"><br /></td>
                    </tr>
                        <tr>
                                <td style="padding: 0px 15px 0px 15px !important;">
                                    <p style="margin: 0;">${data?.message}</p>
                                </td>
                            </tr>
                    <tr>
                        <td style="padding: 0px 15px 0px 15px !important;"><br /></td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`,
      };
}


export async function POST(req: Request): Promise<NextResponse>{

    const supabase = createClient();

    const {values, file} = await req.json()

    console.log(file)

    const { data, error } = await supabase
        .from("alunos")
        .select('email')

    if (error || !data) {
        return NextResponse.json({
            message: "Não existem alunos na base de dados.",
    })}

    console.log(values)
    console.log(data)

    for(const row of data) {
        const updatedMailOptions = {
            ...mailOptions,
            to: "denilsondavid.me@gmail.com",
            ...generateEmailContent(values),
            subject: values.subject,
            attachments: [
                {
                  filename: file, // Name of the attachment
                //   content: new Buffer(attachment.data), // Content of the attachment (Base64 or Buffer)
                  // stream as an attachment
                  content: fs.createReadStream(`./public/uploads/${file}`),
                //   contentType: attachment.type, // MIME type of the attachment (e.g., 'application/pdf', 'image/jpeg')
                },
              ],
        };

        await transporter.sendMail(updatedMailOptions);
    }
    
    return NextResponse.json({
        values
    })
}