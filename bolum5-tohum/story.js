// Bölüm 5: "Tohum" — hayallerini herkese anlatma.
// Satır alanları: who ('kazim' | 'demir'), mood, text
//   shot: plan adı ya da [[plan, satırın yüzde kaçında başlar (0-1), faz], ...] listesi
//     diyalog planları: 'two', 'close-kazim', 'close-demir', 'lantern', 'wide'
//     ara sahneler (ortak/ara-sahneler.js): masa, tozlu, isik, tohum, ezme, calis, insa, agac, acilis, dukkan, kapanis
//   phase: sahne fazı, flash: true → eski film (anı) tonu, gesture, noSub: altyazı gösterme
const EPISODE = {
  number: 5,
  title: 'Tohum',
  quote: 'Planını değil, sonucunu göster.',
  tail: 6.4,
  music: '../muzik/floating_in_reverie_slowed.m4a', // fon müziği (Moayad Aljabal - Floating In Reverie, slowed)
  musicVolume: 0.32, rainVolume: 0.07,
  cast: { kazim: { x: 235, y: 985, s: .6 }, demir: { x: 490, y: 990, s: .56 } },
  story: [
    { who: 'demir', mood: 'sad', shot: 'masa', phase: 'goster', flash: true, text: 'Abi, hayallerimi en yakınlarıma anlattım.' },
    { who: 'demir', mood: 'sad', shot: 'masa', phase: 'gul', flash: true, text: 'Kendi dükkânımı açacağım dedim. Hepsi gülüp geçti.' },
    { who: 'demir', mood: 'sad', shot: 'masa', phase: 'isaret', flash: true, text: 'Sen mi, önce kendine bak dediler.', pause: 1.1 },
    { who: 'demir', mood: 'sad', shot: 'tozlu', text: 'O günden beri defterimi hiç açmadım.' },
    { who: 'kazim', mood: 'stern', shot: 'close-kazim', text: 'Peki sana gülenlerin kaçı, kendi hayalinin peşinden gitti evlat?' },
    { who: 'demir', mood: 'sad', shot: 'close-demir', text: 'Hiçbiri.', pause: 1.0 },
    { who: 'kazim', mood: 'calm', shot: 'two', text: 'İşte bu yüzden güldüler. Senin cesaretin, onlara kendi korkularını hatırlattı.' },
    { who: 'kazim', mood: 'stern', shot: 'isik', text: 'Bir hayali öldürmenin en kolay yolu, onu yanlış kişiye anlatmaktır.', pause: 1.3 },
    { who: 'kazim', mood: 'calm', shot: 'tohum', phase: 'kok', text: 'Şu tohuma bak evlat. Toprağa gömülür, kimse görmez. Karanlıkta, sessizce kök salar.' },
    { who: 'kazim', mood: 'stern', shot: 'tohum', phase: 'esele', text: 'Ama her gün biri gelip toprağı eşelerse, asla filizlenemez.' },
    { who: 'kazim', mood: 'stern', shot: 'ezme', text: 'Hayallerin de tohum gibidir. Kök salmadan herkese gösterirsen, ayaklar altında kalır.', pause: 1.1 },
    { who: 'demir', mood: 'worry', shot: 'close-demir', text: 'Yani susmalı mıyım?' },
    { who: 'kazim', mood: 'stern', shot: [['close-kazim', 0], ['calis', .3]], text: 'Susma. Çalış. Planını değil, sonucunu göster.' },
    { who: 'kazim', mood: 'calm', shot: 'insa', text: 'Kimse ilk tuğlayı alkışlamaz. Ama bina bittiğinde, herkes başını kaldırıp bakar.' },
    { who: 'kazim', mood: 'warm', shot: 'agac', text: 'Gürültüyle büyüyen bir ağaç gördün mü hiç?', pause: 1.7 },
    { who: 'demir', mood: 'hope', shot: [['close-demir', 0], ['acilis', .35]], text: 'Demek ki onlara değil, kendime kanıtlamam gerekiyormuş.', pause: 1.0 },
    { who: 'kazim', mood: 'warm', shot: 'dukkan', text: 'Unutma; sana yapamazsın diyenler, ancak yaptığında susar.' },
    { who: 'kazim', mood: 'warm', shot: 'kapanis', noSub: true, text: 'İzle, öğren ve sessizce yüksel. Geceyi gören sen olana dek.' },
  ],
};
if (typeof module !== 'undefined') module.exports = EPISODE;
