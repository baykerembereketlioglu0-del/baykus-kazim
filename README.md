# Baykuş Kâzım

Baykuş Kâzım (öğüt veren baykuş) ve Kurt Demir'in yer aldığı, noir tarzı kısa animasyon serisi.
Çizimler JavaScript canvas ile yapılır, video Playwright ile kare kare kaydedilir, sesler ElevenLabs ile üretilir.

## Klasörler

- `kazim-ve-demir/` — "Sürüden Korkma" bölümü (9:16, sesli)
  - `index.html` — animasyon (tarayıcıda açınca önizleme)
  - `story.js` — replikler
  - `generate_voices.js` — ElevenLabs ile sesleri ve altyazı zamanlamasını üretir
  - `record.js` — Playwright ile MP4 kaydeder (ses varsa ekler)
- `foxyarif-ornek/` — ilk deneme (Tilki Arif ve Kedi, 20 sn)
- `videolar/` — paylaşılan videolar

## Video üretme

Gereken: Node.js 18+, ffmpeg

```
cd kazim-ve-demir
npm i playwright
npx playwright install chromium
ELEVENLABS_API_KEY=anahtarın node generate_voices.js
node record.js
```

API anahtarını dosyalara yazma; yalnızca ortam değişkeniyle ver.
