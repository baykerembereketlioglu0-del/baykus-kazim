// Ara sahneler (3): "Sonra" bölümü — baba evi, telefon görüşmesi, bekleyiş, kum saati, boş oda, koşu, kavuşma.
const BASEX = 1.5; // 1080/720: ekran sabit çizimler (sinema bantları) için
function letterbox(a = 1, h = 150) { c.save(); c.setTransform(BASEX, 0, 0, BASEX, 0, 0); c.fillStyle = `rgba(0,0,0,${a})`; c.fillRect(0, 0, 720, h); c.fillRect(0, 1280 - h, 720, h); c.restore(); }
function typeText(txt, k, x, y, font, col) { const n = Math.floor(txt.length * cl(k, 0, 1)); c.save(); c.setTransform(BASEX, 0, 0, BASEX, 0, 0); c.font = font; c.fillStyle = col; c.letterSpacing = '4px'; c.fillText(txt.slice(0, n), x, y); c.restore(); }

// ---------- baba evinin içi ----------
function teaGlass(x, y, s = 1, full = 1, steam = 0, t = 0) {
  c.save(); c.translate(x, y); c.scale(s, s);
  ell(0, 4, 34, 8, '#d9d2c4', OL, 3);                                                     // tabak
  c.beginPath(); c.moveTo(-16, -60); c.quadraticCurveTo(-8, -34, -14, -12); c.quadraticCurveTo(-12, 0, 0, 0); c.quadraticCurveTo(12, 0, 14, -12); c.quadraticCurveTo(8, -34, 16, -60); c.closePath();
  c.fillStyle = 'rgba(230,240,245,.25)'; c.fill();
  c.save(); c.clip(); c.fillStyle = lg(0, -50, 0, 0, [[0, '#c0392b'], [1, '#7a1a10']]); c.fillRect(-20, -60 + 50 * (1 - full) + 8, 40, 60); c.restore();
  c.lineWidth = 3; c.strokeStyle = OL; c.stroke();
  if (steam > 0) { c.save(); c.globalAlpha = steam * .5; for (let i = 0; i < 2; i++) curve([i * 8 - 4, -64, i * 8 - 10 + Math.sin(t * 2 + i) * 6, -90, i * 8 + Math.sin(t * 2.4 + i) * 8, -116], 'rgba(240,240,240,.7)', 3); c.restore(); }
  c.restore();
}
function wallClock(x, y, min) {
  ell(x, y, 62, 62, '#3a2416', OL, 6); ell(x, y, 50, 50, '#efe6d4', OL, 3);
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; line(x + Math.cos(a) * 40, y + Math.sin(a) * 40, x + Math.cos(a) * 46, y + Math.sin(a) * 46, OL, i % 3 ? 2 : 4); }
  const hA = (min % 720) / 720 * TAU, mA = (min % 60) / 60 * TAU;
  line(x, y, x + Math.sin(hA) * 26, y - Math.cos(hA) * 26, OL, 6); line(x, y, x + Math.sin(mA) * 40, y - Math.cos(mA) * 40, OL, 3.5); ell(x, y, 5, 5, '#b8862e', OL, 2);
  rr(x - 10, y + 60, 20, 60, 4, '#3a2416', OL, 3); ell(x + Math.sin(min * 6) * 0, y + 128, 14, 14, '#b8862e', OL, 3); // sarkaç
}
function familyPhoto(x, y) {
  rr(x - 64, y - 52, 128, 104, 4, '#6a4128', OL, 5); rr(x - 52, y - 40, 104, 80, 2, '#d9c7a4', null);
  for (const [px, py, r] of [[x - 18, y + 4, 22], [x + 22, y + 14, 14]]) { ell(px, py, r, r * .9, '#9aa3ad', OL, 2); for (const s of [-1, 1]) poly([px + s * r * .5, py - r * .6, px + s * r * .8, py - r * 1.5, px + s * r, py - r * .3], '#9aa3ad', OL, 2); ell(px, py + r * .3, r * .5, r * .35, '#f2f0eb', null); }
  rr(x - 52, y + 22, 104, 18, 0, 'rgba(120,80,40,.25)', null);
}
function armchair(x, y, front = false) {
  if (!front) { blob([x - 150, y - 60, x - 140, y - 330, x, y - 360, x + 140, y - 330, x + 150, y - 60], lg(0, y - 360, 0, y, [[0, '#7a2a24'], [1, '#4a1814']]), OL, 6, .7);
    for (let i = -2; i <= 2; i++) ell(x + i * 50, y - 260, 6, 6, '#3a100c', null); }
  else { rr(x - 170, y - 120, 60, 170, 24, '#6a2420', OL, 6); rr(x + 110, y - 120, 60, 170, 24, '#6a2420', OL, 6); rr(x - 150, y - 40, 300, 110, 20, '#5a1c18', OL, 6);
    for (const s of [-1, 1]) rr(x + s * 120 - 10, y + 70, 20, 40, 4, '#2a1a10', OL, 3); }
}
function evIci(t, o = {}) {
  const min = o.min ?? 1200, lamp = o.lamp ?? 1;
  c.fillStyle = lg(0, -300, 0, 900, [[0, '#4a2e1e'], [1, '#3a2416']]); c.fillRect(-300, -300, 1320, 1200);
  c.save(); c.globalAlpha = .18; for (let x = -300; x < 1020; x += 36) { c.fillStyle = (x / 36) % 2 ? '#2a180e' : '#6a4630'; c.fillRect(x, -300, 18, 1200); } c.restore();
  rr(-300, 640, 1320, 260, 0, '#2e1c10', null); line(-300, 640, 1020, 640, '#1a0f08', 8); for (let x = -300; x < 1020; x += 90) line(x, 650, x, 900, 'rgba(0,0,0,.3)', 3);
  // pencere: gece, yağmur, dantel perde
  rr(452, 170, 236, 380, 6, '#2a180e', OL, 8); c.fillStyle = lg(0, 180, 0, 540, [[0, '#0b1220'], [1, '#18202e']]); c.fillRect(464, 182, 212, 356);
  c.save(); c.beginPath(); c.rect(464, 182, 212, 356); c.clip(); c.strokeStyle = 'rgba(200,210,230,.3)'; c.lineWidth = 1.5;
  for (let i = 0; i < 30; i++) { const yy = ((hash(i) * 360 + t * 520) % 360) + 170, xx = 466 + hash(i + 4) * 210; c.beginPath(); c.moveTo(xx, yy); c.lineTo(xx - 3, yy + 16); c.stroke(); } c.restore();
  line(570, 182, 570, 538, '#2a180e', 7); line(464, 360, 676, 360, '#2a180e', 7);
  for (const s of [0, 1]) { c.save(); c.globalAlpha = .75; c.fillStyle = '#efe6d4'; c.beginPath(); const x0 = s ? 676 : 464; c.moveTo(x0, 176); c.lineTo(x0 + (s ? -70 : 70), 176); c.quadraticCurveTo(x0 + (s ? -30 : 30), 360, x0 + (s ? -50 : 50), 548); c.lineTo(x0, 548); c.closePath(); c.fill(); c.restore(); }
  wallClock(190, 240, min); familyPhoto(340, 300);
  // asılı lamba
  line(330, -300, 330, 380, '#0d0806', 4); poly([280, 420, 380, 420, 360, 380, 300, 380], '#6a3a20', OL, 5); ell(330, 424, 20, 8, `rgba(255,227,166,${lamp})`, null);
  addLight(330, 430, 520, `rgba(255,180,90,${.45 * lamp})`);
  c.fillStyle = lg(0, 900, 0, 1600, [[0, '#2e1d12'], [1, '#1a0f08']]); c.fillRect(-300, 900, 1320, 800);
  for (let y = 920; y < 1600; y += 40) line(-300, y, 1020, y, 'rgba(0,0,0,.35)', 2);
}
function evMasa(t, o = {}) { // masa + örtü + tabaklar + çaydanlık + bardaklar
  const hot = o.hot ?? 1;
  ell(360, 868, 270, 40, '#f1ebdf', OL, 5);
  c.beginPath(); c.moveTo(90, 868); c.quadraticCurveTo(80, 960, 100, 1040); for (let i = 0; i <= 12; i++) { const x = 100 + i * 43.3; c.quadraticCurveTo(x - 20, 1060, x, 1040); } c.quadraticCurveTo(640, 960, 630, 868); c.closePath();
  c.fillStyle = lg(0, 868, 0, 1050, [[0, '#f1ebdf'], [1, '#cfc6b4']]); c.fill(); c.lineWidth = 5; c.strokeStyle = OL; c.stroke();
  c.save(); c.globalAlpha = .35; for (let i = 0; i < 12; i++) ell(110 + i * 43, 1030, 10, 10, null, '#9a8c74', 2); c.restore();
  for (const px of [250, 470]) { ell(px, 862, 66, 16, '#fbf8f2', OL, 4); ell(px, 860, 42, 9, null, 'rgba(0,0,0,.15)', 2); }
  if (o.covered) { const d = o.covered; c.save(); c.translate(470, 856 - (1 - d) * 120); blob([-58, 4, -50, -40, 0, -62, 50, -40, 58, 4], lg(0, -62, 0, 4, [[0, '#e8e2d6'], [1, '#b9b2a4']]), OL, 4); ell(0, -64, 8, 6, '#9a917f', OL, 2); c.restore(); }
  else if (o.food !== false) for (const px of [250, 470]) { ell(px, 854, 30, 9, '#c96a2a', null); ell(px - 8, 850, 8, 4, '#3a7a2a', null); }
  // çaydanlık
  c.save(); c.translate(575, 858); rr(-30, -64, 60, 60, 16, '#c9c2b5', OL, 4); rr(-22, -100, 44, 40, 12, '#d9d2c4', OL, 4); ell(0, -104, 8, 6, '#3a2a1e', OL, 2); curve([30, -30, 54, -50, 60, -70], OL, 6); curve([30, -30, 54, -50, 60, -70], '#c9c2b5', 3);
  if (hot > .05) { c.save(); c.globalAlpha = hot * .5; curve([60, -74, 54 + Math.sin(t * 2) * 8, -110, 64 + Math.sin(t * 2.5) * 10, -150], 'rgba(240,240,240,.8)', 4); c.restore(); } c.restore();
  teaGlass(330, 880, .9, 1, hot, t); teaGlass(395, 880, .9, o.secondFull ?? 1, hot, t);
  rr(180, 830, 60, 20, 8, '#c98a3a', OL, 3); // ekmek
}

