// Bölüm 9: "Son El" (kumar). Tilki, Demir'i kıraathanenin arka odasındaki kart masasına oturtur; dükkân parası masada erir.
// Mekân: yağmurlu kıraathane sokağı (drawStreet, tabela KIRAATHANE). Sahneler: ortak/ara-sahneler-8.js
const EPISODE = {
  number: 9,
  title: 'Son El',
  quote: 'Masadan kalkmayı bilmeyen, kaybeder kendini.',
  sketch: 'kart',
  intro: 6.8, openShot: 'kart_acilis',   // sessiz açılış: gece 01:20, arka oda, kartlar dağıtılır, dükkân kavanozu masaya konur
  tail: 7,
  sign: 'KIRAATHANE',
  music: '../muzik/floating_in_reverie_slowed.m4a',
  musicVolume: 0.32, rainVolume: 0.03,
  cast: { kazim: { x: 235, y: 985, s: .6 }, demir: { x: 490, y: 990, s: .56 } },
  story: [
    { who: 'demir', mood: 'happy', gesture: 'rest', shot: 'masa', phase: 'kazan', pause: 1.4, text: 'Abi, Tilki beni arka odadaki masaya oturttu. İlk elde paramı ikiye katladım.' },
    { who: 'demir', mood: 'sad', gesture: 'rest', shot: 'masa', phase: 'kaybet', pause: 2.0, text: 'Sonra bir el daha dedim. Sonra bir el daha… Dükkân için biriktirdiğim her şey gitti.' },
    { who: 'kazim', mood: 'stern', gesture: 'point', shot: [['close-kazim', 0], ['olta', .22]], pause: 2.0, text: 'Evlat, ilk eli sana bilerek kazandırdılar. Olta yemsiz atılmaz; seni yemle tuttular, kancayla yakaladılar.' },
    { who: 'demir', mood: 'worry', gesture: 'rest', shot: 'close-demir', pause: .9, text: 'Ama bir sonraki elde kazanacaktım abi. Hissediyordum.' },
    { who: 'kazim', mood: 'stern', gesture: 'point', shot: [['close-kazim', 0], ['bir_el_daha', .12]], pause: 2.4, text: 'Bir el daha diyen, kaybettiğini kovalar. Kaybettiğini kovalayan, elinde kalanı da kaybeder.' },
    { who: 'kazim', mood: 'calm', gesture: 'rest', shot: [['two', 0], ['kart_el', .4]], pause: 2.0, text: 'Hayat sana kötü kart verebilir evlat, buna kimse engel olamaz. Ama kartlarını bir yabancının masasına sürersen, o oyunda senin hiçbir şansın kalmaz.' },
    { who: 'demir', mood: 'sad', gesture: 'rest', shot: 'close-demir', pause: .9, text: 'Peki şimdi ne yapacağım abi? Her şeyimi kaybettim.' },
    { who: 'kazim', mood: 'warm', gesture: 'rest', shot: [['close-kazim', 0], ['tezgah', .3]], pause: 2.0, text: 'Paranı kaybettin evlat, ama ellerin hâlâ seninle. Masada giden, tezgâhta geri gelir; bir bir, alın teriyle, emekle.' },
    { who: 'demir', mood: 'hope', gesture: 'rest', shot: 'cikis', pause: 4.0, text: 'Kartları masaya bıraktım ve kapıdan çıktım. Bu sefer, bir el daha demedim.' },
    { who: 'kazim', mood: 'stern', gesture: 'rest', shot: [['wide', 0], ['close-kazim', .45]], pause: 1.8, text: 'Kumar önce cebini boşaltır evlat, sonra evini. Masadan kalkmayı bilmeyen, kaybeder kendini.' },
    { who: 'kazim', mood: 'warm', gesture: 'rest', shot: 'kapanis', noSub: true, text: 'İzle, öğren ve sessizce yüksel. Geceyi gören sen olana dek.' },
  ],
};
if (typeof module !== 'undefined') module.exports = EPISODE;
