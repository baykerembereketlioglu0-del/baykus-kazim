// Bölüm 5: "Fenerin Yağı" — hayır demeyi öğrenmek.
// who: 'kazim' | 'demir'. mood: kazim → calm/stern/warm/sad/surprised, demir → calm/worry/sad/hope/happy/surprised
// İsteğe bağlı: shot ('wide' | 'two' | 'close-kazim' | 'close-demir' | 'lantern'), gesture,
// raise (fener kaldır/indir), light ('dim' feneri söndür, 'bright' yeniden yak), pause (sonraki satıra kadar boşluk, sn)
const EPISODE = {
  number: 5,
  title: 'Fenerin Yağı',
  cast: { kazim: { x: 235, y: 985, s: .6 }, demir: { x: 490, y: 990, s: .56 } },
  story: [
    { who: 'demir', mood: 'worry', shot: 'two', text: 'Abi, dün hayatımda ilk kez birine hayır dedim.' },
    { who: 'demir', mood: 'sad', text: 'Şimdi bana küstü. Kötü biri mi oldum?' },
    { who: 'kazim', mood: 'calm', shot: 'two', raise: true, text: 'Şu fenere bak evlat.' },
    { who: 'kazim', mood: 'calm', shot: 'lantern', text: 'Bütün gece sokağı aydınlatır.' },
    { who: 'kazim', mood: 'stern', shot: 'lantern', light: 'dim', text: 'Ama yağını isteyen herkese dökseydi, sabaha ışık kalmazdı.' },
    { who: 'demir', mood: 'worry', text: 'Yani hayır demek bencillik değil mi?' },
    { who: 'kazim', mood: 'warm', light: 'bright', raise: false, text: 'Hayır demek, yanmaya devam edebilmektir.' },
    { who: 'kazim', mood: 'stern', text: 'Sana sadece evet dediğin için gelen, ışığını değil yağını sever.' },
    { who: 'demir', mood: 'hope', text: 'Demek gerçek dost, hayırımı da duyabilendir.' },
    { who: 'kazim', mood: 'warm', shot: 'two', gesture: 'shoulder', text: 'Unutma… Kendini tüketen fener, kimseye yol gösteremez.' },
  ],
};
if (typeof module !== 'undefined') module.exports = EPISODE;
