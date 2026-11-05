// Bölüm 7: "Sonra" — sevdiklerine "sonra" deme. Yeni karakter: Mehmet Ali (Demir'in babası).
// who: 'kazim' | 'demir' | 'mehmetali'. Sahneler: ortak/ara-sahneler*.js
const EPISODE = {
  number: 7,
  title: 'Sonra',
  quote: 'Sevdiklerine sonra deme. Sonra, bazen hiç gelmez.',
  sketch: 'cay',
  intro: 7.0, openShot: 'ev',          // sessiz sinematik açılış: yağmurlu gecede baba evi
  tail: 7,
  music: '../muzik/floating_in_reverie_slowed.m4a',
  musicVolume: 0.32, rainVolume: 0.07,
  cast: { kazim: { x: 235, y: 985, s: .6 }, demir: { x: 490, y: 990, s: .56 } },
  story: [
    { who: 'mehmetali', mood: 'warm', shot: 'cagri', phase: 'ara', text: 'Oğlum, yemeği hazırladım. Gelecek misin?' },
    { who: 'demir', mood: 'worry', shot: 'cagri', phase: 'ara', text: 'Baba, bu akşam olmaz. İşler çok yoğun. Sonra ararım.' },
    { who: 'mehmetali', mood: 'sad', shot: 'cagri', phase: 'kapat', text: 'Tamam oğlum. Sen kendine iyi bak.', pause: 2.2 },
    { who: 'demir', mood: 'worry', shot: 'two', text: 'Abi, babam yine aradı. Ama hiç vaktim yok.' },
    { who: 'kazim', mood: 'stern', shot: 'close-kazim', text: 'Son ne zaman babanın yüzüne doğru düzgün baktın evlat?' },
    { who: 'demir', mood: 'sad', shot: 'close-demir', text: 'Bilmiyorum. Hep sonra diyorum.', pause: 1.2 },
    { who: 'kazim', mood: 'calm', shot: 'bekleyis', text: 'Sen ona sonra derken, o seni her akşam kapıda bekliyor.', pause: 1.6 },
    { who: 'kazim', mood: 'calm', shot: 'saat', text: 'Şu saate bak evlat. Senin için geçen sadece bir akşam. Onun içinse, kalan akşamlardan biri.', pause: 1.4 },
    { who: 'kazim', mood: 'stern', shot: 'bos', flash: 'cold', text: 'Bir gün o kadar meşgul olursun ki, aradığında açacak kimse kalmaz.', pause: 2.0 },
    { who: 'demir', mood: 'worry', shot: 'close-demir', text: 'Abi, ya geç kaldıysam?' },
    { who: 'kazim', mood: 'warm', shot: [['close-kazim', 0], ['kosu', .62]], text: 'Geç kaldığını düşündüğün an, hâlâ vaktin var demektir. Koş evlat.', pause: 2.6 },
    { who: 'mehmetali', mood: 'happy', shot: 'kavusma', phase: 'kapi', text: 'Oğlum. Gelmişsin.', pause: 1.4 },
    { who: 'kazim', mood: 'warm', shot: 'kavusma', phase: 'sarilma', text: 'Unutma. Sevdiklerine sonra deme. Sonra, bazen hiç gelmez.', pause: 1.6 },
    { who: 'kazim', mood: 'warm', shot: 'kapanis', noSub: true, text: 'İzle, öğren ve sessizce yüksel. Geceyi gören sen olana dek.' },
  ],
};
if (typeof module !== 'undefined') module.exports = EPISODE;
