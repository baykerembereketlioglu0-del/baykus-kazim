// Ara sahneler (7): "Dönüş" (Peron'un devamı). Ela altı ay sonra aynı perondan iner; Demir affeder ama kapıyı açmaz.
// ara-sahneler-5.js (istasyon, tren, Ela) ve ara-sahneler-6.js (kf, scrText, petals) SONRA yüklenir.

// Ela'nın pozu (atkısız: atkı Peron'da rüzgâra bırakıldı)
function elaPose(mood, extra) {
  return Object.assign({}, MOODS.demir[mood], { noScarf: true, blink: 0, L: { x: -148, y: -272, hand: 'relax' }, R: { x: 148, y: -272, hand: 'relax' } }, extra);
}
// Nabız: ekranın kenarları kalp atışıyla kızarır, kamera hafifçe vurur
function heartbeat(lt, a = 1) { const b = Math.max(0, Math.sin(lt * 7.5)) ** 8 * a; if (b > .01) { c.save(); c.setTransform(BASEX, 0, 0, BASEX, 0, 0); c.fillStyle = rg(SW / 2, SH / 2, 200, 800, [[0, 'rgba(0,0,0,0)'], [1, `rgba(120,0,0,${.35 * b})`]]); c.fillRect(0, 0, SW, SH); c.restore(); } return b; }

// ---------- 0) AÇILIŞ (sessiz): 6 ay sonra, şafak. Tren gelir, kapı açılır, Ela iner; Demir donakalır ----------
SCENES.donus_acilis = S => {
  const t = S.t, lt = S.lt, arrive = ease(cl((lt - .5) / 3.0, 0, 1)), doors = ss(3.6, 4.3, lt), seen = ss(4.6, 5.2, lt);
  cam(lerp(380, 360, ss(0, 7, lt)), lerp(720, 760, ss(0, 7, lt)), lerp(1.15, 1.3, ease(ss(0, 7, lt))));
  const tx = lerp(1300, -500, arrive); // 2. vagonun kapısı x 575'te durur
  drawStation(t, { pal: 'dawn', min: 372, train: () => drawTrain(tx, { cars: 3, doors, whoCar: 1, who: (cx, fy) => {
    if (doors < .3) return;
    const pe = elaPose('sad', { t, talk: 0, lookX: -.7, lookY: .1, blink: (lt % 3.6 < .14) ? 1 : 0, tilt: .05 });
    c.save(); c.globalAlpha = ss(.3, .7, doors); c.beginPath(); c.rect(cx - 105, 490, 210, 290); c.clip(); c.translate(cx, fy); c.scale(.27, .27); drawEla(pe); c.restore();
  } }) });
  // Demir solda, sabah trenini bekliyor: sakin; kapıda Ela'yı görünce donar
  const pd = demirPose(seen > .5 ? 'surprised' : 'calm', { t, talk: 0, lookX: lerp(.2, .8, seen), lookY: lerp(.1, -.05, seen), blink: seen > .5 ? 0 : ((lt % 3.9 < .14) ? 1 : 0), tilt: lerp(0, -.04, seen), lid: lerp(.05, -.08, seen), mouth: lerp(8, 0, seen) });
  c.save(); c.translate(225, 1240); c.scale(.6, .6); drawWolf(pd); c.restore();
  heartbeat(lt, ss(5.0, 5.4, lt));
  letterbox(1, 150);
  typeText('6 AY SONRA · SABAH', ss(.4, 2.0, lt), 40, 1222, '600 22px Cinzel,Georgia,serif', 'rgba(250,226,190,.9)');
};

// ---------- 1) YÜZ YÜZE: peronda Ela ve Demir. 'ozur' evresinde Ela özür diler, Demir'in kalbi durur ----------
SCENES.yuz_yuze = S => {
  const t = S.t, lt = S.lt, k = S.k, oz = S.phase === 'ozur';
  if (oz) cam(lerp(420, 470, ease(k)), lerp(760, 700, ease(k)), lerp(1.55, 2.05, ease(k)));
  else cam(lerp(370, 380, k), lerp(780, 760, k), lerp(1.3, 1.4, ease(k)));
  drawStation(t, { pal: 'dawn', min: 373, train: () => drawTrain(-745, { cars: 3, doors: 1, whoCar: 1 }) });
  const pe = elaPose(oz ? 'sad' : 'worry', { t, talk: 0, lookX: .75, lookY: oz ? .35 : .05, blink: (t % 3.3 < .14) ? 1 : 0, tilt: oz ? .09 : .04 });   // kollar yanında (göğüste birleşen patiler top gibi görünüyordu)
  c.save(); c.translate(220, 1200); c.scale(.56, .56); drawEla(pe); c.restore();
  if (oz) { const f = ss(.25, .55, k); c.save(); c.globalAlpha = f; blob([220 + 30, 1200 - .56 * 700, 220 + 34, 1200 - .56 * 670, 220 + 28, 1200 - .56 * 650, 220 + 24, 1200 - .56 * 670], '#9fd2ff', OL, 2); c.restore(); } // gözyaşı
  const pd = demirPose(oz ? 'sad' : 'surprised', { t, talk: S.talk.demir, lookX: -.75, lookY: oz ? .15 : 0, blink: (t % 4.1 < .14) ? 1 : 0, tilt: oz ? -.06 : -.03, lid: oz ? .15 : -.05 });
  c.save(); c.translate(525, 1205); c.scale(.56, .56); drawWolf(pd); c.restore();
  if (oz) heartbeat(lt, ss(.35, .5, k));
};

