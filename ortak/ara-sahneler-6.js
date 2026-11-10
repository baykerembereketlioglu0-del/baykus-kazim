// Ara sahneler (6): "Peron" uzun bölüm (5 dk): jenerik, fenerle gelen Kâzım, ilk karşılaşma, trende, kar, son bakış,
// gönderilmeyen mesajlar, babanın sofrası, yeni yol. ara-sahneler-5.js'ten SONRA yüklenir (istasyon, tren, Ela, atkı oradan).

ST_PAL.snow = { sky: ['#9aa6b4', '#e4e8ec'], far: '#8f98a4', plat: '#c9ccd0', floor: ['#eef0f2', '#c8ccd2'], roof: '#4a4c54', pillar: '#3f6a5c', lamp: 0 };
const RED_SCARF = { scarf: '#c8302a', scarfD: '#8e1c18' };

// Anahtar kareler: keys = [[zaman, x, y], ...] → yumuşak geçişli [x, y]
function kf(tt, keys) {
  if (tt <= keys[0][0]) return [keys[0][1], keys[0][2]];
  for (let i = 0; i < keys.length - 1; i++) if (tt < keys[i + 1][0]) { const a = keys[i], b = keys[i + 1], f = ease((tt - a[0]) / Math.max(.001, b[0] - a[0])); return [lerp(a[1], b[1], f), lerp(a[2], b[2], f)]; }
  const z = keys[keys.length - 1]; return [z[1], z[2]];
}
// Ekran koordinatında (720x1280) yazı
function scrText(txt, x, y, font, fill, a = 1, sp = 0, glowCol) {
  if (a <= 0) return;
  if (LAND) { x += (SW - 720) / 2; y = y * SH / 1280; }
  c.save(); c.setTransform(BASEX, 0, 0, BASEX, 0, 0); c.globalAlpha = cl(a, 0, 1); c.font = font; c.textAlign = 'center'; c.letterSpacing = sp + 'px';
  if (glowCol) { c.shadowColor = glowCol; c.shadowBlur = 30; }
  c.lineWidth = 6; c.strokeStyle = 'rgba(0,0,0,.55)'; c.lineJoin = 'round'; c.strokeText(txt, x + sp / 2, y);
  c.fillStyle = fill; c.fillText(txt, x + sp / 2, y); c.restore();
}
function scrFade(a, col = '0,0,0') { if (a <= 0) return; c.save(); c.setTransform(BASEX, 0, 0, BASEX, 0, 0); c.fillStyle = `rgba(${col},${cl(a, 0, 1)})`; c.fillRect(0, 0, SW, SH); c.restore(); }
// Bulanık sabit arka plan: bir kez küçük tuvale çizilir, büyütülerek kullanılır (her karede bulanıklık filtresi çok yavaş)
let SOFT_BG = null;
function softBg(drawFn) {
  const W = c.canvas.width, H = c.canvas.height;
  if (!SOFT_BG) {
    const m = c.getTransform(), off = document.createElement('canvas'); off.width = W / 10 | 0; off.height = H / 10 | 0;
    const g = off.getContext('2d'), prev = c, n = LIGHTS.length; c = g; g.setTransform(m.a / 10, m.b / 10, m.c / 10, m.d / 10, m.e / 10, m.f / 10);
    drawFn(); LIGHTS.length = n; c = prev; SOFT_BG = off;
  }
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.imageSmoothingEnabled = true; c.imageSmoothingQuality = 'high'; c.drawImage(SOFT_BG, 0, 0, W, H); c.restore();
}
// Kartın içinde baş portresi (dairesel)
function portrait(cx, cy, r, headY, sc, fn, bg) {
  c.save(); c.beginPath(); c.arc(cx, cy, r, 0, TAU); c.clip();
  c.fillStyle = rg(cx, cy - r * .3, 10, r * 1.2, bg); c.fillRect(cx - r, cy - r, r * 2, r * 2);
  c.translate(cx, cy - headY * sc); c.scale(sc, sc); fn(); c.restore();
  ell(cx, cy, r, r, null, '#d9a441', 5); ell(cx, cy, r + 9, r + 9, null, 'rgba(217,164,65,.35)', 2);
}
// Uçuşan bahar yaprakları / kar taneleri
function petals(t, n, col, sp = 1) {
  for (let i = 0; i < n; i++) {
    const x = ((hash(i) * 900 + t * (40 + 30 * hash(i + 2)) * sp) % 900) - 90, y = ((hash(i + 5) * 1400 + t * (50 + 40 * hash(i + 7))) % 1400) - 60;
    c.save(); c.translate(x + Math.sin(t * 1.3 + i) * 20, y); c.rotate(t * (1 + hash(i)) + i); ell(0, 0, 9, 5, col, null); c.restore();
  }
}
function snow(t, n, a = 1) {
  for (let i = 0; i < n; i++) {
    const x = ((hash(i) * 900 + Math.sin(t * .6 + i) * 30) % 900) - 90, y = ((hash(i + 5) * 1400 + t * (40 + 50 * hash(i + 7))) % 1400) - 60, r = 2 + hash(i + 3) * 4;
    ell(x, y, r, r, `rgba(255,255,255,${(.5 + .5 * hash(i + 9)) * a})`, null);
  }
}