// ---------- 0) SİNEMATİK AÇILIŞ: yağmurlu gecede baba evi ----------
function evDisi(t, lit = 1) {
  c.fillStyle = lg(0, -300, 0, 900, [[0, '#070a12'], [1, '#141824']]); c.fillRect(-300, -300, 1320, 1900);
  for (let i = 0; i < 40; i++) ell(hash(i) * 720, hash(i + 3) * 300, 1.4, 1.4, 'rgba(255,255,240,.4)', null);
  // ev
  rr(140, 420, 440, 480, 0, '#3a2a20', OL, 8);
  c.save(); c.beginPath(); c.rect(140, 420, 440, 480); c.clip(); c.strokeStyle = 'rgba(0,0,0,.3)'; c.lineWidth = 2; for (let y = 420; y < 900; y += 28) { c.beginPath(); c.moveTo(140, y); c.lineTo(580, y); c.stroke(); } c.restore();
  poly([110, 430, 360, 230, 610, 430], '#4a1e18', OL, 8); rr(480, 270, 44, 110, 2, '#3a2a20', OL, 5);
  c.save(); c.globalAlpha = .35; for (let i = 0; i < 4; i++) { const p = (t * .25 + i * .25) % 1; ell(502 + Math.sin(p * 6 + i) * 20, 260 - p * 220, 20 + p * 40, 16 + p * 30, 'rgba(180,180,190,.5)', null); } c.restore();
  // ana pencere (sıcak ışık) + kapı
  rr(260, 520, 200, 220, 4, '#2a180e', OL, 8);
  c.fillStyle = `rgba(255,${180 + 30 * lit | 0},90,${.55 + .4 * lit})`; c.fillRect(272, 532, 176, 196);
  c.save(); c.globalAlpha = .7; c.fillStyle = '#efe6d4'; c.beginPath(); c.moveTo(272, 528); c.lineTo(330, 528); c.quadraticCurveTo(300, 640, 316, 732); c.lineTo(272, 732); c.fill(); c.beginPath(); c.moveTo(448, 528); c.lineTo(390, 528); c.quadraticCurveTo(420, 640, 404, 732); c.lineTo(448, 732); c.fill(); c.restore();
  line(360, 532, 360, 728, '#2a180e', 6); line(272, 630, 448, 630, '#2a180e', 6);
  addLight(360, 630, 380, `rgba(255,170,80,${.45 * lit})`);
  rr(490, 690, 70, 210, 4, '#2a180e', OL, 6); ell(548, 800, 5, 5, '#d9a441', OL, 2);
  c.fillStyle = '#16100c'; c.fillRect(-300, 900, 1320, 800); rr(-300, 896, 1320, 10, 0, '#2a2019', null);
  c.save(); c.globalCompositeOperation = 'lighter'; ell(360, 950, 200, 26, 'rgba(255,170,80,.18)', null); c.restore();
}
SCENES.ev = S => {
  const t = S.t, lt = S.lt, inT = ss(3.0, 3.8, lt);
  if (inT < 1) { c.save(); cam(360, lerp(640, 630, ss(0, 3.4, lt)), lerp(1.0, 2.6, ease(cl(lt / 3.6, 0, 1)))); evDisi(t); c.restore(); drawRain(t, 720, 1280, 1, .9); }
  if (inT > 0) {
    c.save(); c.globalAlpha = inT; cam(360, 760, 1.18 + .03 * (lt - 3)); evIci(t, { min: 1200 });
    // Mehmet Ali ikinci tabağı koyuyor, sonra saate ve kapıya bakıyor
    const place = ss(3.6, 5.2, lt), look = ss(5.4, 6.0, lt);
    const p = Object.assign({}, MOODS.mehmetali.warm, { t, talk: 0, seated: true, lookX: lerp(.4, -.7, look), lookY: lerp(.6, -.4, look), blink: (t % 3.4 < .14) ? 1 : 0, tilt: lerp(.05, -.06, look),
      L: { x: -110, y: -330, hand: 'relax' }, R: { x: lerp(260, 170, place), y: lerp(-450, -330, place), hand: 'relax' } });
    c.save(); c.translate(360, 1150); c.scale(.62, .62); drawMehmetAli(p); c.restore();
    evMasa(t, { food: true });
    c.restore();
  }
  letterbox(1, 150);
  typeText('PAZAR AKŞAMI · 20:00', ss(.6, 2.4, lt), 40, 1222, '600 22px Cinzel,Georgia,serif', 'rgba(236,214,176,.85)');
};

