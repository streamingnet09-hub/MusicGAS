const express = require('express');
const cors = require('cors');
const yts = require('yt-search');
const ytdl = require('@distube/ytdl-core');

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.send('Servidor de audio y búsqueda activo');
});

// 1. RUTA PARA BUSCAR EN YOUTUBE
app.get('/search', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Falta la búsqueda' });

  try {
    const r = await yts(query);
    const videos = r.videos.slice(0, 10).map(v => ({
      id: v.videoId,
      title: v.title,
      artist: v.author.name,
      duration: v.timestamp,
      thumbnail: v.thumbnail
    }));
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. RUTA PARA TRANSMITIR AUDIO DE YOUTUBE
app.get('/yt-stream', async (req, res) => {
  const videoId = req.query.id;
  if (!videoId) return res.status(400).send('Falta el ID del video');

  try {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    res.setHeader('Content-Type', 'audio/mpeg');
    
    ytdl(url, {
      filter: 'audioonly',
      quality: 'highestaudio',
      highWaterMark: 1 << 25
    }).pipe(res);
  } catch (error) {
    res.status(500).send('Error al procesar audio: ' + error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
