import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

const RAPID_API_KEY = 'ad0ce823edmshdfd53f16008ff40p125302jsna06243bc1ce8';
const RAPID_API_HOST = 'whatsapp-data.p.rapidapi.com';

app.get('/', (req, res) => {
  res.send('Servidor online');
});

app.get('/analise', async (req, res) => {
  const telefone = req.query.tel;
  if (!telefone) return res.status(400).send('Número não fornecido');

  try {
    const response = await fetch(`https://${RAPID_API_HOST}/wspicture?phone=${telefone}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPID_API_KEY,
        'X-RapidAPI-Host': RAPID_API_HOST
      }
    });

    const data = await response.json();

    if (!data || !data.profilePic) {
      return res.send(`<h2>Foto não disponível</h2><p>Para: ${telefone}</p>`);
    }

    const html = `
      <html>
        <head>
          <title>WhatsSpy - Consulta</title>
          <style>
            body { font-family: Arial; text-align: center; margin-top: 40px; background: #fff; color: #222; }
            img { border-radius: 50%; width: 180px; height: 180px; object-fit: cover; }
            .phone { color: green; font-weight: bold; font-size: 20px; margin-top: 12px; }
            .status { font-size: 24px; margin-top: 10px; font-weight: 600; color: #00C851; }
          </style>
        </head>
        <body>
          <img src="${data.profilePic}" alt="Foto de Perfil" />
          <div class="phone">+${telefone}</div>
          <div class="status">Analisando...</div>
        </body>
      </html>
    `;

    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro na consulta');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