// ---------- 0) JENERİK (~21 sn): istasyon, geçen tren, saat ve başlık, oyuncu kartları ----------
SCENES.jenerik = S => {
  const t = S.t, lt = S.lt;
  if (lt < 9.6) { // A) yağmurlu gece, boş peron; tren hızla geçer
    const pass = cl((lt - 4.2) / 3.6, 0, 1), k = lt / 9.6;
    cam(lerp(300, 430, ease(k)), lerp(660, 700, k), lerp(1.02, 1.12, k));
    drawStation(t, { pal: 'night', min: 1425, train: pass > 0 && pass < 1 ? () => drawTrain(lerp(1600, -5300, pass), { cars: 6, doors: 0 }) : null });
    if (pass > 0 && pass < 1) { c.save(); c.globalAlpha = .25; for (let i = 0; i < 14; i++) line(-300, 470 + i * 24, 1100, 470 + i * 24, 'rgba(255,220,160,.35)', 2); c.restore(); } // hız çizgileri
    screenRain(t, 0, .6); screenRain(t, 1, .8);
  } else if (lt < 15) { // B) istasyon saatine yakın çekim, başlık
    const k = (lt - 9.6) / 5.4;
    cam(lerp(520, 545, k), lerp(250, 225, k), lerp(2.3, 2.7, ease(k)));
    drawStation(t, { pal: 'night', min: 1426 });
    screenRain(t, 1, .7);
  } else { // C) oyuncu kartları: bulanık peron üstünde portreler
    cam(360, 640, 1.08);
    softBg(() => drawStation(t, { pal: 'night', min: 1427 }));
    LIGHTS = [];
    scrFade(.55);
    const cards = [
      ['KURT DEMİR', 'bekleyen', -728, .5, () => drawWolf(demirPose('calm', { t, talk: 0, lookX: .1, lookY: 0, blink: (t % 3 < .12) ? 1 : 0, heldScarf: false }))],
      ['ELA', 'giden', -728, .5, () => drawEla(Object.assign({}, MOODS.demir.calm, { t, talk: 0, lookX: -.2, lookY: .1, blink: 0, mouth: 6, L: { x: -148, y: -272, hand: 'relax' }, R: { x: 148, y: -272, hand: 'relax' } }))],
      ['MEHMET ALİ', 'baba', -712, .5, () => drawMehmetAli(Object.assign({}, MOODS.mehmetali.warm, { t, talk: 0, lookX: .1, lookY: 0, blink: 0, L: { x: -140, y: -300, hand: 'relax' }, R: { x: 140, y: -300, hand: 'relax' } }))],
      ['ve BAYKUŞ KÂZIM', 'anlatan', -852, .42, () => drawOwl(Object.assign({}, MOODS.kazim.warm, { t, talk: 0, lookX: 0, lookY: .1, blink: 0, tilt: 0, nod: 0, R: { x: 186, y: -300, hand: 'relax' }, L: { x: -215, y: -310, hand: 'fist' }, lantern: .7 }))],
    ];
    const per = 1.45, i = Math.min(cards.length - 1, Math.floor((lt - 15) / per)), cl0 = (lt - 15) - i * per, a = ss(0, .3, cl0) * (i === cards.length - 1 ? 1 : 1 - ss(per - .3, per, cl0));
    const [name, role, hy, sc, fn] = cards[i];
    c.save(); c.setTransform(BASEX, 0, 0, BASEX, 0, 0); c.globalAlpha = a;
    const z = 1 + .04 * cl0;
    const PX = LAND ? SW / 2 : 360, PY = LAND ? 270 : 560, PR = LAND ? 132 : 150;
    c.translate(PX, PY); c.scale(z, z); c.translate(-PX, -PY);
    portrait(PX, PY, PR, hy + 40, sc * PR / 150, fn, [[0, '#3a2c1e'], [1, '#0e0a08']]);
    c.restore(); LIGHTS = [];
    scrText(name, 360, LAND ? 820 : 790, '700 46px Cinzel,Georgia,serif', '#f2c463', a, 6);
    scrText(role, 360, LAND ? 900 : 850, '700 40px Caveat,cursive', 'rgba(243,230,204,.85)', a);
  }
  letterbox(1, 150);
  // yazılar
  scrText('BAYKUŞ KAZIM', 360, 650, '600 34px Cinzel,Georgia,serif', '#e8cea0', ss(1.2, 2.2, lt) * (1 - ss(3.8, 4.5, lt)), 12);
  scrText("Kâzım'ın Defteri'nden", 360, 650, '700 58px Caveat,cursive', '#f3e6cc', ss(5.2, 6.0, lt) * (1 - ss(8.4, 9.2, lt)));
  const ta = ss(10.4, 11.4, lt) * (1 - ss(14.2, 14.9, lt));
  scrText('PERON', 360, 1010, '900 120px Cinzel,Georgia,serif', '#f2c463', ta, 10, 'rgba(255,170,70,.8)');
  scrText('Bir istasyon. Bir atkı. Bir veda.', 360, 1080, '700 40px Caveat,cursive', '#f3e6cc', ss(11.4, 12.2, lt) * (1 - ss(14.2, 14.9, lt)));
  if (lt > 10.6 && lt < 14.8) { const f = (lt - 10.6) / 4.2; c.save(); c.setTransform(BASEX, 0, 0, BASEX, 0, 0); c.translate(lerp(-120, 840, f), 360 + Math.sin(f * PI * 2) * 60); c.scale(.7, .7); windScarf(0, 0, PI + .15, 230, t, 26); c.restore(); } // kırmızı atkı süzülür
  // bölümler arası kararmalar
  scrFade(1 - ss(0, 1.2, lt)); scrFade(ss(9.2, 9.6, lt) * (1 - ss(9.6, 10.0, lt))); scrFade(ss(14.6, 15.0, lt) * (1 - ss(15.0, 15.4, lt))); scrFade(ss(20.4, 21.0, lt));
};