// ---------- 1) TELEFON: baba arıyor, oğul meşgul (bölünmüş ekran) ----------
function ofis(t) {
  c.fillStyle = lg(0, -300, 0, 900, [[0, '#121823'], [1, '#1c2230']]); c.fillRect(-300, -300, 1320, 1900);
  rr(80, 120, 560, 380, 6, '#0a0e16', OL, 8);
  for (let i = 0; i < 40; i++) rr(100 + hash(i) * 520, 300 + hash(i + 3) * 180, 10, 14, 1, `rgba(255,${190 + hash(i) * 50 | 0},120,${.3 + .5 * hash(i + 7)})`, null);
  for (let i = 0; i < 6; i++) rr(100 + i * 92, 240 + hash(i + 2) * 60, 60, 260, 0, 'rgba(20,26,38,.95)', null);
  line(360, 120, 360, 500, '#0a0e16', 6);
  wallClock(640, 620, 1212);
  c.fillStyle = '#141820'; c.fillRect(-300, 900, 1320, 800);
}
function ofisMasa(t) {
  rr(-300, 860, 1320, 40, 6, '#2a2f38', OL, 6); c.fillStyle = '#1a1e26'; c.fillRect(-300, 900, 1320, 700);
  poly([440, 860, 640, 860, 610, 760, 470, 760], '#2a2f38', OL, 4); c.fillStyle = 'rgba(140,190,255,.35)'; c.fillRect(478, 768, 124, 84);
  addLight(540, 800, 260, 'rgba(140,190,255,.35)');
  for (let i = 0; i < 6; i++) rr(110 + (hash(i) - .5) * 10, 846 - i * 8, 130, 9, 2, '#e8e2d6', OL, 2);
  teaGlass(300, 862, .7, .3, 0, t);
}
SCENES.cagri = S => {
  const t = S.t, k = S.k, ph = S.phase || 'ara', kap = ph === 'kapat';
  const split = kap ? 1 - ss(.15, .55, k) : 1;
  // üst: baba
  c.save(); c.beginPath(); c.moveTo(-50, -50); c.lineTo(770, -50); c.lineTo(770, lerp(1400, 560, split)); c.lineTo(-50, lerp(1400, 700, split)); c.closePath(); c.clip();
  c.save(); cam(360, lerp(960, 760, 1 - split), lerp(1.2, 1.15, 1 - split)); evIci(t, { min: 1205 + (kap ? k * 10 : 0) });
  const down = kap ? ss(.05, .35, k) : 0, cover = kap ? ss(.45, .85, k) : 0;
  const pm = Object.assign({}, MOODS.mehmetali[kap ? 'sad' : 'warm'], { t, talk: S.talk.mehmetali, seated: true, lookX: kap ? .2 : -.3, lookY: kap ? .6 : 0, blink: (t % 3.6 < .14) ? 1 : 0, tilt: kap ? .06 : -.04,
    L: { x: lerp(-110, 40, cover), y: lerp(-330, -390, cover), hand: 'relax' }, R: { x: lerp(150, 120, down), y: lerp(-720, -330, down), hand: 'relax' } });
  c.save(); c.translate(360, 1150); c.scale(.62, .62); drawMehmetAli(pm);
  c.save(); c.translate(lerp(150, 120, down), lerp(-720, -330, down)); c.rotate(lerp(-.3, 1.4, down)); rr(-22, -46, 44, 92, 10, '#1c1e22', OL, 4); rr(-16, -38, 32, 70, 6, kap ? '#20262e' : '#3a5a7a', null); c.restore();
  c.restore();
  evMasa(t, { covered: kap ? cover : 0, food: true, hot: kap ? 1 - k * .5 : 1 });
  c.restore(); c.restore();
  // alt: Demir ofiste
  if (split > .01) {
    c.save(); c.beginPath(); c.moveTo(-50, lerp(1400, 700, split) + 6); c.lineTo(770, lerp(1400, 560, split) + 6); c.lineTo(770, 1400); c.lineTo(-50, 1400); c.closePath(); c.clip();
    c.save(); cam(360, 496, 1.2); ofis(t);
    const pd = Object.assign({}, MOODS.demir.worry, { t, talk: S.talk.demir, lookX: .5, lookY: .45, blink: (t % 3 < .14) ? 1 : 0, tilt: .05,
      L: { x: -40, y: -400, hand: 'relax' }, R: { x: 185, y: -700, hand: 'relax' } });
    c.save(); c.translate(360, 1150); c.scale(.6, .6); drawWolf(pd); c.save(); c.translate(185, -700); c.rotate(-.3); rr(-22, -46, 44, 92, 10, '#1c1e22', OL, 4); c.restore(); c.restore();
    ofisMasa(t); c.restore(); c.restore();
    c.save(); c.globalCompositeOperation = 'lighter'; line(-50, lerp(1400, 700, split) + 3, 770, lerp(1400, 560, split) + 3, 'rgba(255,200,120,.6)', 4); c.restore();
  }
  letterbox(1 - (kap ? ss(.6, 1, k) : 0), 150);
};

