export const getThankYouEmailTemplate = (guestName, giftTitle, amount) => {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Obrigado pelo seu presente!</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;600&display=swap');
        
        body {
          margin: 0;
          padding: 0;
          background-color: #FAF6F0;
          font-family: 'Inter', sans-serif;
          color: #745D57;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #FFFFFF;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(116, 93, 87, 0.08);
          margin-top: 40px;
          margin-bottom: 40px;
          text-align: center;
        }
        .header {
          margin-bottom: 30px;
        }
        h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px;
          color: #C88F98;
          font-weight: 600;
          margin: 0 0 10px 0;
        }
        p {
          font-size: 16px;
          line-height: 1.6;
          margin: 0 0 20px 0;
        }
        .photo-container {
          width: 100%;
          max-width: 400px;
          margin: 0 auto 30px auto;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .photo-container img {
          width: 100%;
          height: auto;
          display: block;
        }
        .gift-details {
          background-color: #FAF6F0;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
          border: 1px solid #E8DDCF;
        }
        .gift-title {
          font-weight: 600;
          color: #745D57;
          font-size: 18px;
          margin-bottom: 5px;
        }
        .footer {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px;
          font-style: italic;
          color: #A9B39A;
          margin-top: 40px;
        }
        .divider {
          height: 1px;
          background-color: #E8DDCF;
          margin: 30px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Com amor, Ana e Dener</h1>
        </div>
        
        <p>Querido(a) <strong>${guestName || 'Amigo(a)'}</strong>,</p>
        
        <p>Recebemos o seu presente com muita alegria! Queremos agradecer de todo o coração por fazer parte desse momento tão especial das nossas vidas. Sua presença e carinho significam o mundo para nós.</p>
        
        <div class="gift-details">
          <div class="gift-title">${giftTitle || 'Presente Especial'}</div>
          <div style="font-size: 14px; color: #7F8F6A;">Contribuição recebida com sucesso.</div>
        </div>
        
        <p>Mal podemos esperar para celebrar o nosso grande dia com você no dia <strong>28 de Novembro de 2026</strong>!</p>
        
        <div class="divider"></div>
        
        <div class="footer">
          Muito obrigado,<br>
          Ana Clara & Dener
        </div>
      </div>
    </body>
    </html>
  `;
};