// ---------- 1) FENER: Demir yalnız; soldan sıcak bir ışık; kamera açılınca Kâzım feneriyle orada ----------
SCENES.fener = S => {
  const t = S.t, lt = S.lt, k = S.k, rev = ease(ss(.18, .62, k)), light = ss(0, .3, k);
  cam(lerp(500, 350, rev), lerp(640, 700, rev), lerp(2.3, 1.3, rev));
  drawStation(t, { pal: 'night', min: 1428 });
  screenRain(t, 0, .6);
  const pk = Object.assign({}, MOODS.kazim.calm, { t, talk: S.talk.kazim, lookX: .5, lookY: .1, blink: (t % 3.3 < .14) ? 1 : 0, tilt: .02, nod: 0,
    R: { x: 186, y: -300, hand: 'relax' }, L: { x: -200, y: -640, hand: 'fist' }, lantern: light });
  c.save(); c.translate(235, 985); c.scale(.6, .6); drawOwl(pk); c.restore();
  const turn = ss(.1, .3, k);
  const pd = demirPose(turn > .5 ? 'surprised' : 'sad', { t, talk: S.talk.demir, lookX: lerp(.2, -.85, turn), lookY: lerp(.6, 0, turn), tilt: lerp(.05, -.03, turn), blink: (t % 3.7 < .14) ? 1 : 0,
    L: { x: -24, y: -448, hand: 'relax' }, R: { x: 24, y: -442, hand: 'relax' }, heldScarf: true });
  c.save(); c.translate(490, 990); c.scale(.56, .56); drawWolf(pd); c.restore();
  // sol kenardan yaklaşan sıcak ışık (Kâzım'ın feneri, kadraj dışından)
  addLight(lerp(60, 120, light), 560, 520 * light, `rgba(255,170,70,${.5 * light})`);
  screenRain(t, 1, .7);
};

