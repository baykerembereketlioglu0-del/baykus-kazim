// Hikaye: "Sürüden Korkma". who: 'kazim' (Baykuş Kâzım) | 'demir' (Kurt Demir)
const STORY = [
  { who: 'demir', mood: 'worry', text: 'Kâzım Usta, sürüye katılmaktan korkuyorum.' },
  { who: 'kazim', mood: 'calm',  text: 'Neden korkuyorsun, evlat?' },
  { who: 'demir', mood: 'sad',   text: 'Ya beni sevmezlerse? Ya fazla sessiz bulurlarsa?' },
  { who: 'kazim', mood: 'calm',  text: 'Bana bak. Sürüden korkma.' },
  { who: 'kazim', mood: 'warm',  text: 'Sürü, kendinden korkanların kalabalığıdır.' },
  { who: 'demir', mood: 'worry', text: 'Peki ben ne yapacağım?' },
  { who: 'kazim', mood: 'calm',  text: 'Önce kendi sesini duy. Sürü seni zaten bulur.' },
  { who: 'demir', mood: 'sad',   text: 'Ya yanılırsam?' },
  { who: 'kazim', mood: 'warm',  text: 'Yanılmak, yürüyenlerin hakkıdır. Oturanlar yanılmaz, sadece geç kalır.' },
  { who: 'demir', mood: 'hope',  text: 'Teşekkür ederim, Kâzım Usta.' },
  { who: 'kazim', mood: 'warm',  text: 'Git evlat. Gecenin senin sesine ihtiyacı var.' },
];
if (typeof module !== 'undefined') module.exports = STORY;