// ---------- 2) KAPI: aralık kapıdan soğuk rüzgâr giriyor; Demir kapının yanında durur, kendi patisiyle kapıyı iter.
//      Kapı kendi ağırlığıyla kapanır, anahtar deliğinde kalp biçiminde sıcak bir ışık kalır. Demir dönüp bize bakar.
SCENES.kapi_kapan = S => {
  const t = S.t, k = S.k;
  // kapı açıklığı: 1 açık … 0 kapalı. Pati .62'ye kadar iter, gerisini kapı kendi kapanır
  const push = ease(ss(.16, .42, k)), swing = ease(ss(.42, .66, k)), o = lerp(lerp(1, .62, push), 0, swing), glowK = ss(.64, .82, k);
  cam(lerp(400, 392, k), 690, lerp(1.18, 1.26, ease(k)));
  // sıcak iç oda
  c.fillStyle = lg(0, -300, 0, 1300, [[0, '#4a2e1e'], [1, '#24160c']]); c.fillRect(-1000, -300, 2720, 1900);
  c.save(); c.globalAlpha = .16; for (let x = -1008; x < 1720; x += 36) { c.fillStyle = (x / 36) % 2 ? '#2a180e' : '#6a4630'; c.fillRect(x, -300, 18, 1200); } c.restore();
  rr(-1000, 1010, 2720, 900, 0, '#2e1c10', null); line(-1000, 1010, 1720, 1010, '#1a0f08', 8);
  for (let x = -1020; x < 1720; x += 90) line(x, 1020, x - 30, 1400, 'rgba(0,0,0,.25)', 3);
  // kapı kasası (menteşe sağda)
  const DX = 150, DY = 330, DW = 290, DH = 680;
  rr(DX - 28, DY - 28, DW + 56, DH + 28, 6, '#3a2416', OL, 7);
  c.save(); c.beginPath(); c.rect(DX, DY, DW, DH); c.clip(); // aralıktan: soğuk, yağmurlu gece
  c.fillStyle = lg(0, DY, 0, DY + DH, [[0, '#0a1020'], [1, '#1a2438']]); c.fillRect(DX, DY, DW, DH);
  for (let i = 0; i < 30; i++) { const x = DX + hash(i) * DW, y = DY + ((hash(i + 3) * DH + t * 600) % DH); line(x, y, x - 5, y + 26, 'rgba(200,215,240,.35)', 2); }
  c.restore();
  const w = DW * lerp(1, .32, o), sk = 40 * o, ex = DX + DW - w;          // kanadın serbest kenarı x
  const door = [ex, DY + sk, DX + DW, DY, DX + DW, DY + DH, ex, DY + DH - sk];
  poly(door, lg(ex, 0, DX + DW, 0, [[0, '#4a2c18'], [1, '#6a4128']]), OL, 6);
  c.save(); c.beginPath(); c.moveTo(door[0], door[1]); for (let i = 2; i < 8; i += 2) c.lineTo(door[i], door[i + 1]); c.closePath(); c.clip();
  for (const [fy, fh] of [[.08, .36], [.52, .4]]) poly([ex + w * .14, DY + DH * fy + sk * .5, DX + DW - w * .14, DY + DH * fy + sk * .2, DX + DW - w * .14, DY + DH * (fy + fh), ex + w * .14, DY + DH * (fy + fh) - sk * .3], 'rgba(0,0,0,.14)', 'rgba(0,0,0,.35)', 3);
  c.restore();
  const hx = ex + w * .14, hy = DY + DH * .5;                             // kol (serbest kenara yakın)
  ell(hx, hy, 14, 14, '#c9a04a', OL, 4); rr(hx, hy - 6, 34, 12, 6, '#c9a04a', OL, 3);
  if (glowK > 0) { c.save(); c.translate(hx, hy + 46); c.globalAlpha = glowK; const hp = []; for (let i = 0; i <= 30; i++) { const a = i / 30 * TAU; hp.push(16 * Math.sin(a) ** 3 * .9, -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) * .9); } c.beginPath(); smoothPath(hp, true); c.fillStyle = '#ffd890'; c.fill(); c.restore(); addLight(hx, hy + 44, 170 * glowK, `rgba(255,200,120,${.55 * glowK})`); }
  if (o > .05) for (let i = 0; i < 8; i++) { const y = DY + 80 + hash(i) * 520, x = ex + 30 + ((t * 260 + hash(i + 2) * 300) % 300); c.save(); c.globalAlpha = .4 * o; curve([x, y, x + 40, y - 6, x + 90, y + 4], 'rgba(200,220,255,.8)', 3); c.restore(); } // içeri giren soğuk rüzgâr
  // Demir kapının sağında: sol patisi kapının kenarını iter (eklem çözümüyle gerçek kol), sonra kolunu indirip bize döner
  const X0 = 590, Y0 = 1100, SC = .62, reach = push * (1 - ss(.48, .62, k));
  const tx = (ex + 22 - X0) / SC, ty = (hy + 30 - Y0) / SC;               // kapı kenarı, kolun hemen altı
  const L = { x: lerp(-148, tx, reach), y: lerp(-272, ty, reach), hand: reach > .5 ? 'open' : 'relax' };
  const turn = ss(.66, .8, k);
  const pd = demirPose(turn > .5 ? 'hope' : 'sad', { t, talk: 0, lookX: lerp(-.85, .05, turn), lookY: lerp(.1, 0, turn), tilt: lerp(-.05, .02, turn), mouth: lerp(-4, 12, turn), blink: (t % 3.9 < .14) ? 1 : 0, L, R: { x: 148, y: -272, hand: 'relax' } });
  c.save(); c.translate(X0, Y0); c.scale(SC, SC); drawWolf(pd); c.restore();
  dustMotes(t, 22, 0, 200, 720, 800, .35);
  addLight(600, 520, 520, 'rgba(255,180,100,.22)');
};