// ---------- 2) BEKLEYİŞ: koltukta bekleyen baba, saat akıyor ----------
SCENES.bekleyis = S => {
  const t = S.t, k = S.k, min = lerp(1200, 1420, ss(.05, .95, k)), sleep = ss(.55, .9, k);
  cam(lerp(400, 470, k), 800, lerp(1.05, 1.25, ease(k)));
  evIci(t, { min, lamp: 1 - k * .35 });
  armchair(500, 1080);
  const p = Object.assign({}, MOODS.mehmetali.calm, { t, talk: 0, seated: true, sleep, lookX: .8, lookY: -.1, blink: 0, tilt: -.04,
    L: { x: -60, y: -380, hand: 'relax' }, R: { x: 100, y: -330, hand: 'relax' }, tespih: true });
  c.save(); c.translate(500, 1210); c.scale(.6, .6); drawMehmetAli(p); c.restore();
  armchair(500, 1080, true);
  c.save(); c.translate(-190, 60); evMasa(t, { covered: 1, hot: 0, secondFull: 1 }); c.restore();
  dustMotes(t, 25, 100, 300, 600, 600, .3);
};

// ---------- 3) KUM SAATİ ----------
SCENES.saat = S => {
  const t = S.t, k = S.k, sand = ss(0, 1, k);
  cam(360, 640, 1.05 + .1 * k);
  c.save(); c.filter = 'blur(12px)'; c.save(); c.translate(0, 100); evIci(t, { min: 1300 }); c.restore(); c.restore();
  c.fillStyle = 'rgba(8,4,2,.45)'; c.fillRect(-300, -300, 1320, 1900);
  const x = 360, y = 640;
  rr(x - 170, y - 330, 340, 36, 10, '#5a3a24', OL, 6); rr(x - 170, y + 294, 340, 36, 10, '#5a3a24', OL, 6);
  for (const s of [-1, 1]) rr(x + s * 150 - 10, y - 300, 20, 600, 8, '#4a2e1c', OL, 5);
  const glass = () => { c.beginPath(); c.moveTo(x - 120, y - 290); c.quadraticCurveTo(x - 120, y - 60, x - 10, y); c.quadraticCurveTo(x - 120, y + 60, x - 120, y + 290); c.lineTo(x + 120, y + 290); c.quadraticCurveTo(x + 120, y + 60, x + 10, y); c.quadraticCurveTo(x + 120, y - 60, x + 120, y - 290); c.closePath(); };
  c.save(); glass(); c.clip();
  const topH = 240 * (1 - sand) + 6, botH = 240 * sand;
  c.fillStyle = lg(0, y - 290, 0, y, [[0, '#e8c27a'], [1, '#c9963c']]); c.beginPath(); c.moveTo(x - 140, y - 10 - topH); c.quadraticCurveTo(x, y - 10 - topH + 20, x + 140, y - 10 - topH); c.lineTo(x + 140, y); c.lineTo(x - 140, y); c.fill();
  c.fillStyle = lg(0, y, 0, y + 290, [[0, '#e8c27a'], [1, '#b8862e']]); c.beginPath(); c.moveTo(x - 140, y + 290); c.lineTo(x - 140, y + 290 - botH * .6); c.quadraticCurveTo(x, y + 290 - botH - 30, x + 140, y + 290 - botH * .6); c.lineTo(x + 140, y + 290); c.fill();
  if (sand < .98) { line(x, y - 4, x, y + 290 - botH * .9, '#e8c27a', 4); for (let i = 0; i < 6; i++) ell(x + (hash(i) - .5) * 4, y + ((t * 300 + i * 50) % (290 - botH * .9)), 2, 2, '#fff1c8', null); }
  c.restore();
  c.save(); glass(); c.fillStyle = 'rgba(220,235,245,.1)'; c.fill(); c.lineWidth = 6; c.strokeStyle = 'rgba(30,20,12,.9)'; c.stroke(); c.restore();
  c.save(); c.globalAlpha = .35; curve([x - 90, y - 250, x - 96, y - 120, x - 40, y - 40], '#fff', 6); c.restore();
  addLight(x, y, 420, 'rgba(255,190,110,.25)');
};

