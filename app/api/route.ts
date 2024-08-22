import { mailOptions, transporter } from '@/config/nodemailer'
import { NextResponse } from 'next/server'

type ContactMessageFields = {
    [key: string]: string;
  };

const CONTACT_MESSAGE_FIELDS: ContactMessageFields = {
    created_at: "Criado em",
    student_name: "Nome",
    email: "E-mail",
    behavior: "Comportamento",
    pequeno_almoco: "Pequeno-almoço",
      almoco1: "Almoço 1º",
      almoco2: "Almoço 2º",
      sobremesa: "Sobremesa",
      lanche: "Lanche",
      extras1: "Extras 1º",
      extras2: "Extras 2º",
      porcao_pequeno_almoco: "Porção - Pequeno-almoço",
      porcao_almoco1: "Porção - Almoço1",
      porcao_almoco2: "Porção - Almoço2",
      porcao_sobremesa: "Porção - Sobremesa",
      porcao_lanche: "Porção - Lanche",
      porcao_extras1: "Porção - Extras1",
      porcao_extras2: "Porção - Extras2",
      fezes: "Fezes",
      vomitos: "Vômitos",
      febres: "Febres",
      message: "Outras ocorrências",
      student_id: "ID do aluno:",
      id: "ID do relatório:",
      createdAtIntDTF: "Data:",
  };

