// Bölüm 10: "Gölge" (dostluk). Demir düşünce sofrası boşalır; Kâzım ona karanlıkta kimin kaldığını anlatır.
// Mekân: yağmurlu çay bahçesi (PLACES.cay_bahcesi). Sahneler: ortak/ara-sahneler-9.js
const EPISODE = {
  number: 10,
  title: 'Gölge',
  quote: 'Kalabalık güneşte toplanır; dost, karanlıkta bilinir.',
  sketch: 'fener',
  cta: 'İzle, öğren, beğen ve takip et.',
  sig: '— Baykuş Kâzım',
  intro: 5.2, openShot: 'sofra', openPhase: 'acilis',   // sinematik açılış: ampullerden süzülen kamera, boş sofrada tek başına Demir, başlık
  tail: 7,
  place: 'cay_bahcesi',
  music: '../muzik/floating_in_reverie_slowed.m4a',
  musicVolume: 0.32, rainVolume: 0.03,
  cast: { kazim: { x: 222, y: 985, s: .6 }, demir: { x: 512, y: 990, s: .56 } },
  kazimRest: { x: 160, y: -306 },   // Kâzım'ın boştaki eli gövdesinin yanında; Demir'e uzanmaz, omzuna dokunmaz
  story: [
    { who: 'demir', mood: 'sad', gesture: 'rest', shot: [['sofra_dolu', 0, null, true], ['sofra', .5, 'bos']], pause: 1.2, text: 'Abi, işlerim iyiyken sofram hep doluydu. Bir kez düştüm; sandalyelerin hepsi boştu.' },
    { who: 'kazim', mood: 'calm', gesture: 'rest', shot: [['wide', 0], ['golge', .2]], pause: 1.6, text: 'Güneşli günde gölgen bile seninle yürür evlat. Ama karanlık çökünce, o bile kaybolur.' },
    { who: 'demir', mood: 'worry', gesture: 'rest', shot: [['close-demir', 0], ['fisilti', .22, 'sir']], pause: 1.2, text: "Sırrımı yalnız Tilki'ye anlattım abi, yalnız ona. Şimdi bütün sokak biliyor; dönüp dolaşıp geldi bana." },
    { who: 'kazim', mood: 'stern', gesture: 'point', shot: [['close-kazim', 0], ['fisilti', .1, 'zincir']], pause: 1.6, text: 'Sana başkasını çekiştiren, başkasına da seni anlatır. Sır tutamayan dil, en yakınını bile satar.' },
    { who: 'demir', mood: 'sad', gesture: 'rest', shot: [['close-demir', 0], ['grup', .1]], pause: 2.2, text: 'Kim çağırsa koştum abi, bir kez bile durmadım. Ama ben çağırınca, kimseyi bulamadım.' },
    { who: 'kazim', mood: 'calm', gesture: 'rest', shot: [['close-kazim', 0], ['two', .55]], pause: 1.4, text: 'Kolay ulaşılan, kolay vazgeçilir evlat. Ne kadar çok koşarsan, o kadar az beklenir.' },
    { who: 'demir', mood: 'worry', gesture: 'chest', shot: 'close-demir', pause: 1.0, text: 'Peki ben de onlar gibi mi olayım abi? Kapımı herkese kapatayım mı?' },
    { who: 'kazim', mood: 'warm', gesture: 'open', raise: true, shot: [['close-kazim', 0], ['lantern', .24], ['fener_ol', .5]], pause: 2.0, text: 'Hayır evlat. Sen gölge olma, fener ol. Gölge karanlıkta kaybolur; fener ise karanlıkta belli olur.' },
    { who: 'demir', mood: 'hope', gesture: 'chest', shot: [['close-demir', 0], ['two', .5]], pause: 1.2, text: 'Herkes gitti abi, kimse dönüp bakmadı. Ama sen, bu yağmurda bile beni bırakmadın.' },
    { who: 'kazim', mood: 'warm', gesture: 'rest', raise: false, shot: [['close-kazim', 0], ['sofra', .42, 'son']], pause: 2.6, text: 'Kalabalık güneşte toplanır evlat; dost ise, karanlıkta bilinir.' },
    { who: 'kazim', mood: 'warm', gesture: 'rest', shot: 'kapanis', noSub: true, text: 'İzle, öğren, beğen ve takip et. Ben, Baykuş Kâzım.' },
  ],
};
if (typeof module !== 'undefined') module.exports = EPISODE;
