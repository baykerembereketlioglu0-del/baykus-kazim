# Baykuş Kâzım

Baykuş Kâzım (öğüt veren baykuş) ve Kurt Demir'in yer aldığı, noir tarzı kısa animasyon serisi (Instagram/TikTok: @baykus.kazim).
Çizimler tamamen JavaScript canvas ile yapılır, video Playwright ile kare kare kaydedilip ffmpeg ile MP4'e çevrilir.

## Klasörler

- `ortak/` — tüm bölümlerin kullandığı motor
  - `cizim.js` — çizim yardımcıları, IK (kol bükme), dokular (tüvit, tüy, kürk, örgü, film greni)
  - `karakterler.js` — Baykuş Kâzım ve Kurt Demir (ifadeler, göz kırpma, dudak senkronu, el jestleri, fener)
  - `sahneler.js` — yağmurlu kıraathane sokağı, yağmur, sıçrayan damlalar
  - `ara-sahneler.js` — seslendirme sürerken arkada dönen film sahneleri (anı, tohum/kök, ezilen filiz, çalışma montajı, tuğla tuğla dükkân, büyüyen ağaç…) ve "Kâzım'ın Defteri" kapanışı
  - `motor.js` — zaman çizelgesi, plan listesi, geçişler, eski film tonu, altyazı, ışık
  - `muzik.js` — prosedürel fon müziği (piyano + pad + bas) ve yağmur / gök gürültüsü sesi
  - `kaydet.js` — Playwright ile 1080x1920 / 30 fps MP4 kaydı (4 paralel işçi)
  - `sesleri-bol.js` — ElevenLabs sitesinden indirilen iki ses dosyasını repliklere böler, ağız hareketini sesten çıkarır
  - `seslendir.js` — ElevenLabs API ile seslendirme (ücretli plan gerektiren sesler için çalışmaz)
- `bolum5-tohum/` — 5. bölüm "Tohum" (`story.js` replikler + sahneler, `kaynak/` Marcus ve Yakup Yeşil ses kayıtları)
- `kazim-ve-demir/` — eski "Sürüden Korkma" bölümü
- `foxyarif-ornek/` — ilk deneme
- `videolar/` — hazır videolar

## Video üretme

Gereken: Node.js 18+, ffmpeg

```
npm i
npx playwright install chromium
node ortak/sesleri-bol.js bolum5-tohum --kazim bolum5-tohum/kaynak/marcus_kazim.mp3 --demir bolum5-tohum/kaynak/yakup_demir.mp3 --bosluk .9
node ortak/kaydet.js bolum5-tohum --out videolar/bolum5_tohum.mp4
```

Seçenekler: `--fps 30`, `--crf 18` (düşük = daha kaliteli/büyük), `--workers 4`, `--from 10 --to 20` (yalnızca bir aralık).
Önizleme: bölüm klasöründeki `index.html` dosyasını tarayıcıda aç.

### Seslendirme

Kâzım = **Marcus**, Demir = **Yakup Yeşil** (ElevenLabs, Eleven Multilingual v2). Bu sesler ücretsiz planda API'den
kullanılamadığı için sitede üretilir: her karakterin bütün replikleri, aralarında boş satır bırakılarak tek seferde
seslendirilir ve indirilir. `sesleri-bol.js` dosyayı replik uzunluklarına göre parçalara ayırır.

## Yeni bölüm yazma

`bolum5-tohum` klasörünü kopyala, `story.js` içinde `number`, `title`, `quote` (kapanışta deftere yazılan ders) ve `story` satırlarını değiştir.
Her satır: `who` (`kazim` / `demir`), `mood`, `text`; isteğe bağlı:
- `shot`: diyalog planı (`two`, `close-kazim`, `close-demir`, `lantern`, `wide`) ya da ara sahne (`masa`, `tozlu`, `isik`, `tohum`, `ezme`, `calis`, `insa`, `agac`, `acilis`, `dukkan`, `kapanis`);
  bir satırda birden çok plan için `[['close-kazim', 0], ['calis', .3]]` (ikinci plan satırın %30'unda başlar)
- `phase` (sahne fazı), `flash: true` (eski film/anı tonu), `gesture`, `pause` (sonraki satıra kadar saniye), `noSub`