const generateEmailContent = (data: any) => {
    const stringData = Object.entries(data).reduce(
        (str, [key, val]) =>
          (str += `${CONTACT_MESSAGE_FIELDS[key]}: \n${val} \n \n`),
        ""
      );
      // const htmlData = Object.entries(data).reduce((str, [key, val]) => {
      //   return (str += `<p class="form-heading" align="left">${CONTACT_MESSAGE_FIELDS[key]}<span class="form-answer" align="left">${val}</span></p>`);
      // }, "");

      // console.log(data?.student_name);
    
      return {
        text: stringData,
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
                        <td style="padding: 0px 15px 0px 15px !important;">
                            <p
                                style="margin: 0;text-align: right !important;font-size: 13px;font-weight: 500;color: #888;">
                                ${data?.createdAtIntDTF}</p>
                            <p
                                style="float: right;margin: 0;text-align: right !important;font-size: 13px;font-weight: 500;color: #888;">
                                ${data?.id.slice(0, 12)}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 0px 15px 0px 15px !important;">
                            <h3 style="margin: 5px 0 0 0;font-size: 18px;font-weight: 900 !important;">${data?.student_name}
                            </h3>
                            <a href="mailto:${data?.email}" style="font-size: 13px;text-decoration: none;cursor: pointer;color: #000 !important;">${data?.email}</a>
                        </td>
                        <td style="padding: 0px 15px 0px 15px !important;">
                            <p style="margin: 0;text-align: right !important;font-size: 13px;">
                                Comportamento: <b>${data?.behavior}</b></p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 0px 15px 0px 15px !important;">
                            <h1
                                style="font-size: 16px;margin-top: 20px !important;padding-bottom: 4px; border-bottom: 1px solid #ddd;">
                                Refeições</h1>
                        </td>
                        <td style="padding: 0px 15px 0px 15px !important;">
                            <h1
                                style="font-size: 16px;margin-top: 20px !important;margin-left: auto !important;padding-bottom: 4px; border-bottom: 1px solid #ddd;">
                                Porção</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 0px 15px 0px 15px !important;">
                            <p style="margin: 0;"><b>Pequeno-almoço:</b> ${data?.pequeno_almoco}</p>
                        </td>
                        <td style="padding: 0px 15px 0px 15px !important;">
                            <p style="margin: 0;">${data?.porcao_pequeno_almoco}</p>
                        </td>
                    </tr>
                    ${data?.porcao_extras1 !== "" 
                        ? `<tr>
                                <td style='padding: 0px 15px 0px 15px !important;'>
                                    <p style='margin: 0;'><b>Extra da manhã:</b> ${data?.extras1}</p>
                                </td>
                                <td style='padding: 0px 15px 0px 15px !important;'>
                                    <p style='margin: 0;'>${data?.porcao_extras1}</p>
                                </td>
                            </tr>`
                        : ``
                    }
                    <tr>
                        <td style="padding: 0px 15px 0px 15px !important;">
                            <p style="margin: 0;"><b>1º Almoço:</b> ${data?.almoco1}</p>
                        </td>
                        <td style="padding: 0px 15px 0px 15px !important;">
                            <p style="margin: 0;">${data?.porcao_almoco1}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 0px 15px 0px 15px !important;">
                            <p style="margin: 0;"><b>2º Almoço:</b> ${data?.almoco2}</p>
                        </td>
                        <td style="padding: 0px 15px 0px 15px !important;">
                            <p style="margin: 0;">${data?.porcao_almoco2}</p>
                        </td>
                    </tr>
                    ${data?.porcao_extras2 !== ""
                        ? `<tr>
                                <td style='padding: 0px 15px 0px 15px !important;'>
                                    <p style='margin: 0;'><b>Extra da tarde:</b> ${data?.extras2}</p>
                                </td>
                                <td style='padding: 0px 15px 0px 15px !important;'>
                                    <p style='margin: 0;'>${data?.porcao_extras2}</p>
                                </td>
                            </tr>`
                        : ``
                    }
                    <tr>
                        <td style="padding: 0px 15px 0px 15px !important;">
                            <p style="margin: 0;"><b>Sobremesa:</b> ${data?.sobremesa}</p>
                        </td>
                        <td style="padding: 0px 15px 0px 15px !important;">
                            <p style="margin: 0;">${data?.porcao_sobremesa}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 0px 15px 0px 15px !important;">
                            <p style="margin: 0;"><b>Lanche:</b> ${data?.lanche}</p>
                        </td>
                        <td style="padding: 0px 15px 0px 15px !important;">
                            <p style="margin: 0;">${data?.porcao_lanche}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 0px 15px 0px 15px !important;"><br /></td>
                    </tr>
                    <tr>
                        <td style="padding: 0px 15px 0px 15px !important;">
                            <p style="margin: 0;">Fezes:</p>
                        </td>
                        <td style="padding: 0px 15px 0px 15px !important;">
                            <p style="margin: 0;">${data?.fezes} ${data?.nr_fezes > 0 ? `: ${data?.nr_fezes}x` : ``}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 0px 15px 0px 15px !important;">
                            <p style="margin: 0;">Vômitos:</p>
                        </td>
                        <td style="padding: 0px 15px 0px 15px !important;">
                            <p style="margin: 0;">${data?.vomitos} ${data?.nr_vomitos > 0 ? `: ${data?.nr_vomitos}x` : ``}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 0px 15px 0px 15px !important;">
                            <p style="margin: 0;">Febres:</p>
                        </td>
                        <td style="padding: 0px 15px 0px 15px !important;">
                            <p style="margin: 0;">${data?.febres}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 0px 15px 0px 15px !important;"><br /></td>
                    </tr>
                    ${data?.message !== ""
                        ? `<tr>
                                <td style="padding: 0px 15px 0px 15px !important;">
                                    <p style="margin: 0;"><b>Outras ocorrências:</b> ${data?.message}</p>
                                </td>
                            </tr>`
                        : ``
                    }
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


export async function GET(){
    return NextResponse.json({
        hello: "hello"
    })
}

export async function POST(req: Request): Promise<NextResponse>{
    const data = await req.json()

    try {
      const updatedMailOptions = {
          ...mailOptions,
          to: data.email, // Supondo que o e-mail para o qual você deseja enviar está dentro de data.email
          ...generateEmailContent(data),
          subject: "O Fraldario - relatório diário",
      };

      await transporter.sendMail(updatedMailOptions);
  } catch (error) {
      console.log(error);
  }

    console.log(data)
    return NextResponse.json({
        data
    })
}