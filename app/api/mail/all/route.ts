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
    <link
        href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
        rel="stylesheet">
    <style type="text/css">
        body,
        table,
        td,
        a,
        p,
        span,
        b,
        h3,
        h1,
        * {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            font-family: "Inter", sans-serif;
            box-sizing: border-box;
        }

        p {
            font-weight: 400 !important;
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

<body style="background: #ffffff;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="padding-bottom: 50px;padding-top: 30px;">
        <tr style="padding-bottom: 50px;">
            <td bgcolor="#ffffff" align="center" class="section-padding">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 650px;"
                    class="responsive-table">

                    <tr style="margin-top: 5px !important;">
                        <td style="padding: 0px 0px 0px 0px !important;">
                            <img src="https://i.ibb.co/H4Wvchg/ofraldario.webp" width="170px" height="50px"
                                alt="Fraldario Logo" alt="ofraldario" border="0">
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor="#ffffff" align="center" style="padding: 20px 20px 0px 20px !important;"
                class="section-padding">
                <table border="0" cellpadding="0" cellspacing="0" width="100%"
                    style="max-width: 650px;padding: 0px 5px 20px 5px;" class="responsive-table">
                    ${data?.message !== "" && data?.message !== null && data?.message !== undefined
                    ? `<tr>
                        <td style='padding: 20px 0px 0px 0px !important;'>
                            <p
                                style="width: 100%;margin: 4px 0 0 0;font-size: 13px;padding: 8px 10px 8px 10px;">
                                ${data?.message}</p>
                        </td>
                    </tr>`
                    : ``
                    }
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor="#ffffff" align="center" style="padding: 0px 20px 0px 20px !important;" class="section-padding">
                <!-- </td> -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%"
                    style="max-width: 650px;padding: 0px 5px 20px 5px;" class="responsive-table">
                    <tr>
                        <td style='padding: 5px 0px 0px 0px !important;'>
                            <img src="https://i.ibb.co/T1xPxgY/Footer-Go-Green-800px-01.png"
                                alt="Footer-Go-Green-800px-01" width="100%" height="auto" alt="ofraldario" border="0">
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>`,
      };
}


interface URL {
    filename: string;
    path: string;
}

export async function POST(req: Request): Promise<NextResponse>{

    // const supabase = createClient();
    // const {values, sendTo, fileName, fileUrl} = await req.json()

    const supabase = createClient();
    const {values, sendTo, fileName, fileUrl} = await req.json()

    console.log(sendTo)

    const { data, error } = await supabase
        .from("alunos")
        .select('email')

    if (error || !data) {
        return NextResponse.json({
            message: "Não existem alunos na base de dados.",
    })}

    // console.log(values)
    // console.log(data)

    const sendWithAttachment = async () => {
        for(const email of sendTo) {
            const updatedMailOptions = {
                ...mailOptions,
                to: email,
                ...generateEmailContent(values),
                subject: values.subject,
                attachments: [
                    {
                      filename: fileName,
                      path: `${fileUrl}`,
                    },
                  ],
            };
            await transporter.sendMail(updatedMailOptions);
        }
    }

    const sendNoAttachment = async () => {
        for(const email of sendTo) {
            const updatedMailOptions = {
                ...mailOptions,
                to: email,
                ...generateEmailContent(values),
                subject: values.subject,
            };
    
            await transporter.sendMail(updatedMailOptions);
        }
    }

    const sendWithAttachmentToAll = async () => {
        for(const row of sendTo) {
            const updatedMailOptions = {
                ...mailOptions,
                to: row.email,
                ...generateEmailContent(values),
                subject: values.subject,
                attachments: [
                    {
                      filename: fileName,
                      path: `${fileUrl}`,
                    },
                  ],
            };
            await transporter.sendMail(updatedMailOptions);
        }
    }

    const sendNoAttachmentToAll = async () => {
        for(const row of sendTo) {
            const updatedMailOptions = {
                ...mailOptions,
                to: row.email,
                ...generateEmailContent(values),
                subject: values.subject,
            };
    
            await transporter.sendMail(updatedMailOptions);
        }
    }



    if(sendTo.length > 0) {
        console.log('Greater than zero')
    } else {
        console.log('Less or equal to zero')
    }

    if(sendTo.length > 0) {
        if(fileName && fileUrl) {
            sendWithAttachment()
        } else {
            sendNoAttachment()
        }
    } else {
        if(fileName && fileUrl) {
            sendWithAttachmentToAll()
        } else {
            sendNoAttachmentToAll()
        }
    }
    
    return NextResponse.json({
        values
    })

    // console.log(fileUrl);

    // // const urls: URL[] = []

    // console.log(typeof(fileUrl))

    // // Create attachments dynamically
    // // const files = fileUrl.map((file: any) => {
    //     // const filename = file.split('https://njbriflsmqmsypzewuuo.supabase.co/storage/v1/object/public/fraldario/').pop() // Extract the filename from the path
    //     // const path = file // Full path to the file

    //     // console.log(filename, path)
    //     // return {
    //     //     filename: file.split('https://njbriflsmqmsypzewuuo.supabase.co/storage/v1/object/public/fraldario/').pop(), // Extract the filename from the path
    //     //     path: file, // Full path to the file
    //     // };
    // // });

    // // console.log(sendTo)

    // const { data, error } = await supabase
    //     .from("alunos")
    //     .select('email')

    // if (error || !data) {
    //     return NextResponse.json({
    //         message: "Não existem alunos na base de dados.",
    // })}

    // // console.log(values)
    // // console.log(data)

    // const sendWithAttachment = async () => {
    //     for(const email of sendTo) {
    //         const updatedMailOptions = {
    //             ...mailOptions,
    //             to: email,
    //             ...generateEmailContent(values),
    //             subject: values.subject,
    //             attachments: [
    //                 filename: fileName,
    //                 path: 
    //             ]
    //             // attachments: files,
    //         };
    //         await transporter.sendMail(updatedMailOptions);
    //     }
    // }

    // const sendNoAttachment = async () => {
    //     for(const email of sendTo) {
    //         const updatedMailOptions = {
    //             ...mailOptions,
    //             to: email,
    //             ...generateEmailContent(values),
    //             subject: values.subject,
    //         };
    
    //         await transporter.sendMail(updatedMailOptions);
    //     }
    // }

    // const sendWithAttachmentToAll = async () => {
    //     for(const row of sendTo) {
    //         const updatedMailOptions = {
    //             ...mailOptions,
    //             to: row.email,
    //             ...generateEmailContent(values),
    //             subject: values.subject,
    //             // attachments: files
    //         };
    //         await transporter.sendMail(updatedMailOptions);
    //     }
    // }

    // const sendWithoutAttachmentToAll = async () => {
    //     for(const row of sendTo) {
    //         const updatedMailOptions = {
    //             ...mailOptions,
    //             to: row.email,
    //             ...generateEmailContent(values),
    //             subject: values.subject,
    //         };
    
    //         await transporter.sendMail(updatedMailOptions);
    //     }
    // }



    // if(sendTo.length > 0) {
    //     console.log('Greater than zero')
    // } else {
    //     console.log('Less or equal to zero')
    // }

    // if(sendTo.length > 0) {
    //     if(fileUrl !== "" && fileUrl !== null && fileUrl !== undefined) {
    //         // sendWithAttachment()
    //     } else {
    //         sendNoAttachment()
    //     }
    // } else {
    //     if(fileUrl !== "" && fileUrl !== null && fileUrl !== undefined) {
    //         // sendWithAttachmentToAll()
    //     } else {
    //         // sendWithoutAttachmentToAll()
    //     }
    // }
    
    // return NextResponse.json({
    //     values
    // })
}