// ---------- 2) İLK KARŞILAŞMA (anı, bahar): atkı uçar, Demir yakalar, Ela'ya geri verir ----------
SCENES.tanisma = S => {
  const t = S.t, lt = S.lt;
  cam(lerp(365, 370, ss(0, 12, lt)), lerp(860, 840, ss(0, 12, lt)), lerp(1.25, 1.38, ss(0, 12, lt)));
  drawStation(t, { pal: 'day', min: 495, train: () => drawTrain(-845, { cars: 3, doors: 0, day: true, lights: false }) });
  petals(t, 26, 'rgba(255,190,205,.85)', .8);
  const EX = 215, EY = 1190, DX = 515, DY = 1190, SC = .56, gust = .9, caught = 2.2, give0 = 5.0, give1 = 6.0, back = 7.0;
  // Demir'in sol patisi: yakalar (yukarı) → indirir → Ela'ya uzatır → çeker
  const dl = kf(lt, [[gust + .3, -148, -272], [caught, -232, -690], [caught + 1, -150, -480], [give0, -150, -480], [give1, -252, -520], [give1 + .3, -252, -520], [back, -148, -272]]);
  const DL = { x: dl[0], y: dl[1], hand: 'relax' };
  // Ela'nın sağ patisi: uzanır → atkıyı alır → göğsüne götürür
  const er = kf(lt, [[give0 + .3, 148, -272], [give1, 268, -520], [give1 + .2, 268, -520], [back, 60, -470]]);
  const ER = { x: er[0], y: er[1], hand: 'relax' };
  const happy = ss(give1, back, lt);
  const pe = Object.assign({}, MOODS.demir[happy > .5 ? 'happy' : (lt > caught ? 'surprised' : 'calm')], { t, talk: 0, noScarf: lt > gust, lookX: lt < gust + .6 ? -.6 : .75, lookY: .1, blink: (t % 3.4 < .14) ? 1 : 0, tilt: .04 * happy,
    lid: .1 + .1 * happy, mouth: lerp(4, 18, happy), L: { x: -148, y: -272, hand: 'relax' }, R: ER });
  c.save(); c.translate(EX, EY); c.scale(SC, SC); drawEla(pe); c.restore();
  const pd = demirPose(lt < caught ? 'calm' : (happy > .5 ? 'happy' : 'surprised'), { t, talk: S.talk.demir, lookX: lt < gust ? .1 : -.75, lookY: lt > gust && lt < caught ? -.5 : .1, blink: (t % 3.9 < .14) ? 1 : 0,
    tilt: -.04 * happy, mouth: lerp(6, 16, happy), lid: .12 * happy, L: DL, R: { x: 148, y: -272, hand: 'relax' } });
  c.save(); c.translate(DX, DY); c.scale(SC, SC); drawWolf(pd); c.restore();
  // atkı: Ela'nın boynundan uçar → Demir'in patisinde → Ela'nın patisinde
  const dpx = DX + DL.x * SC - 6, dpy = DY + DL.y * SC, epx = EX + ER.x * SC + 6, epy = EY + ER.y * SC, sw = Math.sin(t * 2) * 5;
  if (lt > gust && lt < caught) {
    const f = (lt - gust) / (caught - gust), nx = EX, ny = EY - SC * 590;
    c.save(); c.translate(lerp(nx, dpx, ease(f)), lerp(ny, dpy, ease(f)) - Math.sin(f * PI) * 150); c.scale(lerp(.45, .55, f), lerp(.45, .55, f)); c.rotate(Math.sin(t * 3) * .3); windScarf(0, 0, PI * .6, 230, t, 26); c.restore();
  } else if (lt >= caught && lt < give1 + .1) {
    redScarf([dpx, dpy + 6, dpx - 6 + sw * .4, dpy + 50, dpx + 2 + sw, dpy + 100, dpx - 4 + sw * 1.3, dpy + 140], 26); ell(dpx, dpy + 4, 15, 14, WOLF_C.paw, OL, 3);
  } else if (lt >= give1 + .1) {
    redScarf([epx, epy + 6, epx + 6 + sw * .4, epy + 50, epx - 2 + sw, epy + 100, epx + 4 + sw * 1.3, epy + 140], 26); ell(epx, epy + 4, 15, 14, ELA_C.paw, OL, 3);
  }
  if (lt > gust - .2 && lt < caught + .2) for (let i = 0; i < 10; i++) { const x = ((t * 160 + i * 100) % 1000) - 150, y = 600 + hash(i) * 500; line(x, y, x + 50, y - 8, 'rgba(255,255,255,.4)', 2); } // rüzgâr
  if (happy > .3) { c.save(); c.globalCompositeOperation = 'lighter'; ell(365, 860, 260, 200, rg(365, 860, 0, 260, [[0, `rgba(255,200,170,${.18 * happy})`], [1, 'rgba(0,0,0,0)']]), null); c.restore(); }
};

