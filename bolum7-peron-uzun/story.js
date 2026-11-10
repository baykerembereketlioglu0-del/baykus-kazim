// Bölüm 7 (uzun, ~5 dk): "Peron". Tanışma → mutlu günler → ayrılık → bekleyiş → Kâzım'ın dersleri → iyileşme.
// Atkı: rüzgâr onları tanıştırır, ayrılıkta yine rüzgâr atkıyı Demir'e getirir, sonda Demir atkıyı kendi bırakır.
// Mekânlar: 'istasyon' (gece), 'istasyon_safak'. Sahneler: ortak/ara-sahneler-5.js, ara-sahneler-6.js
const EPISODE = {
  number: 7,
  landscape: true,             // YouTube uzun video: yatay 1920x1080
  title: 'Peron',
  quote: 'Seni bırakanı bırak; kendini bırakma.',
  sketch: 'kalp',
  intro: 27.8, openShots: [['jenerik', 0], ['istasyon_acilis', 21.0]],
  tail: 16,                     // defter sayfası biter, ardından ~12 sn bitiş ekranı
  // Kesimler enerji profiliyle doğrulandı (otomatik bölme Demir 8–11 ve Kâzım'ın son repliğinde yanılıyordu)
  cuts: { kazim: [7.9, 12.1, 18.4, 28.55, 37.0, 45.3, 55.3, 66.05, 74.95, 83.75, 90.2], demir: [3.68, 7.5, 12.22, 17.75, 23.45, 27.1, 31.15, 37.15, 41.75, 44.58, 46.75] },
  place: 'istasyon',
  music: '../muzik/peron_uzun_muzik.m4a',     // Kevin MacLeod: Sad Trio → Touching Moments Two – Higher (CC BY 4.0), bkz. muzik/KUNYE.md
  musicVolume: 0.32, rainVolume: 0.03,
  cast: { kazim: { x: 150, y: 985, s: .6 }, demir: { x: 570, y: 990, s: .56 } },   // yatay kadraj: araları açık (Kâzım'ın eli Demir'e değmesin)
  story: [
    // gece, istasyon: Kâzım fenerle gelir
    { who: 'kazim', mood: 'calm', shot: 'fener', gesture: 'rest', pause: 1.6, text: 'Her gece aynı saatte, aynı peronda… Treni mi bekliyorsun evlat, yoksa geçmişin seni mi bekletiyor?' },
    { who: 'demir', mood: 'sad', demirScarf: true, shot: 'two', pause: 1.2, text: 'Abi, o gittiğinden beri her gece bu istasyona geliyorum.' },
    { who: 'demir', mood: 'sad', shot: 'tren_bos', pause: 2.4, text: 'Her tren geldiğinde, belki o iner diye kalbim duruyor.' },
    { who: 'kazim', mood: 'calm', demirScarf: true, gesture: 'rest', shot: 'two', pause: 2.0, text: 'Anlat bakalım evlat. Bu kırmızı atkının bir hikâyesi var.' },
    // anılar (sepya)
    { who: 'demir', mood: 'hope', shot: 'tanisma', flash: true, pause: 3.0, text: 'Onu ilk burada gördüm abi. Rüzgâr atkısını uçurdu, ben yakaladım.' },
    { who: 'demir', mood: 'hope', shot: 'tanisma', flash: true, pause: 5.5, text: 'Geri verdiğimde gülümsedi. O gün ilk kez, bir trenin hiç gelmemesini istedim.' },
    { who: 'demir', mood: 'hope', shot: 'tren_ici', flash: true, pause: 5.5, text: 'Sonra her sabah aynı trene bindik. O pencereden şehre bakardı, ben ona.' },
    { who: 'demir', mood: 'hope', shot: 'kar', flash: true, pause: 5.5, text: 'Kış gelince atkısını boynuma dolar, üşüme derdi.' },
    { who: 'demir', mood: 'sad', shot: 'son_bakis', flash: true, pause: 4.0, text: 'Bir gün, gitmem lazım dedi. Nedenini bile söylemedi.' },
    { who: 'demir', mood: 'sad', shot: [['ayrilik', 0], ['mevsimler', 2.2]], flash: true, pause: 18.5, text: 'Kapılar kapanırken atkısı rüzgârla bana uçtu. O gitti, atkısı bende kaldı.' },
    // bekleyiş
    { who: 'demir', mood: 'sad', shot: 'mesajlar', pause: 6.5, text: 'O günden beri ona yüzlerce mesaj yazdım. Hiçbirini gönderemedim.' },
    { who: 'mehmetali', mood: 'worry', shot: 'sofra', pause: 1.6, text: 'Oğlum, üç gündür ağzına bir lokma koymadın. Gel, bir çay olsun iç.' },
    { who: 'mehmetali', mood: 'warm', shot: 'sofra', pause: 4.5, text: 'Gidenin ardından kendini aç bırakma evlat. Bu sofra, sen geldikçe kurulur.' },
    // Kâzım'ın dersleri (gece istasyon)
    { who: 'kazim', mood: 'stern', demirScarf: true, gesture: 'rest', shot: [['two', 0], ['close-kazim', .45]], pause: 2.2, text: 'Gelmeyecek birini beklemek sadakat değil evlat. Kendi kalbine yaptığın bir haksızlıktır.' },
    { who: 'kazim', mood: 'calm', demirScarf: true, gesture: 'rest', shot: [['wide', 0], ['close-demir', .5]], pause: 2.0, text: 'Evlat, bazı insanlar ömür boyu kalmak için değil, ders olmak için gelir. Gidişleri canını yakar, ama seni yeniden sana getirir.' },
    { who: 'demir', mood: 'sad', shot: 'veda', flash: true, pause: 5.5, text: 'Onu çok sevmiştim abi. Neden gitti?' },
    { who: 'kazim', mood: 'stern', demirScarf: true, shot: [['close-demir', 0], ['close-kazim', .22]], pause: 2.0, text: 'Neden gittiğini sorma evlat. Cevap, kalbini doyurmaz. Gerçekten seven, gitmek için kendine bahane aramaz.' },
    { who: 'kazim', mood: 'calm', shot: 'mesajlar', phase: 'sil', pause: 5.0, text: 'Gönderemediğin o mesajlar, aslında kendine yazdıkların. Cevabı onda arama evlat. Cevap, sende saklı.' },
    { who: 'kazim', mood: 'calm', shot: 'raylar', pause: 5.0, text: 'Şu raylara bak evlat. Giden tren, ardında kalan için durmaz. Sen de ömür boyu aynı perona bakarsan, hayatın hiç yola koyulmaz.' },
    { who: 'demir', mood: 'sad', demirScarf: true, shot: 'close-demir', gesture: 'clasp', pause: 2.0, text: 'Peki bu acı ne zaman geçecek?' },
    // iyileşme
    { who: 'kazim', mood: 'warm', demirScarf: true, gesture: 'rest', shot: [['gulus', 0], ['two', .56]], pause: 2.5, text: 'Acı, onu unuttuğunda değil, onsuz da gülebildiğinde geçer. Kırık kalp yine atar evlat. Sadece bu sefer, kimi seveceğini daha iyi seçer.' },
    { who: 'kazim', mood: 'warm', gesture: 'rest', shot: 'atki', pause: 6.5, text: 'Unutmak değil mesele. Unutulmayı kabul etmek. Bazen sevmenin en güzel hâli, sessizce gitmesine izin vermek.' },
    { who: 'demir', mood: 'hope', place: 'istasyon_safak', shot: 'close-demir', pause: 2.2, text: 'Onu affettim abi. Şimdi sıra, kendimi affetmekte.' },
    { who: 'kazim', mood: 'warm', place: 'istasyon_safak', gesture: 'rest', shot: [['two', 0], ['sabah_treni', .4]], pause: 4.5, text: 'Seni bırakanı bırak evlat, ama kendini sakın bırakma. Kırılan kalp de iyileşir. Yeter ki o peronda donup kalma.' },
    { who: 'kazim', mood: 'warm', gesture: 'rest', shot: [['yolculuk', 0], ['atki_gokyuzu', 1.5]], pause: 9.0, text: 'Kalbin bir istasyon değil evlat, bir yolculuk. Beklerken değil, yürürken iyileşir.' },
    { who: 'kazim', mood: 'warm', gesture: 'rest', shot: [['kapanis', 0], ['bitis', 1.72]], noSub: true, text: 'İzle, öğren ve sessizce yüksel. Geceyi gören sen olana dek.' },
  ],
};
if (typeof module !== 'undefined') module.exports = EPISODE;