// ---------- 4) BOŞ ODA (hayal, soğuk ton): telefon çalıyor, açan yok ----------
SCENES.bos = S => {
  const t = S.t, k = S.k, ring = Math.sin(t * 40) * 3 * (Math.sin(t * 4) > 0 ? 1 : 0);
  cam(lerp(420, 380, k), 820, lerp(1.1, 1.3, ease(k)));
  evIci(t, { min: 1380, lamp: .25 });
  armchair(500, 1080);
  blob([400, 860, 470, 800, 560, 820, 600, 900, 520, 940, 430, 930], '#6e5a3a', OL, 5); // koltukta bırakılmış hırka
  armchair(500, 1080, true);
  c.save(); c.translate(-190, 60); evMasa(t, { food: false, hot: 0, secondFull: 0 }); c.restore();
  // masada kasket + çalan telefon
  c.save(); c.translate(70, 900); blob([-60, 10, -50, -30, 0, -44, 50, -30, 60, 10, 0, 2], '#5a4636', OL, 4); c.restore();
  c.save(); c.translate(250 + ring, 905); rr(-50, -18, 100, 30, 8, '#1c1e22', OL, 4); c.restore();
  if (Math.sin(t * 4) > 0) { c.save(); c.globalAlpha = .7; for (const s of [-1, 1]) for (let i = 0; i < 3; i++) curve([250 + s * (70 + i * 16), 880, 250 + s * (78 + i * 16), 895, 250 + s * (70 + i * 16), 910], 'rgba(200,220,255,.7)', 3); c.restore(); }
  c.save(); c.globalAlpha = ss(.1, .3, k); rr(120, 760, 260, 70, 16, 'rgba(20,24,30,.92)', 'rgba(255,255,255,.2)', 2); c.fillStyle = '#eef2f5'; c.font = '700 22px Inter,Arial'; c.fillText('Oğlum Demir', 140, 790); c.font = '500 18px Inter,Arial'; c.fillStyle = '#9aa6b2'; c.fillText('arıyor…', 140, 814); c.restore();
  addLight(250, 900, 160, 'rgba(160,200,255,.35)');
  dustMotes(t, 40, 80, 300, 600, 700, .45, '200,210,230');
};