// ---------- 3) TRENDE (anı): her sabah aynı tren; Ela pencereden şehre, Demir Ela'ya bakar ----------
function trenIci(t, o = {}) {
  const sun = o.sunrise, bob = Math.sin(t * 13) * 1.4;
  c.save(); c.translate(0, bob);
  c.fillStyle = lg(0, 0, 0, 1300, sun ? [[0, '#e8c8a0'], [1, '#a8805a']] : [[0, '#ddd4c0'], [1, '#a89e88']]); c.fillRect(-1000, -300, 2720, 1900);
  // pencereler: dışarıda akan şehir (yatayda yanlarda birer pencere daha)
  for (const WX of LAND ? [-660, 40, 740] : [40]) {
  const WY = 300, WW = 640, WH = 430;
  c.save(); c.beginPath(); c.roundRect(WX, WY, WW, WH, 36); c.clip();
  c.fillStyle = lg(0, WY, 0, WY + WH, sun ? [[0, '#3a4a7a'], [.55, '#e88a5a'], [1, '#ffd28a']] : [[0, '#9cc4e4'], [1, '#e8eef0']]); c.fillRect(WX, WY, WW, WH);
  if (sun) { ell(470, WY + WH - 70, 70, 70, 'rgba(255,236,190,.95)', null); addLight(470, WY + WH - 70, 520, 'rgba(255,180,100,.45)'); }
  for (let i = 0; i < 30; i++) { const x = ((i * 90 - t * 60) % 2700 + 2700) % 2700 - 900, h = 60 + hash(i + 30) * 150; rr(x, WY + WH - h - 40, 70, h + 60, 2, sun ? 'rgba(90,60,70,.85)' : 'rgba(120,140,160,.8)', null); }
  for (let i = 0; i < 11; i++) { const x = ((i * 260 - t * 700) % 2860 + 2860) % 2860 - 900; rr(x, WY - 10, 16, WH + 20, 3, sun ? 'rgba(40,30,30,.7)' : 'rgba(60,70,80,.6)', null); } // hızla geçen direkler
  c.restore();
  rr(WX, WY, WW, WH, 36, null, '#4a4038', 16); rr(WX + 8, WY + 8, WW - 16, WH - 16, 30, null, '#8a8070', 4);
  c.save(); c.globalAlpha = .25; line(WX + 80, WY + 30, WX + 220, WY + WH - 40, '#fff', 8); line(WX + 140, WY + 30, WX + 280, WY + WH - 40, '#fff', 3); c.restore();
  }
  // bagaj rafı + tutamaklar
  rr(-1000, 210, 2720, 22, 6, '#8a8a90', OL, 4);
  for (let i = 0; i < 14; i++) { const hx = -480 + i * 130, sw = Math.sin(t * 2 + i) * .12; c.save(); c.translate(hx, 232); c.rotate(sw); line(0, 0, 0, 34, '#8a8a90', 3); ell(0, 46, 11, 11, null, '#e8e2d2', 4); c.restore(); }
  c.restore();
  return bob;
}
function seatBacks(bob) {
  c.save(); c.translate(0, bob);
  for (const [x, w] of LAND ? [[-960, 420], [-520, 420], [-80, 420], [360, 420], [800, 420], [1240, 420]] : [[-80, 420], [360, 420]]) { rr(x, 905, w, 600, 46, lg(0, 905, 0, 1300, [[0, '#2f5a6a'], [1, '#1c3a46']]), OL, 6); rr(x + 50, 880, w - 100, 70, 24, '#efe8da', OL, 5); for (let k = 0; k < 6; k++) line(x + 30 + k * 64, 960, x + 30 + k * 64, 1300, 'rgba(0,0,0,.15)', 3); }
  c.restore();
}
SCENES.tren_ici = S => {
  const t = S.t, k = S.k;
  cam(lerp(360, 370, k), 700, lerp(1.08, 1.16, ease(k)));
  const bob = trenIci(t);
  // gün ışığı bantları kayar
  c.save(); c.globalCompositeOperation = 'lighter'; for (let i = 0; i < 3; i++) { const x = ((t * 120 + i * 400) % 1300) - 300; poly([x, 300, x + 120, 300, x + 40, 1300, x - 80, 1300], 'rgba(255,230,180,.08)', null); } c.restore();
  const pe = Object.assign({}, MOODS.demir.calm, { t, talk: 0, lookX: -.8, lookY: -.15, blink: (t % 3.6 < .14) ? 1 : 0, tilt: .03, mouth: 8, L: { x: -148, y: -272, hand: 'relax' }, R: { x: 148, y: -272, hand: 'relax' } });
  c.save(); c.translate(230, 1080 + bob); c.scale(.6, .6); drawEla(pe); c.restore();
  const pd = demirPose('happy', { t, talk: S.talk.demir, lookX: -.7, lookY: .05, blink: (t % 4.1 < .14) ? 1 : 0, tilt: -.06, mouth: 14, lid: .15 });
  c.save(); c.translate(490, 1085 + bob); c.scale(.6, .6); drawWolf(pd); c.restore();
  seatBacks(bob);
};

