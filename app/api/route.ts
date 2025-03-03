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
      id: "ID do relatório:",
      createdAtIntDTF: "Data:",
  };

const generateEmailContent = (data: any) => {

    const date = new Date();
    const createdAt = new Intl.DateTimeFormat('pt-BR').format(date);

    const stringData = Object.entries(data).reduce(
        (str, [key, val]) =>
          (str += `${CONTACT_MESSAGE_FIELDS[key]}: \n${val} \n \n`),
        ""
      );
    
      return {
        // text: stringData,
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
        <td bgcolor="#ffffff" align="center" style="padding: 0px 20px 0px 20px !important;" class="section-padding">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 650px;padding: 0px 5px 0px 5px;" class="responsive-table">
                    <tr>
                        <td style='padding: 5px 0px 0px 0px !important;'>
                            <img src="https://raw.githubusercontent.com/den-gu/fraldario/refs/heads/main/fraldario.webp" width="160px" height="40px"
                                alt="Fraldario Logo" border="0">
                        </td>
                        <td style="padding: 0px 10px 0px 5px !important;">
                        ${data?.createdAtIntDTF !== "" && data?.createdAtIntDTF !== null && data?.createdAtIntDTF !== undefined
                            ? ` <p style="margin: 0;text-align: right !important;font-size: 13px;color: #888;">
                                ${data.createdAtIntDTF}</p>`
                            : ''}
                            ${data?.id !== "" && data?.id !== null && data?.id !== undefined
                                ? ` <p style="margin: 0;text-align: right !important;font-size: 13px;color: #888;">
                                    Ref#: ${data.id.slice(0, 5)}</p>`
                                : ''}
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor="#ffffff" align="center" style="padding: 0px 20px 0px 20px !important;" class="section-padding">
                <!-- </td> -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%"
                    style="max-width: 650px;padding: 10px 5px 20px 5px;" class="responsive-table">
                    <tr>
                        <td style='padding: 15px 0px 0px 0px !important;'>
                            <p style='margin: 0;font-size: 15px;'><b>Nome da criança:</b></p>
                            <p
                                style="width: 100%;margin: 4px 0 0 0;font-size: 13px;padding: 8px 10px 8px 10px; border-radius: 8px; border: 1px solid #cccccc;">
                                ${data?.student_name}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0px 0px 0px !important;">
                            <p style="margin: 0;font-size: 13px;">Comportamento:
                            </p>
                            <p
                                style="width: 100%;margin: 4px 0 0 0;font-size: 13px;padding: 8px 10px 8px 10px; border-radius: 8px; border: 1px solid #cccccc;">
                                ${data?.behavior}</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <td bgcolor="#ffffff" align="center" style="padding: 0px 20px 0px 20px !important;" class="section-padding">
            <table border="0" cellpadding="0" cellspacing="0" width="100%"
                style="max-width: 650px;border: 1px solid #dddddd;border-radius: 10px !important;padding: 10px 5px 20px 5px !important;"
                class="responsive-table">
                <!-- <tr> -->
                <!-- <td> -->
                <tr>
                    <td style="padding: 0px 0px 0px 15px !important;">
                        <h1 style="font-size: 15px;margin: 5px 0 10px 0px !important;padding: 0px 0px 4px 0px;">
                            Refeições</h1>
                    </td>
                </tr>
                ${data?.porcao_pequeno_almoco !== "" && data?.porcao_pequeno_almoco !== "Não aplicável"
                ? `<tr>
                    <td style='padding: 10px 15px 0px 15px !important;'>
                        <p style='margin: 0;font-size: 13px;'>Pequeno-almoço: ${data?.porcao_pequeno_almoco}</p>
                        <p
                            style="width: 100%;margin: 4px 0 0 0;font-size: 13px;padding: 8px 10px 8px 10px; border-radius: 8px; border: 1px solid #cccccc;">
                            ${data?.pequeno_almoco}</p>
                    </td>
                </tr>`
                : ``
                }
                ${data?.porcao_extras1 !== "" && data?.porcao_extras1 !== "Não aplicável" && data?.porcao_extras1 !== null && data?.porcao_extras1 !== undefined
                ? `<tr>
                    <td style='padding: 10px 15px 0px 15px !important;'>
                        <p style='margin: 0;font-size: 13px;'>Snack: ${data?.porcao_extras1}</p>
                        <p
                            style="width: 100%;margin: 4px 0 0 0;font-size: 13px;padding: 8px 10px 8px 10px; border-radius: 8px; border: 1px solid #cccccc;">
                            ${data?.extras1}</p>
                    </td>
                </tr>`
                : ``
                }
                ${data?.porcao_almoco1 !== "" && data?.porcao_almoco1 !== "Não aplicável"
                ? `<tr>
                    <td style='padding: 10px 15px 0px 15px !important;'>
                        <p style='margin: 0;font-size: 13px;'>Almoço (Entrada): ${data?.porcao_almoco1}</p>
                        <p
                            style="width: 100%;margin: 4px 0 0 0;font-size: 13px;padding: 8px 10px 8px 10px; border-radius: 8px; border: 1px solid #cccccc;">
                            ${data?.almoco1}</p>
                    </td>
                </tr>`
                : ``
                }
                ${data?.porcao_almoco2 !== "" && data?.porcao_almoco2 !== "Não aplicável"
                ? `<tr>
                    <td style='padding: 10px 15px 0px 15px !important;'>
                        <p style='margin: 0;font-size: 13px;'>Prato principal: ${data?.porcao_almoco2}</p>
                        <p
                            style="width: 100%;margin: 4px 0 0 0;font-size: 13px;padding: 8px 10px 8px 10px; border-radius: 8px; border: 1px solid #cccccc;">
                            ${data?.almoco2}</p>
                    </td>
                </tr>`
                : ``
                }
                ${data?.porcao_sobremesa !== "" && data?.porcao_sobremesa !== "Não aplicável"
                ? `<tr>
                    <td style='padding: 10px 15px 0px 15px !important;'>
                        <p style='margin: 0;font-size: 13px;'>Sobremesa: ${data?.porcao_sobremesa}</p>
                        <p
                            style="width: 100%;margin: 4px 0 0 0;font-size: 13px;padding: 8px 10px 8px 10px; border-radius: 8px; border: 1px solid #cccccc;">
                            ${data?.sobremesa}</p>
                    </td>
                </tr>`
                : ``
                }
                ${data?.porcao_extras2 !== "" && data?.porcao_extras2 !== "Não aplicável" && data?.porcao_extras2 !== null && data?.porcao_extras2 !== undefined
                ? `<tr>
                    <td style='padding: 10px 15px 0px 15px !important;'>
                        <p style='margin: 0;font-size: 13px;'>Snack: ${data?.porcao_extras2}</p>
                        <p
                            style="width: 100%;margin: 4px 0 0 0;font-size: 13px;padding: 8px 10px 8px 10px; border-radius: 8px; border: 1px solid #cccccc;">
                            ${data?.extras2}</p>
                    </td>
                </tr>`
                : ``
                }
                ${data?.porcao_lanche !== "" && data?.porcao_lanche !== "Não aplicável"
                ? `<tr>
                    <td style='padding: 10px 15px 0px 15px !important;'>
                        <p style='margin: 0;font-size: 13px;'>Lanche: ${data?.porcao_lanche}</p>
                        <p
                            style="width: 100%;margin: 4px 0 0 0;font-size: 13px;padding: 8px 10px 8px 10px; border-radius: 8px; border: 1px solid #cccccc;">
                            ${data?.lanche}</p>
                    </td>
                </tr>`
                : ``
                }
            </table>
        </td>
        </tr>

        <tr>
            <td bgcolor="#ffffff" align="center" style="padding: 20px 20px 0px 20px !important;"
                class="section-padding">
                <table border="0" cellpadding="0" cellspacing="0" width="100%"
                    style="max-width: 650px;padding: 0px 5px 20px 5px;" class="responsive-table">
                    <tr>
                        <td style='padding: 0px 0px 0px 0px !important;'>
                            <p style="margin: 0;font-size: 13px;">Fezes:</p>
                            <p
                                style="width: 100%;margin: 4px 0 0 0;font-size: 13px;padding: 8px 10px 8px 10px; border-radius: 8px; border: 1px solid #cccccc;">
                                ${data?.fezes}${data?.nr_fezes > 0 ? `: ${data?.nr_fezes}x` : ``}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style='padding: 10px 0px 0px 0px !important;'>
                            <p style='margin: 0;font-size: 13px;'>Vômitos:</p>
                            <p
                                style="width: 100%;margin: 4px 0 0 0;font-size: 13px;padding: 8px 10px 8px 10px; border-radius: 8px; border: 1px solid #cccccc;">
                                ${data?.vomitos}${data?.nr_vomitos > 0 ? `: ${data?.nr_vomitos}x` : ``}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style='padding: 10px 0px 0px 0px !important;'>
                            <p style='margin: 0;font-size: 13px;'>Febres:</p>
                            <p
                                style="width: 100%;margin: 4px 0 0 0;font-size: 13px;padding: 8px 10px 8px 10px; border-radius: 8px; border: 1px solid #cccccc;">
                                ${data?.febres} ${data?.nr_febres > 0 ? `: ${data?.nr_febres}° C` : ``}</p>
                        </td>
                    </tr>
                    ${data?.message !== "" && data?.message !== null && data?.message !== undefined
                    ? `<tr>
                        <td style='padding: 20px 0px 0px 0px !important;'>
                            <p style='margin: 0;font-size: 13px;'>Outras ocorrências:</p>
                            <p
                                style="width: 100%;margin: 4px 0 0 0;font-size: 13px;padding: 8px 10px 8px 10px; border-radius: 8px; border: 1px solid #cccccc;">
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
                            <img src="https://raw.githubusercontent.com/den-gu/fraldario/refs/heads/main/stamp.png" alt="Footer-Go-Green-800px-01" width="100%" height="auto"
                                alt="ofraldario" border="0">
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
          to: data.email,
          ...generateEmailContent(data),
          subject: "O Fraldário - Relatório Diário",
      };

      const response = await transporter.sendMail(updatedMailOptions);

      console.log('Email sent.')
      console.log(response)
  } catch (error) {
      console.log(error);
  }

    // console.log(data)
    return NextResponse.json({
        data
    })
}