// ---------- 5) KOŞU: Demir yağmurda babasının evine koşuyor ----------
SCENES.kosu = S => {
  const t = S.t, k = S.k, shake = Math.sin(t * 13) * 4;
  cam(360 + shake * .5, 700 + Math.abs(Math.sin(t * 6.5)) * 6, 1.05);
  c.fillStyle = lg(0, -300, 0, 900, [[0, '#070a12'], [1, '#1a1c26']]); c.fillRect(-300, -300, 1320, 1300);
  for (const s of [-1, 1]) for (let i = 0; i < 6; i++) { const d = i / 6, x = 360 + s * lerp(420, 60, d), w = lerp(260, 40, d), h = lerp(700, 120, d); rr(s < 0 ? x - w : x, 860 - h, w, h, 2, `rgb(${lerp(18, 40, d) | 0},${lerp(14, 30, d) | 0},${lerp(14, 30, d) | 0})`, null);
    for (let j = 0; j < 4; j++) if (hash(i * 7 + j + (s > 0 ? 50 : 0)) > .55) rr((s < 0 ? x - w : x) + w * .2, 860 - h + h * (.15 + j * .2), w * .25, h * .08, 2, 'rgba(255,190,100,.45)', null); }
  // sonda baba evi: sıcak pencere
  rr(330, 790, 60, 70, 2, '#3a2a20', OL, 3); poly([322, 792, 360, 768, 398, 792], '#4a1e18', OL, 3); rr(346, 806, 28, 24, 1, '#ffc46a', null); addLight(360, 818, 140 + k * 60, 'rgba(255,170,80,.6)');
  c.beginPath(); c.moveTo(-300, 1600); c.lineTo(330, 860); c.lineTo(390, 860); c.lineTo(1020, 1600); c.closePath(); c.fillStyle = lg(0, 860, 0, 1300, [[0, '#2a2420'], [1, '#14100c']]); c.fill();
  c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = lg(0, 860, 0, 1300, [[0, 'rgba(255,170,90,.3)'], [1, 'rgba(255,170,90,0)']]); c.beginPath(); c.moveTo(340, 860); c.lineTo(380, 860); c.lineTo(500, 1300); c.lineTo(220, 1300); c.closePath(); c.fill(); c.restore();
  const d = ease(k), sc = lerp(.62, .2, d), y = lerp(1260, 920, d);
  c.save(); c.translate(360 + Math.sin(t * 6.5) * 8 * (1 - d), y - Math.abs(Math.sin(t * 6.5)) * 30 * sc); c.scale(sc, sc); drawWolfBack({ t: t * 1.8, walk: 1.6, tilt: Math.sin(t * 6.5) * .05 }); c.restore();
  for (let i = 0; i < 8; i++) { const p = (t * 2 + hash(i)) % 1; ell(360 + (hash(i + 3) - .5) * 200 * sc * 3, y + 10, 4 + p * 20, (4 + p * 20) * .3, null, `rgba(230,220,200,${(1 - p) * .6})`, 2); }
  drawRain(t, 720, 1280, 1, 1);
};