// ---------- 4) KAR (anı): Ela kendi kırmızı atkısını Demir'in boynuna dolamış ----------
SCENES.kar = S => {
  const t = S.t, k = S.k, lt = S.lt;
  cam(lerp(380, 390, k), lerp(820, 800, k), lerp(1.3, 1.42, ease(k)));
  drawStation(t, { pal: 'snow', min: 470 });
  c.save(); c.globalAlpha = .85; rr(-500, 30, 1720, 18, 9, '#f6f8fa', null); c.restore();  // saçakta kar
  snow(t, 40, .8);
  const tuck = 1 - ss(1.6, 2.6, lt);   // Ela önce atkıyı düzeltir, sonra elini çeker
  const pe = Object.assign({}, MOODS.demir.happy, { t, talk: 0, noScarf: true, lookX: .8, lookY: .05, blink: (t % 3.2 < .14) ? 1 : 0, tilt: .06, mouth: 18, lid: .2,
    L: { x: -148, y: -272, hand: 'relax' }, R: { x: lerp(148, 318, tuck), y: lerp(-272, -600, tuck), hand: 'relax' } });
  const pd = demirPose('happy', { t, talk: S.talk.demir, lookX: -.75, lookY: .05, blink: (t % 4.3 < .14) ? 1 : 0, tilt: -.05, mouth: 16, lid: .15 });
  c.save(); c.translate(480, 1200); c.scale(.56, .56); withPalette(RED_SCARF, () => drawWolf(pd)); c.restore();
  c.save(); c.translate(300, 1200); c.scale(.56, .56); drawEla(pe); c.restore();
  for (const [x, y, ph] of [[300, 905, 0], [480, 905, 1.3]]) { const f = ((t * .5 + ph) % 1); c.save(); c.globalAlpha = .35 * (1 - f); ell(x + (x < 400 ? 30 : -30) * f, y - 20 * f, 14 + 30 * f, 8 + 18 * f, '#ffffff', null); c.restore(); } // nefes buharı
  snow(t + 50, 30, 1);
};

// ---------- 5) SON BAKIŞ (anı): "Gitmem lazım" — omuz üstü çekimler ----------
SCENES.son_bakis = S => {
  const t = S.t, k = S.k, rev = k > .52;
  if (!rev) { // Demir'in omzu üstünden Ela
    cam(lerp(430, 440, k), 760, lerp(1.7, 1.8, k));
    drawStation(t, { pal: 'day', min: 1010, train: () => drawTrain(-845, { cars: 3, doors: 1, day: true, lights: false }) });
    const pe = Object.assign({}, MOODS.demir.sad, { t, talk: 0, lookX: lerp(0, .5, ss(.15, .35, k)), lookY: lerp(.6, 0, ss(.15, .35, k)), blink: (t % 3 < .14) ? 1 : 0, tilt: .07, L: { x: -24, y: -448, hand: 'relax' }, R: { x: 24, y: -442, hand: 'relax' } });
    c.save(); c.translate(470, 1190); c.scale(.56, .56); drawEla(pe); c.restore();
    if (k > .25) { const f = ss(.25, .5, k); c.save(); c.globalAlpha = f; blob([470 + 30, 1190 - .56 * 700, 470 + 34, 1190 - .56 * 670, 470 + 28, 1190 - .56 * 650, 470 + 24, 1190 - .56 * 670], '#9fd2ff', OL, 2); c.restore(); } // gözyaşı
    c.save(); c.translate(250, 1400); c.scale(.8, .8); drawWolfBack({ t, walk: 0, tilt: .03 }); c.restore();
  } else { // Ela'nın omzu üstünden Demir
    cam(lerp(320, 330, k), 760, lerp(1.75, 1.85, k));
    drawStation(t, { pal: 'day', min: 1010, train: () => drawTrain(-845, { cars: 3, doors: 1, day: true, lights: false }) });
    const pd = demirPose('surprised', { t, talk: S.talk.demir, lookX: .55, lookY: .05, blink: 0, brow: -.4, mouth: -6, tilt: -.04, L: { x: -148, y: -272, hand: 'relax' }, R: { x: 148, y: -272, hand: 'relax' } });
    c.save(); c.translate(300, 1200); c.scale(.56, .56); drawWolf(pd); c.restore();
    c.save(); c.translate(520, 1410); c.scale(.8, .8); withPalette(ELA_C, () => drawWolfBack({ t, walk: 0, tilt: -.03, name: null, noGlasses: true, beret: '#c8302a' })); c.restore();
  }
};

