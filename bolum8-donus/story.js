// Bölüm 8: "Dönüş" (Peron'un devamı). Altı ay sonra Ela aynı perondan iner. Demir affeder ama kapıyı açmaz.
// Mekânlar: 'iskele' (gece konuşma), 'cati' (şafak). Sahneler: ortak/ara-sahneler-5/6/7.js
const EPISODE = {
  number: 8,
  title: 'Dönüş',
  quote: 'Affetmek, kapıyı yeniden açmak değildir.',
  sketch: 'kapi',
  intro: 6.8, openShot: 'donus_acilis',   // sessiz açılış: 6 ay sonra sabah, tren gelir, Ela iner
  tail: 7,
  place: 'iskele',
  music: '../muzik/floating_in_reverie_slowed.m4a',
  musicVolume: 0.32, rainVolume: 0,
  cast: { kazim: { x: 235, y: 985, s: .6 }, demir: { x: 490, y: 990, s: .56 } },
  story: [
    { who: 'demir', mood: 'surprised', gesture: 'rest', shot: 'yuz_yuze', pause: 1.0, text: 'Abi, o geri döndü. Aynı perondan indi, sanki hiç gitmemiş gibi.' },
    { who: 'demir', mood: 'sad', gesture: 'rest', shot: 'yuz_yuze', phase: 'ozur', pause: 1.8, text: 'Seni özledim dedi, hata yaptım dedi. Kalbim yine aynı yerde durdu.' },
    { who: 'kazim', mood: 'calm', gesture: 'rest', shot: 'two', pause: 1.2, text: 'Evlat, bir kere giden, dönüş yolunu da bilir. Bugün kapını çalan, yarın yine gidebilir.' },
    { who: 'demir', mood: 'sad', shot: 'close-demir', gesture: 'rest', pause: .9, text: 'Ama onu hâlâ seviyorum abi. Ya bir daha kimseyi bu kadar sevemezsem?' },
    { who: 'kazim', mood: 'warm', gesture: 'rest', shot: [['close-kazim', 0], ['tohum', .3]], pause: 1.4, text: 'Sevgi bir kere bitmez evlat, sadece yer değiştirir. Doğru kalbe gittiğinde, seni de yeniden yeşertir.' },
    { who: 'kazim', mood: 'stern', gesture: 'rest', shot: 'wide', pause: 1.2, text: 'Giderken arkasına bakmayan, dönünce gözünün içine bakıyorsa; aradığı sen değilsin evlat, kaybettiği limandır.' },
    { who: 'demir', mood: 'worry', shot: 'close-demir', gesture: 'chest', pause: .9, text: 'Ama onu affettim abi. Affettiysem, kapıyı açmam gerekmez mi?' },
    { who: 'kazim', mood: 'stern', gesture: 'point', shot: [['close-kazim', 0], ['kapi_kapan', .38]], pause: 1.6, text: 'Affetmek bir merhemdir evlat, yaranı sarar. Ama kapıyı yeniden açmak, aynı yarayı yeniden yarar.' },
    { who: 'demir', mood: 'hope', gesture: 'rest', shot: 'son_soz', pause: 6.0, text: 'Ona dedim ki: Seni affettim. Ama ben artık o perondaki çocuk değilim.' },
    { who: 'kazim', mood: 'warm', place: 'cati', gesture: 'rest', shot: [['gulus', 0], ['two', .5]], pause: 1.8, text: 'Kalbin kırıldığı yere değil, iyileştiği yere bağlan. Seni bırakana değil, seni bırakmayana yaslan.' },
    { who: 'kazim', mood: 'warm', gesture: 'rest', shot: 'kapanis', noSub: true, text: 'İzle, öğren ve sessizce yüksel. Geceyi gören sen olana dek.' },
  ],
};
if (typeof module !== 'undefined') module.exports = EPISODE;