// ---------- 6) KAVUŞMA: kapı açılır, baba-oğul sarılır ----------
SCENES.kavusma = S => {
  const t = S.t, k = S.k, ph = S.phase || 'kapi';
  if (ph === 'kapi') {
    const open = ss(.0, .35, k);
    cam(360, 700, 1.15 + .08 * k);
    c.fillStyle = '#16100c'; c.fillRect(-300, -300, 1320, 1900);
    rr(-300, -300, 1320, 1200, 0, '#3a2a20', null); c.save(); c.globalAlpha = .3; for (let y = -300; y < 900; y += 28) line(-300, y, 1020, y, '#000', 2); c.restore();
    rr(210, 330, 300, 580, 6, '#2a180e', OL, 8);
    c.fillStyle = lg(0, 340, 0, 900, [[0, '#ffd89a'], [1, '#e8a04a']]); c.fillRect(222, 342, 276, 568);
    addLight(360, 620, 520 * open, `rgba(255,190,100,${.7 * open})`);
    const p = Object.assign({}, MOODS.mehmetali[k < .3 ? 'surprised' : 'happy'], { t, talk: S.talk.mehmetali, lookX: -.1, lookY: .3, blink: 0, tilt: -.04,
      L: { x: lerp(-140, -235, ss(.35, .6, k)), y: lerp(-272, -470, ss(.35, .6, k)), hand: 'relax' }, R: { x: lerp(140, 235, ss(.35, .6, k)), y: lerp(-272, -470, ss(.35, .6, k)), hand: 'relax' } });
    c.save(); c.translate(360, 905); c.scale(.6, .6); drawMehmetAli(p);
    if (k > .4) { c.save(); c.globalAlpha = ss(.4, .55, k); for (const s of [-1, 1]) blob([s * 64, 14, s * 70, 30, s * 64, 44, s * 58, 30], '#9fd2ff', OL, 2); c.restore(); } // gözyaşı
    c.restore();
    c.save(); c.translate(222 + 276, 342); c.scale(1 - open, 1); rr(-276, 0, 276, 568, 2, '#4a2a18', OL, 6); c.restore(); // kapı kanadı
    c.fillStyle = '#16100c'; c.fillRect(-300, 910, 1320, 700);
    c.save(); c.translate(250, 1460); c.scale(.62, .62); drawWolfBack({ t, walk: 0, tilt: 0 }); c.restore();
    drawRain(t, 720, 1280, 1, .7);
  } else { // sarılma: baba arkada, Demir önde (arkadan); babanın kolları Demir'in omuzlarının üstünden sırtına
    cam(400, 760, 1.25 + .1 * ease(k));
    c.fillStyle = '#16100c'; c.fillRect(-300, -300, 1320, 1900);
    c.fillStyle = lg(0, 300, 0, 1000, [[0, '#ffd89a'], [1, '#e8a04a']]); c.fillRect(200, 260, 380, 760);
    addLight(400, 560, 620, 'rgba(255,190,100,.6)');
    const p = Object.assign({}, MOODS.mehmetali.happy, { t, talk: S.talk.mehmetali, lookX: -.25, lookY: .25, blink: 0, tilt: -.16, noArms: true,
      L: { x: -120, y: -420, hand: 'relax' }, R: { x: 120, y: -420, hand: 'relax' } });
    const fx = 490, fy = 1150, fs = .64;
    c.save(); c.translate(fx, fy); c.scale(fs, fs); drawMehmetAli(p); c.restore();
    c.save(); c.globalAlpha = .9 * ss(.2, .4, k); blob([fx + 60 * fs, fy - 700 * fs, fx + 66 * fs, fy - 680 * fs, fx + 60 * fs, fy - 662 * fs, fx + 54 * fs, fy - 680 * fs], '#9fd2ff', OL, 2); c.restore(); // gözyaşı
    c.save(); c.translate(330, 1330); c.scale(.66, .66); drawWolfBack({ t, walk: 0, tilt: .1 }); c.restore();
    const arm = (pts, paw) => { c.beginPath(); c.moveTo(pts[0], pts[1]); c.quadraticCurveTo(pts[2], pts[3], pts[4], pts[5]);
      c.lineWidth = 52; c.strokeStyle = OL; c.stroke(); c.lineWidth = 42; c.strokeStyle = MA_C.cardigan; c.stroke(); ell(paw[0], paw[1], 28, 24, MA_C.paw, OL, 4);
      for (const kx of [-10, 0, 10]) curve([paw[0] + kx - 3, paw[1] + 10, paw[0] + kx, paw[1] + 18, paw[0] + kx + 3, paw[1] + 10], 'rgba(60,64,70,.6)', 2.5); };
    const sq = Math.sin(t * 1.5) * 4;
    arm([fx + 70, fy - 350, 470, 900, 400 + sq, 1000], [400 + sq, 1004]);        // sağ kol: omzun üstünden sırta
    arm([200, 940, 210, 1010, 270 - sq, 1010], [272 - sq, 1012]);                // sol kol: yandan sarılıyor
    dustMotes(t, 30, 150, 300, 450, 700, .5);
  }
};

// kapanış çizimi: çay bardağı
function teaSketch(k, x, y, s = 1) {
  c.save(); c.translate(x, y); c.scale(s, s); c.strokeStyle = '#3a2410'; c.lineWidth = 4; c.lineCap = 'round';
  const seg = (a, b, pts) => { const kk = cl((k - a) / (b - a), 0, 1); if (kk <= 0) return; c.beginPath(); c.moveTo(pts[0], pts[1]); const n = pts.length / 2 - 1, m = kk * n; for (let i = 1; i <= Math.ceil(m); i++) { const f = Math.min(1, m - (i - 1)); c.lineTo(lerp(pts[i * 2 - 2], pts[i * 2], f), lerp(pts[i * 2 - 1], pts[i * 2 + 1], f)); } c.stroke(); };
  seg(0, .4, [-22, -60, -12, -34, -18, -12, -14, 2, 0, 6, 14, 2, 18, -12, 12, -34, 22, -60]);
  seg(.35, .55, [-22, -60, 22, -60]);
  seg(.5, .75, [-50, 14, -20, 22, 20, 22, 50, 14]);
  seg(.7, .85, [-6, -70, -12, -86, -4, -100]); seg(.8, 1, [8, -70, 2, -88, 10, -104]);
  c.restore();
}