// ---------- 6) GÖNDERİLMEYEN MESAJLAR: yazılıp silinen taslaklar ----------
SCENES.mesajlar = S => {
  const t = S.t, k = S.k, lt = S.lt, sil = S.phase === 'sil';
  if (LAND) cam(360, 610, .74 + .02 * k); else cam(360, 640, sil ? 1.04 + .05 * k : 1.06 + .04 * k);
  blurredStreet(t);
  const drafts = sil ? ['Hâlâ seni bekliyorum.'] : ['Neredesin?', 'Seni çok özledim…', 'Bir kere sesini duysam yeter.', 'Neden gittin?'];
  const per = sil ? Math.max(3.5, S.pd * .7) : 2.4, i = Math.min(drafts.length - 1, Math.floor(lt / per)), ph = (lt - i * per) / per;
  const d = drafts[i], typed = sil ? ss(.05, .45, ph) : ss(.05, .45, ph), del = sil ? ss(.72, .9, ph) : ss(.68, .92, ph);
  const shown = d.slice(0, Math.floor(d.length * typed * (1 - del) + .0001)), off = sil ? ss(.9, 1, k) : 0;
  const tilt = Math.sin(t * .8) * .012, PX = 160, PY = 230, KB = 780 - 240; // telefon ekranının sol üstü (dünya), klavyenin üstü (ekran yerel)
  // klavye tuşları (ekran yerel): 3 sıra harf + boşluk; parmağın dokunacağı yerler buradan
  const ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'], keyAt = (r, i) => { const n = ROWS[r].length, kw = 36, x0 = (400 - n * kw) / 2 + (r === 2 ? -20 : 0); return [x0 + i * kw + kw / 2, KB + 22 + r * 54 + 20]; }, BACK = [400 - 34, KB + 22 + 2 * 54 + 20];
  const typing = typed > 0 && typed < 1 && del <= 0, deleting = del > 0 && del < 1;
  let tip = null; // sağ patinin işaret parmağı (ekran yerel)
  if (typing) { const n = Math.floor(typed * d.length), r = Math.floor(hash(n + i * 7) * 3), kk = keyAt(r, Math.floor(hash(n * 3 + 1) * ROWS[r].length)); tip = [kk[0], kk[1] + 4 - Math.abs(Math.sin(lt * 14)) * 6]; }
  else if (deleting) tip = [BACK[0], BACK[1] + 4 - Math.abs(Math.sin(lt * 16)) * 6];
  c.save(); c.translate(360, 620); c.rotate(tilt); c.translate(-360, -620);
  // ARKA: sol kol ve avuç telefonun arkasında (avuç alt köşeden görünür)
  capsule([-90, 1470, 150, 1090], 150, WOLF_C.sleeve, 7); capsule([132, 1112, 168, 1060], 138, '#6a1822', 6);
  ell(215, 990, 104, 84, WOLF_C.paw, OL, 6);
  phoneFrame(360, 620, 400, 780, (w, h) => {
    chatHeader(w, 'Ela', 'son görülme: 3 ay önce', '🧣');
    c.fillStyle = UI.dim; c.font = '600 16px Inter,Arial'; c.textAlign = 'center'; c.fillText('3 AY ÖNCE', w / 2, 170); c.textAlign = 'left';
    let y = 190;
    y = bubble(w, y, 'Üşüme, tamam mı? 🧣', false, '08:12', 1);
    y = bubble(w, y, 'Sen yanımdayken üşümem ki', true, '08:13', 1, 2);
    // yazma çubuğu (klavyenin üstünde)
    const iy = KB - 84;
    rr(14, iy, w - 96, 64, 32, '#1e252e', null);
    c.font = `500 22px Inter,Arial,${EMOJI}`; c.fillStyle = shown ? UI.text : UI.dim; c.fillText(shown || 'Mesaj yaz', 36, iy + 40);
    if (Math.sin(t * 9) > 0) { const cw = c.measureText(shown).width; line(38 + cw, iy + 16, 38 + cw, iy + 48, UI.blue, 2); }
    ell(w - 46, iy + 32, 30, 30, shown ? UI.me : '#2a3038', null); c.fillStyle = '#fff'; c.font = '700 26px Inter,Arial'; c.textAlign = 'center'; c.fillText('➤', w - 44, iy + 42);
    // klavye
    c.fillStyle = '#1a1f26'; c.fillRect(0, KB, w, h - KB);
    c.font = '600 17px Inter,Arial';
    ROWS.forEach((row, r) => { for (let q = 0; q < row.length; q++) { const [kx, ky] = keyAt(r, q), on = tip && Math.abs(tip[0] - kx) < 10 && Math.abs(tip[1] - ky) < 14; rr(kx - 16, ky - 22, 32, 44, 7, on ? '#4a5563' : '#2c333d', null); c.fillStyle = '#d8dee6'; c.fillText(row[q], kx, ky + 6); } });
    rr(BACK[0] - 26, BACK[1] - 22, 52, 44, 7, deleting ? '#4a5563' : '#3a424d', null); c.fillStyle = '#d8dee6'; c.font = '700 20px Inter,Arial'; c.fillText('⌫', BACK[0], BACK[1] + 7);
    rr(12, BACK[1] - 22, 52, 44, 7, '#3a424d', null); c.fillText('⇧', 38, BACK[1] + 7);
    rr(90, KB + 22 + 3 * 54, 220, 40, 7, '#2c333d', null); c.font = '600 15px Inter,Arial'; c.fillStyle = '#8d98a5'; c.fillText('boşluk', 200, KB + 22 + 3 * 54 + 26);
    c.textAlign = 'left';
    if (off > 0) { c.fillStyle = `rgba(0,0,0,${off})`; c.fillRect(0, 0, w, h); }
  });
  // ÖN: sol patinin parmak uçları telefonun sağ kenarını sarar, başparmak sol alt köşede
  for (const fy of [880, 935, 990]) rr(552, fy - 16, 36, 32, 16, WOLF_C.paw, OL, 4);
  c.save(); c.translate(168, 1010); c.rotate(-.8); rr(-16, -50, 32, 74, 16, WOLF_C.paw, OL, 4.5); c.restore();
  // sağ pati: yazarken tuşlara, silerken geri tuşuna dokunur; boşta aşağıda bekler
  const rest = [470, 1150], tw = tip ? [PX + tip[0], PY + tip[1]] : rest;
  capsule([860, 1480, tw[0] + 120, tw[1] + 250], 130, WOLF_C.sleeve, 7); capsule([tw[0] + 108, tw[1] + 226, tw[0] + 88, tw[1] + 186], 132, '#6a1822', 6);
  pawFinger(tw[0], tw[1], -.42, WOLF_C.paw, 1.1);
  c.restore();
};