// ---------- 3) SON SÖZ: Demir cevabını verir; Ela trene biner, kapılar kapanır, tren gider. Demir bu sefer beklemez ----------
SCENES.son_soz = S => {
  const t = S.t, k = S.k, lt = S.lt, board = ss(.42, .52, k), close = ss(.58, .68, k), go = ease(cl((k - .7) / .3, 0, 1)), smile = ss(.8, 1, k);
  cam(lerp(380, 400, ease(k)), lerp(770, 740, k), lerp(1.35, 1.2, ease(ss(.4, 1, k))));
  const tx = -745 - go * 2300; // kapı (2. vagon) Ela'nın arkasında: x 330
  drawStation(t, { pal: 'dawn', min: 375, train: () => drawTrain(tx, { cars: 3, doors: 1 - close, whoCar: 1, who: (cx, fy) => {
    if (board <= 0 || close >= 1) return;
    const pe = elaPose('sad', { t, talk: 0, lookX: .7, lookY: .15, tilt: .06 });
    c.save(); c.globalAlpha = board; c.beginPath(); c.rect(cx - 105, 490, 210, 290); c.clip(); c.translate(cx, fy); c.scale(.27, .27); drawEla(pe); c.restore();
  } }) });
  // peronda Ela (biner binmez kaybolur)
  if (board < 1) { const pe = elaPose('sad', { t, talk: 0, lookX: .75, lookY: .3, tilt: .08, nod: ss(.3, .4, k) * .6, blink: (t % 3.4 < .14) ? 1 : 0 });
    c.save(); c.globalAlpha = 1 - board; c.translate(220, 1200); c.scale(.56, .56); drawEla(pe); c.restore(); }
  // Demir: sakin konuşur; Ela binince trene bakar, tren gidince yüzünü öne çevirip gülümser
  const pd = demirPose(smile > .5 ? 'hope' : 'calm', { t, talk: S.talk.demir, lookX: k < .42 ? -.75 : lerp(-.6, .2, smile), lookY: lerp(.05, -.05, smile), blink: (t % 4.3 < .14) ? 1 : 0,
    tilt: lerp(-.03, .02, smile), mouth: lerp(4, 18, smile), lid: .05 });
  c.save(); c.translate(525, 1205); c.scale(.56, .56); drawWolf(pd); c.restore();
};

// kapanış çizimi: kapalı kapı, anahtar deliği kalp biçiminde
function doorSketch(k, x, y, s = 1) {
  c.save(); c.translate(x, y); c.scale(s, s); c.strokeStyle = '#3a2410'; c.lineWidth = 4; c.lineCap = 'round'; c.lineJoin = 'round';
  const seg = (a, b, pts) => { const kk = cl((k - a) / (b - a), 0, 1); if (kk <= 0) return; c.beginPath(); c.moveTo(pts[0], pts[1]); const n = pts.length / 2 - 1, m = kk * n; for (let i = 1; i <= Math.ceil(m); i++) { const f = Math.min(1, m - (i - 1)); c.lineTo(lerp(pts[i * 2 - 2], pts[i * 2], f), lerp(pts[i * 2 - 1], pts[i * 2 + 1], f)); } c.stroke(); };
  seg(0, .35, [-44, 60, -44, -80, 44, -80, 44, 60]);                       // kasa
  seg(.3, .5, [-58, 60, 58, 60]);                                           // eşik
  seg(.45, .6, [-32, -64, 32, -64, 32, -10, -32, -10, -32, -64]);           // üst tabla
  const H = []; for (let i = 0; i <= 24; i++) { const a = i / 24 * TAU; H.push(16 * Math.sin(a) ** 3 * .55 + 22, -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) * .55 + 18); }
  seg(.65, .95, H);                                                         // kalp anahtar deliği
  c.restore();
}
