// Bölüm 6: "Şemsiye" — seni yedekte tutana öncelik olma.
// Satır alanları için bolum5-tohum/story.js'e bak. Sahneler: ortak/ara-sahneler.js + ortak/ara-sahneler-2.js
const EPISODE = {
  number: 6,
  title: 'Şemsiye',
  quote: 'Seni yedekte tutana öncelik olma.',
  sketch: 'semsiye',
  tail: 7,
  intro: 1.0,
  music: '../muzik/floating_in_reverie_slowed.m4a',
  musicVolume: 0.32, rainVolume: 0.07,
  cast: { kazim: { x: 235, y: 985, s: .6 }, demir: { x: 490, y: 990, s: .56 } },
  story: [
    { who: 'demir', mood: 'worry', shot: 'telefon', phase: 'bildirim', text: 'Abi, yine yazdı. Üç gündür ortada yoktu.', pause: 1.4 },
    { who: 'demir', mood: 'sad', shot: 'kapi', flash: true, text: 'Canı sıkılınca hep beni arıyor. Ben de her seferinde koşuyorum.' },
    { who: 'demir', mood: 'sad', shot: 'telefon', phase: 'gorundu', text: 'Ama ben ona yazınca, saatlerce cevap gelmiyor.', pause: 1.5 },
    { who: 'kazim', mood: 'stern', shot: 'close-kazim', text: 'Peki o seni en son ne zaman, hiçbir şeye ihtiyacı yokken aradı evlat?' },
    { who: 'demir', mood: 'sad', shot: 'close-demir', text: 'Hatırlamıyorum.', pause: 1.0 },
    { who: 'kazim', mood: 'calm', shot: 'two', text: 'Bak evlat. Bazı insanlar seni sevmez, sana alışır.' },
    { who: 'kazim', mood: 'stern', shot: 'close-kazim', text: 'Alışkanlık sevgiye benzer. Ama sevgi değildir.' },
    { who: 'kazim', mood: 'stern', shot: 'telefon', phase: 'liste', text: 'Sana sadece canı sıkılınca yazan, seni değil, can sıkıntısının ilacını arar.', pause: 1.9 },
    { who: 'kazim', mood: 'calm', shot: 'semsiye', phase: 'yagmur', text: 'Şu şemsiyeye bak evlat. Yağmur yağınca herkes onu arar. Güneş açınca bir köşede unutulur.', pause: 1.0 },
    { who: 'kazim', mood: 'warm', shot: 'semsiye', phase: 'unutuldu', text: 'Sen de onun şemsiyesisin. Fırtınasında hatırlanıyor, güneşinde unutuluyorsun.', pause: 1.9 },
    { who: 'demir', mood: 'worry', shot: 'close-demir', text: 'Ama onu kaybetmekten korkuyorum.' },
    { who: 'kazim', mood: 'stern', shot: 'close-kazim', text: 'Seni kaybetmekten korkmayan birini, kaybetmekten korkma.', pause: 1.4 },
    { who: 'demir', mood: 'hope', shot: [['close-demir', 0], ['ters', .4]], text: 'Demek ki ben onun için bir seçenekmişim. O ise benim için öncelikti.', pause: 1.7 },
    { who: 'kazim', mood: 'warm', shot: 'yuruyus', text: 'Unutma. Seni yedekte tutana, öncelik olma.', pause: 2.0 },
    { who: 'kazim', mood: 'warm', shot: 'kapanis', noSub: true, text: 'İzle, öğren ve sessizce yüksel. Geceyi gören sen olana dek.' },
  ],
};
if (typeof module !== 'undefined') module.exports = EPISODE;