// ---------- 7) BABANIN SOFRASI: Mehmet Ali konuşur, Demir'in tabağı el sürülmemiş, atkı masada ----------
SCENES.sofra = S => {
  const t = S.t, k = S.k, lt = S.lt;
  cam(lerp(360, 300, ss(.4, 1, k)), lerp(780, 760, k), lerp(1.12, 1.35, ease(ss(.3, 1, k))));
  evIci(t, { min: 1262, lamp: 1 });
  c.save(); c.beginPath(); c.rect(-300, -300, 1320, 1290); c.clip();
  const pm = Object.assign({}, MOODS.mehmetali[k < .5 ? 'worry' : 'warm'], { t, talk: S.talk.mehmetali, lookX: .7, lookY: .15, blink: (t % 3.8 < .14) ? 1 : 0, tilt: .05,
    L: { x: -100, y: -400, hand: 'relax' }, R: { x: 100, y: -400, hand: 'relax' } });
  c.save(); c.translate(222, 1065); c.scale(.6, .6); drawMehmetAli(pm); c.restore();
  const pd = demirPose('sad', { t, talk: 0, lookX: -.1, lookY: .8, blink: 0, lid: .3, tilt: .06, L: { x: -96, y: -420, hand: 'relax' }, R: { x: 96, y: -420, hand: 'relax' } });
  c.save(); c.translate(490, 1070); c.scale(.58, .58); drawWolf(pd); c.restore();
  c.restore();
  evMasa(t, { food: true, hot: 1, teapot: false });
  // masada katlanmış kırmızı atkı (Demir'in önünde)
  c.save(); c.translate(548, 876); c.rotate(-.06);
  poly([-58, -12, 50, -14, 60, 12, -50, 14], SCARF, OL, 4); c.save(); c.beginPath(); c.moveTo(-58, -12); c.lineTo(50, -14); c.lineTo(60, 12); c.lineTo(-50, 14); c.closePath(); c.clip(); for (let x = -60; x < 70; x += 22) rr(x, -16, 8, 34, 0, SCARF_D, null); c.restore();
  line(-56, 0, 56, -1, 'rgba(0,0,0,.25)', 2); for (let i = 0; i < 6; i++) line(-50 + i * 3, 14, -54 + i * 3, 26, SCARF, 3); c.restore(); // katlanmış atkı, saçaklı ucu sarkar
  dustMotes(t, 20, 100, 200, 520, 700, .35);
};

// ---------- 8) YENİ YOL: sabah treninde tek başına, güneşe bakıp gülümseyen Demir ----------
SCENES.yolculuk = S => {
  const t = S.t, k = S.k;
  cam(lerp(330, 350, k), 690, lerp(1.2, 1.1, ease(k)));
  const bob = trenIci(t, { sunrise: true });
  c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = lg(470, 600, 200, 1100, [[0, 'rgba(255,180,100,.25)'], [1, 'rgba(0,0,0,0)']]); c.fillRect(-300, -300, 1320, 1900); c.restore();
  const pd = demirPose('hope', { t, talk: 0, lookX: .5, lookY: -.1, blink: (t % 4 < .14) ? 1 : 0, tilt: .04, mouth: lerp(8, 20, ss(.2, .7, k)), lid: .1 });
  c.save(); c.translate(250, 1085 + bob); c.scale(.6, .6); drawWolf(pd); c.restore();
  seatBacks(bob);
};
