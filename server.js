const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.send('Servidor de audio activo');
});

app.get('/stream', async (req, res) => {
  const audioUrl = req.query.url;
  if (!audioUrl) return res.status(400).send('Falta el parámetro url');

  try {
    const response = await axios({
      method: 'get',
      url: audioUrl,
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });

    res.setHeader('Content-Type', response.headers['content-type'] || 'audio/mpeg');
    res.setHeader('Accept-Ranges', 'bytes');
    response.data.pipe(res);
  } catch (error) {
    res.status(500).send('Error procesando audio: ' + error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
