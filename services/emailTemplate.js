export const getThankYouEmailTemplate = (guestName = 'Convidado Querido', giftTitle = 'Presente de Casamento', amount = null) => {
  const formattedAmount = amount 
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)
    : null;

  const appUrl = process.env.PUBLIC_URL || process.env.VERCEL_URL 
    ? (process.env.PUBLIC_URL || `https://${process.env.VERCEL_URL}`)
    : 'https://casamento-ana-e-dener.vercel.app';

  const photoUrl = `${appUrl}/assets/00003028-PHOTO-2026-08-02-17-36-05.jpg`;

  return `
<!DOCTYPE html>
<html lang="pt-BR" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Muito Obrigado pelo seu Presente! | Ana Clara & Dener</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Pinyon+Script&family=Inter:wght@300;400;500;600&display=swap');
    
    /* Reset CSS */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    table { border-collapse: collapse !important; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #FAF6F0; color: #745D57; font-family: 'Inter', Helvetica, Arial, sans-serif; }

    /* Media Queries */
    @media screen and (max-width: 600px) {
      .email-container { width: 100% !important; padding: 16px !important; }
      .card-body { padding: 24px 20px !important; }
      .hero-title { font-size: 28px !important; }
      .script-title { font-size: 34px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF6F0;">

  <!-- Contêiner Principal -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FAF6F0; padding: 30px 0;">
    <tr>
      <td align="center">
        
        <!-- Card Central de E-mail -->
        <table border="0" cellpadding="0" cellspacing="0" width="600" class="email-container" style="max-width: 600px; width: 100%; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #E8DDCF; overflow: hidden; box-shadow: 0 12px 35px rgba(116, 93, 87, 0.08);">
          
          <!-- Cabeçalho com Monograma -->
          <tr>
            <td align="center" style="padding: 36px 30px 20px; background-color: #FAF6F0; border-bottom: 1px solid #E8DDCF;">
              <div style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 26px; font-weight: 700; color: #745D57; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 4px;">
                A & D
              </div>
              <div style="font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600; color: #7F8F6A; letter-spacing: 0.25em; text-transform: uppercase;">
                CASAMENTO · 28.11.2026
              </div>
            </td>
          </tr>

          <!-- Foto de Capa do Casal -->
          <tr>
            <td align="center" style="padding: 24px 24px 0 24px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="border-radius: 12px; overflow: hidden; box-shadow: 0 8px 24px rgba(44, 34, 30, 0.12);">
                    <img src="${photoUrl}" alt="Ana Clara & Dener" width="552" style="width: 100%; max-width: 552px; height: auto; display: block; border-radius: 12px; object-fit: cover;" />
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Conteúdo da Mensagem -->
          <tr>
            <td class="card-body" style="padding: 36px 40px; text-align: center;">
              
              <!-- Subtítulo / Badge de Agradecimento -->
              <div style="display: inline-block; padding: 6px 16px; background-color: rgba(127, 143, 106, 0.12); border-radius: 20px; margin-bottom: 20px;">
                <span style="font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 600; color: #7F8F6A; letter-spacing: 0.1em; text-transform: uppercase;">
                  💖 AGRADECIMENTO ESPECIAL
                </span>
              </div>

              <!-- Título Serifado -->
              <h1 class="hero-title" style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 34px; font-weight: 600; color: #745D57; margin: 0 0 16px 0; line-height: 1.2;">
                Recebemos o seu carinho!
              </h1>

              <p style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 21px; font-style: italic; color: #745D57; margin: 0 0 24px 0; line-height: 1.5;">
                "Querido(a) ${guestName},"
              </p>

              <!-- Texto do E-mail -->
              <p style="font-family: 'Inter', sans-serif; font-size: 15px; color: #5C4A45; line-height: 1.8; margin: 0 0 28px 0; text-align: center;">
                Nosso coração transborda de alegria e gratidão ao receber o seu presente! Saber que temos o seu carinho e apoio neste capítulo tão abençoado das nossas vidas torna tudo ainda mais inesquecível.
              </p>

              <!-- Card de Confirmação do Presente -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FAF6F0; border-radius: 12px; border: 1px dashed #745D57; margin-bottom: 32px;">
                <tr>
                  <td style="padding: 20px; text-align: center;">
                    <div style="font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600; color: #7F8F6A; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 6px;">
                      PRESENTE RECEBIDO
                    </div>
                    <div style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 22px; font-weight: 700; color: #745D57; margin-bottom: 4px;">
                      ${giftTitle}
                    </div>
                    ${formattedAmount ? `
                      <div style="font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; color: #7F8F6A;">
                        ${formattedAmount}
                      </div>
                    ` : ''}
                  </td>
                </tr>
              </table>

              <!-- Mensagem de Encerramento -->
              <p style="font-family: 'Inter', sans-serif; font-size: 14px; color: #745D57; line-height: 1.7; margin: 0 0 28px 0;">
                Mal podemos esperar para abraçar você e celebrar juntos o nosso grande dia!
              </p>

              <!-- Divisória Elegante -->
              <div style="height: 1px; background-color: #E8DDCF; width: 80px; margin: 0 auto 28px auto;"></div>

              <!-- Assinatura em Script dos Noivos -->
              <div style="font-family: 'Pinyon Script', 'Great Vibes', cursive; font-size: 42px; color: #745D57; line-height: 1.2; margin-bottom: 6px;">
                Ana Clara & Dener
              </div>

              <div style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 15px; color: #7F8F6A; letter-spacing: 0.05em;">
                Com todo o nosso amor e gratidão 🤍
              </div>

            </td>
          </tr>

          <!-- Rodapé do E-mail -->
          <tr>
            <td align="center" style="padding: 24px 30px; background-color: #FAF6F0; border-top: 1px solid #E8DDCF; text-align: center;">
              <p style="font-family: 'Inter', sans-serif; font-size: 12px; color: #9A857F; margin: 0 0 6px 0;">
                Casamento Ana Clara & Dener — 28 de Novembro de 2026
              </p>
              <p style="font-family: 'Inter', sans-serif; font-size: 11px; color: #B5A6A1; margin: 0;">
                São Bernardo do Campo, SP
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `;
};
