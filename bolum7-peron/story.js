// Bölüm 7: "Peron" (aşk acısı). Gidenin ardından aynı perona bakıp kalmak.
// Mekânlar (place): 'istasyon' (gece, yağmur), 'istasyon_safak' (şafak). Sahneler: ortak/ara-sahneler-5.js
const EPISODE = {
  number: 7,
  title: 'Peron',
  quote: 'Seni bırakanı bırak; kendini bırakma.',
  sketch: 'kalp',
  intro: 6.8, openShot: 'istasyon_acilis',   // sessiz sinematik açılış: gece 23:47, son tren gelir, kimse inmez
  tail: 7,
  place: 'istasyon',
  music: '../muzik/floating_in_reverie_slowed.m4a',
  musicVolume: 0.32, rainVolume: 0.12,
  cast: { kazim: { x: 235, y: 985, s: .6 }, demir: { x: 490, y: 990, s: .56 } },
  story: [
    { who: 'demir', mood: 'sad', shot: 'wide', text: 'Abi, o gittiğinden beri her gece bu istasyona geliyorum.' },
    { who: 'demir', mood: 'sad', shot: 'tren_bos', text: 'Her tren geldiğinde, belki o iner diye kalbim duruyor.', pause: 1.2 },
    { who: 'kazim', mood: 'calm', shot: 'two', text: 'Evlat, bazı insanlar ömür boyu kalmak için değil, ders olmak için gelir. Gidişleri canını yakar, ama seni yeniden sana getirir.', pause: 1.0 },
    { who: 'demir', mood: 'sad', shot: 'veda', flash: true, text: 'Onu çok sevmiştim abi. Neden gitti?', pause: 1.6 },
    { who: 'kazim', mood: 'stern', shot: 'close-kazim', text: 'Neden gittiğini sorma evlat. Cevap, kalbini doyurmaz. Gerçekten seven, gitmek için kendine bahane aramaz.', pause: 1.0 },
    { who: 'kazim', mood: 'calm', shot: 'raylar', text: 'Şu raylara bak evlat. Giden tren, ardında kalan için durmaz. Sen de ömür boyu aynı perona bakarsan, hayatın hiç yola koyulmaz.', pause: 1.2 },
    { who: 'demir', mood: 'sad', shot: 'close-demir', gesture: 'chest', text: 'Peki bu acı ne zaman geçecek?', pause: .8 },
    { who: 'kazim', mood: 'warm', shot: 'gulus', text: 'Acı, onu unuttuğunda değil, onsuz da gülebildiğinde geçer. Kırık kalp yine atar evlat. Sadece bu sefer, kimi seveceğini daha iyi seçer.', pause: 1.2 },
    { who: 'kazim', mood: 'warm', shot: 'atki', text: 'Unutmak değil mesele. Unutulmayı kabul etmek. Bazen sevmenin en güzel hâli, sessizce gitmesine izin vermek.', pause: 1.4 },
    { who: 'demir', mood: 'hope', place: 'istasyon_safak', shot: 'close-demir', text: 'Onu affettim abi. Şimdi sıra, kendimi affetmekte.', pause: 1.2 },
    { who: 'kazim', mood: 'warm', place: 'istasyon_safak', gesture: 'rest', shot: [['two', 0], ['sabah_treni', .4]], text: 'Seni bırakanı bırak evlat, ama kendini sakın bırakma. Kırılan kalp de iyileşir. Yeter ki o peronda donup kalma.', pause: 2.0 },
    { who: 'kazim', mood: 'warm', shot: 'kapanis', noSub: true, text: 'İzle, öğren ve sessizce yüksel. Geceyi gören sen olana dek.' },
  ],
};
if (typeof module !== 'undefined') module.exports = EPISODE;
