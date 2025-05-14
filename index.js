
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

const apiKey = 'ad0ce823edmshdfd53f16008ff40p125302jsna06243bc1ce8';
const apiHost = 'whatsapp-data.p.rapidapi.com';

app.get('/generate', async (req, res) => {
    const phone = req.query.phone;

    if (!phone) {
        return res.status(400).json({ error: 'Parâmetro "phone" é obrigatório' });
    }

    try {
        const response = await axios.get(`https://${apiHost}/wspicture`, {
            params: { phone },
            headers: {
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': apiHost
            }
        });

        const profilePic = response.data.profilePic;

        if (!profilePic) {
            return res.status(404).json({ error: 'Imagem não encontrada' });
        }

        return res.redirect(profilePic);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar imagem', details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
