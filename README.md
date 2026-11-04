# Baykuş Kâzım

Baykuş Kâzım (öğüt veren baykuş) ve Kurt Demir'in yer aldığı, noir tarzı kısa animasyon serisi (Instagram/TikTok: @baykus.kazim).
Çizimler tamamen JavaScript canvas ile yapılır, video Playwright ile kare kare kaydedilip ffmpeg ile MP4'e çevrilir.

## Klasörler

- `ortak/` — tüm bölümlerin kullandığı motor
  - `cizim.js` — çizim yardımcıları, IK (kol bükme), dokular (tüvit, tüy, kürk, örgü, film greni)
  - `karakterler.js` — Baykuş Kâzım ve Kurt Demir (ifadeler, göz kırpma, dudak senkronu, el jestleri, fener)
  - `sahneler.js` — yağmurlu kıraathane sokağı, yağmur, sıçrayan damlalar
  - `motor.js` — zaman çizelgesi, kamera planları, altyazı, ışık, giriş/kapanış
  - `muzik.js` — prosedürel fon müziği (piyano + pad + bas) ve yağmur / gök gürültüsü sesi
  - `kaydet.js` — Playwright ile 1080x1920 / 30 fps MP4 kaydı (4 paralel işçi)
  - `seslendir.js` — isteğe bağlı ElevenLabs seslendirmesi
- `bolum5-fenerin-yagi/` — 5. bölüm "Fenerin Yağı" (`story.js` replikler, `index.html` önizleme)
- `kazim-ve-demir/` — eski "Sürüden Korkma" bölümü
- `foxyarif-ornek/` — ilk deneme
- `videolar/` — hazır videolar

## Video üretme

Gereken: Node.js 18+, ffmpeg

```
npm i
npx playwright install chromium
node ortak/kaydet.js bolum5-fenerin-yagi --out videolar/bolum5_fenerin_yagi.mp4
```

Seçenekler: `--fps 30`, `--crf 18` (düşük = daha kaliteli/büyük), `--workers 4`, `--from 10 --to 20` (yalnızca bir aralık).

Önizleme: `bolum5-fenerin-yagi/index.html` dosyasını tarayıcıda aç (oynat/duraklat, zaman çubuğu).

### Seslendirme (isteğe bağlı)

```
ELEVENLABS_API_KEY=anahtarın node ortak/seslendir.js bolum5-fenerin-yagi
node ortak/kaydet.js bolum5-fenerin-yagi --out videolar/bolum5_fenerin_yagi.mp4
```

Seslendirme varsa altyazı ve ağız hareketleri sesin kelime zamanlarına göre ayarlanır, müzik kısılır.
API anahtarını dosyalara yazma; yalnızca ortam değişkeniyle ver.

## Yeni bölüm yazma

`bolum5-fenerin-yagi` klasörünü kopyala, `story.js` içindeki `number`, `title` ve `story` satırlarını değiştir.
Her satır: `who` (`kazim` / `demir`), `mood`, `text`; isteğe bağlı `shot` (`wide`, `two`, `close-kazim`, `close-demir`, `lantern`),
`gesture` (Kâzım: `rest`, `point`, `open`, `shoulder`; Demir: `rest`, `clasp`, `open`, `chin`, `chest`),
`raise` (feneri kaldır/indir), `light` (`dim` / `bright`), `pause` (sonraki satıra kadar saniye).
