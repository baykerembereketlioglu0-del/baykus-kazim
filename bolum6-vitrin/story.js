// Bölüm 6: "Vitrin" — başkasının vitriniyle kendi hayatını kıyaslama.
// Mekânlar (place): 'iskele' (gece, deniz), 'cati' (şafak), varsayılan 'sokak'. Sahneler: ortak/ara-sahneler*.js
const EPISODE = {
  number: 6,
  title: 'Vitrin',
  quote: 'Başkasının vitriniyle kendi hayatını kıyaslama.',
  sketch: 'kare',
  intro: 6.5, openShot: 'yatak',      // sessiz sinematik açılış: gece 03:12, telefon ışığında Demir
  tail: 7,
  cuts: { kazim: [4.1, 9.3, 13.5, 16.8, 21.4, 28.7, 30.8, 36.0] }, // enerji grafiğiyle doğrulandı
  place: 'iskele',
  music: '../muzik/floating_in_reverie_slowed.m4a',
  musicVolume: 0.32, rainVolume: 0.0,
  cast: { kazim: { x: 235, y: 985, s: .6 }, demir: { x: 490, y: 990, s: .56 } },
  story: [
    { who: 'demir', mood: 'sad', shot: 'akis', text: 'Abi, herkes çok mutlu. Bir tek ben yerimde sayıyorum.' },
    { who: 'demir', mood: 'sad', shot: 'akis', text: 'Tilki tatilde, Kedi yeni araba almış, Ayı her akşam başka bir restoranda.' },
    { who: 'demir', mood: 'sad', shot: 'yatak', phase: 'oda', text: 'Benim hayatım ise, bu oda.', pause: 1.6 },
    { who: 'kazim', mood: 'calm', shot: 'two', text: 'Evlat, sen onların vitrinine bakıp kendi deponla kıyaslıyorsun.' },
    { who: 'demir', mood: 'worry', shot: 'close-demir', text: 'Ne demek istiyorsun?' },
    { who: 'kazim', mood: 'stern', shot: 'close-kazim', text: 'Bir fotoğraf, hikâyenin sadece bir karesidir. Kareden çıkınca bak bakalım.', pause: 1.0 },
    { who: 'kazim', mood: 'calm', shot: 'kare_tatil', text: 'O tatil fotoğrafı, bir yıl ödenecek taksitlerle çekildi.', pause: 1.2 },
    { who: 'kazim', mood: 'calm', shot: 'kare_araba', text: 'O araba, sadece bir saatliğine kiralandı.', pause: 1.2 },
    { who: 'kazim', mood: 'stern', shot: 'kare_sofra', text: 'O sofrada herkes gülüyor. Ama kimse birbirinin gözüne bakmıyor.', pause: 1.4 },
    { who: 'demir', mood: 'surprised', shot: 'close-demir', text: 'Yani, kimse göründüğü kadar mutlu değil mi?' },
    { who: 'kazim', mood: 'warm', shot: 'anlar', text: 'Mutluluk, paylaşılan karede değil evlat. Paylaşılmayan anlardadır.', pause: 1.4 },
    { who: 'kazim', mood: 'warm', place: 'cati', shot: [['cebe', 0], ['two', .7]], text: 'Başkasının vitrinine bakmayı bırak.', pause: 2.4 }, // kayıtta 'Kendi hayatını yaşamaya başla.' yok
    { who: 'kazim', mood: 'warm', place: 'cati', shot: 'wide', gesture: 'shoulder', text: 'Unutma. Kimsenin vitrini, senin hayatından daha gerçek değildir.', pause: 1.6 },
    { who: 'kazim', mood: 'warm', shot: 'kapanis', noSub: true, text: 'İzle, öğren ve sessizce yüksel. Geceyi gören sen olana dek.' },
  ],
};
if (typeof module !== 'undefined') module.exports = EPISODE;
