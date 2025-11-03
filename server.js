import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 静态文件托管（前端）
app.use(express.static(__dirname));

// 允许跨域
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// /tts?text=xxx&lang=ja
app.get('/tts', async (req, res) => {
  try {
    const { text, lang } = req.query;
    if(!text || !lang) return res.status(400).send("Missing text or lang");

    const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(lang)}&q=${encodeURIComponent(text)}`;
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    if(!response.ok) return res.status(500).send("Google TTS request failed");

    const arrayBuffer = await response.arrayBuffer();
    res.setHeader("Content-Type", "audio/mpeg");
    res.send(Buffer.from(arrayBuffer));
  } catch(err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});