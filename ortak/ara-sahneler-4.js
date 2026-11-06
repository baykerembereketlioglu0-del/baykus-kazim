// Ara sahneler (4): "Vitrin" bölümü — gece yatak odası, sosyal akış, "kareden çıkınca" gerçekler, polaroit anılar, telefon cebe.
// Not: letterbox, typeText (ara-sahneler-3.js); phoneFrame, holdingPaw, UI, EMOJI (ara-sahneler-2.js) kullanılır.

// ---------- aksesuar ve küçük yardımcılar ----------
function sunglasses(cx, cy, s = 1) { // kafa merkezine göre (gangBody yerel koordinatı)
  c.save(); c.translate(cx, cy); c.scale(s, s);
  for (const sd of [-1, 1]) { blob([sd * 20, -30, sd * 118, -34, sd * 112, 18, sd * 66, 30, sd * 26, 14], '#121418', OL, 5); c.save(); c.globalAlpha = .35; curve([sd * 40, -18, sd * 70, -24, sd * 96, -20], '#9ad', 4); c.restore(); }
  line(-22, -24, 22, -24, OL, 7); c.restore();
}
function phoneInHands(x, y, s = 1, glow = 1) { // karakterin göğüs hizasında tuttuğu telefon (arkası görünür) + yüzde mavi ışık
  c.save(); c.translate(x, y); c.scale(s, s); rr(-34, -56, 68, 112, 12, '#16181c', OL, 5); ell(-16, -38, 8, 8, '#2a2c30', OL, 2); c.restore();
  addLight(x, y - 90 * s, 240 * s, `rgba(120,170,255,${.45 * glow})`);
}
function likeBadge(x, y, n, a = 1) {
  c.save(); c.globalAlpha = a; rr(x, y, 230, 54, 27, 'rgba(15,19,24,.85)', 'rgba(255,255,255,.25)', 2);
  c.font = `700 30px Inter,Arial,${EMOJI}`; c.fillStyle = '#ff4d6d'; c.fillText('♥', x + 20, y + 38); c.fillStyle = '#fff'; c.font = '700 26px Inter,Arial'; c.fillText(n, x + 60, y + 37); c.restore();
}

// ---------- mini/tam sahne çizimleri (akışta küçük, "kare" sahnelerinde büyük kullanılır) ----------
function beachScene(t, o = {}) {
  c.fillStyle = lg(0, -300, 0, 700, [[0, '#4aa8e0'], [1, '#bfe6f5']]); c.fillRect(-500, -500, 1720, 1200);
  ell(560, 200, 70, 70, '#fff3b0', null); addLight(560, 200, 300, 'rgba(255,240,180,.35)');
  c.fillStyle = lg(0, 640, 0, 860, [[0, '#1e8fc2'], [1, '#3ec1d8']]); c.fillRect(-500, 640, 1720, 240);
  for (let i = 0; i < 12; i++) curve([-200 + i * 100 + (t * 20) % 100, 700 + (i % 3) * 40, -170 + i * 100 + (t * 20) % 100, 692 + (i % 3) * 40, -140 + i * 100 + (t * 20) % 100, 700 + (i % 3) * 40], 'rgba(255,255,255,.6)', 3);
  c.fillStyle = lg(0, 860, 0, 1400, [[0, '#f2d79a'], [1, '#d9b46a']]); c.fillRect(-500, 860, 1720, 700);
  // palmiye
  c.save(); c.translate(80, 980); c.lineWidth = 26; c.strokeStyle = '#8a5a30'; c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(40, -250, 10, -520); c.stroke();
  for (let i = 0; i < 6; i++) { const a = -PI / 2 + (i - 2.5) * .55 + Math.sin(t + i) * .04; c.save(); c.translate(10, -520); c.rotate(a); blob([0, 0, 90, -24, 200, 10, 90, 18], '#2f8a3a', OL, 4); c.restore(); } c.restore();
  // havlu + şemsiye
  rr(380, 1010, 220, 70, 8, '#e05a4a', OL, 4); for (let i = 0; i < 4; i++) rr(380 + i * 55, 1010, 26, 70, 0, 'rgba(255,255,255,.6)', null);
  const smile = o.smile ?? 1;
  const p = { t, laugh: smile * .5, lookX: smile ? 0 : -.3, tilt: smile ? .06 : -.08, nod: smile ? 0 : .8,
    L: smile ? { x: -230, y: -660, hand: 'point' } : { x: -40, y: -460, hand: 'relax' }, R: smile ? { x: 150, y: -300, hand: 'relax' } : { x: 40, y: -460, hand: 'relax' } };
  c.save(); c.translate(360, 1120); c.scale(.62, .62); gangBody('tilki', p); sunglasses(0, -728 - 22 + (p.nod || 0) * 10, 1); c.restore();
  if (!smile) phoneInHands(360, 1120 - .62 * 470, .62);
}
function carScene(t, o = {}) {
  c.fillStyle = lg(0, -300, 0, 900, [[0, '#f0a868'], [1, '#f6d6a0']]); c.fillRect(-500, -500, 1720, 1400);
  // arka: kiralama ofisi (kare dışında)
  rr(-300, 300, 520, 560, 4, '#3a3f4a', OL, 6); rr(-260, 360, 440, 70, 6, '#ffd44a', OL, 5);
  c.save(); c.font = '900 30px Inter,Arial'; c.textAlign = 'center'; c.fillStyle = '#1a1a1a'; c.fillText('SAATLİK ARAÇ KİRALAMA', -40, 407); c.restore();
  rr(-240, 470, 160, 300, 4, 'rgba(180,210,230,.7)', OL, 4); rr(-60, 470, 240, 200, 4, 'rgba(180,210,230,.7)', OL, 4);
  rr(380, 260, 600, 600, 4, '#5a4a44', OL, 6); for (let i = 0; i < 6; i++) rr(420 + (i % 3) * 120, 320 + Math.floor(i / 3) * 160, 80, 110, 3, 'rgba(255,220,160,.6)', OL, 3);
  c.fillStyle = '#4a4a50'; c.fillRect(-500, 860, 1720, 700); for (let x = -500; x < 1220; x += 160) rr(x, 1080, 90, 10, 2, '#e8e2d2', null);
  // kırmızı spor araba
  c.save(); c.translate(390, 1010);
  blob([-300, 40, -290, -20, -180, -50, -90, -120, 80, -124, 170, -60, 300, -40, 312, 30, 290, 50, -280, 54], lg(0, -124, 0, 54, [[0, '#ff4a3a'], [1, '#a8140c']]), OL, 6);
  blob([-70, -110, 70, -112, 140, -60, -150, -56], 'rgba(150,200,230,.85)', OL, 4); line(0, -112, 0, -56, OL, 4);
  for (const x of [-180, 190]) { ell(x, 50, 56, 56, '#1a1a1c', OL, 5); ell(x, 50, 30, 30, '#c9cdd4', OL, 3); }
  ell(290, -16, 16, 10, '#fff3b0', OL, 3); c.save(); c.globalAlpha = .4; curve([-240, -30, -60, -44, 120, -44], '#fff', 6); c.restore();
  c.restore();
  const smile = o.smile ?? 1;
  const p = { t, laugh: smile * .3, lookX: smile ? 0 : -.4, tilt: smile ? -.05 : .1, nod: smile ? 0 : .7,
    L: smile ? { x: -60, y: -470, hand: 'relax' } : { x: -150, y: -280, hand: 'relax' }, R: smile ? { x: 220, y: -420, hand: 'relax' } : { x: 150, y: -280, hand: 'relax' } };
  c.save(); c.translate(170, 1060); c.scale(.6, .6); gangBody('kedi', p); c.restore();
  if (!smile) { // anahtarı geri veriyor: anahtarlıkta "1 SAAT"
    c.save(); c.translate(250, 900); c.rotate(Math.sin(t * 3) * .2); line(0, -40, 0, 0, '#c9cdd4', 4); rr(-40, 0, 80, 44, 8, '#ffd44a', OL, 3); c.font = '900 18px Inter,Arial'; c.fillStyle = '#1a1a1a'; c.textAlign = 'center'; c.fillText('1 SAAT', 0, 29); c.restore();
  }
}
function dinnerScene(t, o = {}) {
  c.fillStyle = lg(0, -300, 0, 900, [[0, '#2a1410'], [1, '#4a2418']]); c.fillRect(-500, -500, 1720, 1400);
  for (let i = 0; i < 5; i++) { ell(-100 + i * 200, 200, 30, 30, 'rgba(255,200,120,.8)', null); addLight(-100 + i * 200, 200, 180, 'rgba(255,190,110,.3)'); }
  rr(-500, 480, 1720, 20, 0, '#5a2a1a', null);
  const smile = o.smile ?? 1, ph = !smile;
  [['kedi', 600, .5, 1040], ['ayi', 360, .54, 1050], ['tilki', 120, .5, 1040]].forEach(([k, x, s, y], i) => {
    const p = { t, seated: true, laugh: smile ? .6 + .3 * Math.abs(Math.sin(t * 4 + i)) : 0, lookX: ph ? 0 : (i - 1) * -.4, lookY: ph ? .8 : 0, tilt: ph ? .08 : -.06, nod: ph ? 1 : 0,
      L: ph ? { x: -30, y: -470, hand: 'relax' } : { x: -150, y: -300, hand: 'relax' }, R: ph ? { x: 30, y: -470, hand: 'relax' } : { x: 160, y: -640, hand: 'relax' } };
    c.save(); c.translate(x, y); c.scale(s, s); gangBody(k, p); c.restore();
    if (ph) phoneInHands(x, y - s * 470, s * .9);
    else { c.save(); c.translate(x + 160 * s, y - 680 * s); poly([-14, -40, 14, -40, 6, 0, -6, 0], 'rgba(240,220,200,.5)', OL, 3); line(0, 0, 0, 30, OL, 3); ell(0, 32, 14, 4, 'rgba(240,220,200,.5)', OL, 2); c.restore(); }
  });
  // masa: beyaz örtü, mumlar, dokunulmamış tabaklar
  ell(360, 880, 420, 70, '#f1ebdf', OL, 5); c.fillStyle = '#e6dfd0'; c.fillRect(-60, 880, 840, 600);
  for (const x of [120, 360, 600]) { ell(x, 872, 70, 18, '#fbf8f2', OL, 4); ell(x, 868, 40, 10, '#b8503a', null); ell(x - 10, 862, 10, 5, '#3a7a2a', null); }
  for (const x of [240, 480]) { rr(x - 8, 790, 16, 70, 3, '#efe6d4', OL, 3); ell(x, 782 + Math.sin(t * 9 + x) * 2, 7, 12, '#ffd27a', null); addLight(x, 784, 160, 'rgba(255,200,110,.45)'); }
}

// ---------- 0) AÇILIŞ: gece 03:12, yatak odası, telefon ışığı ----------
function yatakOdasi(t, glow = 1) {
  c.fillStyle = lg(0, -300, 0, 1200, [[0, '#0b0f1c'], [1, '#141a2a']]); c.fillRect(-500, -500, 1720, 2200);
  rr(470, 160, 240, 330, 6, '#1a1f2e', OL, 8); c.fillStyle = lg(0, 170, 0, 480, [[0, '#0a1430'], [1, '#1a2448']]); c.fillRect(482, 172, 216, 306);
  for (let i = 0; i < 24; i++) rr(490 + hash(i) * 190, 330 + hash(i + 2) * 140, 8, 10, 1, `rgba(255,200,120,${.4 + .4 * hash(i + 5)})`, null);
  ell(640, 230, 22, 22, '#e7e2cf', null); line(590, 172, 590, 478, '#1a1f2e', 6); line(482, 320, 698, 320, '#1a1f2e', 6);
  rr(60, 200, 150, 200, 4, '#2a2030', OL, 5); c.save(); c.globalAlpha = .6; c.font = '900 40px Georgia,serif'; c.fillStyle = '#c9a04a'; c.textAlign = 'center'; c.fillText('D', 135, 315); c.restore(); // duvarda poster
  // komodin + dijital saat
  rr(-40, 860, 180, 160, 6, '#2a2030', OL, 5); rr(-10, 800, 120, 60, 8, '#121216', OL, 4);
  c.save(); c.font = '700 40px "Courier New",monospace'; c.fillStyle = '#ff5a4a'; c.shadowColor = '#ff3a2a'; c.shadowBlur = 14; c.fillText('03:12', -4, 845); c.restore();
  // yatak başlığı
  rr(170, 640, 520, 300, 30, '#3a2a24', OL, 6); rr(200, 830, 160, 90, 30, '#d8d4e6', OL, 4); rr(400, 830, 160, 90, 30, '#c8c4d8', OL, 4);
}
SCENES.yatak = S => {
  const t = S.t, k = S.k, lt = S.lt, wide = S.phase === 'oda';
  cam(wide ? 360 : lerp(400, 420, k), wide ? lerp(760, 720, k) : lerp(780, 740, k), wide ? lerp(1.0, 1.08, k) : lerp(1.15, 1.45, ease(cl(lt / 6, 0, 1))));
  yatakOdasi(t);
  const p = Object.assign({}, MOODS.demir[wide ? 'sad' : 'worry'], { t, talk: S.talk.demir, lookX: 0, lookY: .55, blink: (t % 3.4 < .14) ? 1 : 0, tilt: wide ? -.08 : -.04,
    L: { x: -30, y: -470, hand: 'relax' }, R: { x: 30, y: -470, hand: 'relax' } });
  c.save(); c.translate(430, 1260); c.scale(.62, .62); drawWolf(p); c.restore();
  const scroll = Math.sin(t * 3) > .6 ? 1 : .85;
  phoneInHands(430, 1260 - .62 * 480, .62, scroll);
  addLight(430, 1260 - .62 * 700, 180, 'rgba(120,170,255,.35)');
  // yorgan
  blob([140, 1000, 300, 960, 460, 980, 620, 960, 760, 1000, 760, 1500, 140, 1500], lg(0, 960, 0, 1300, [[0, '#2a3a6a'], [1, '#1a2448']]), OL, 6);
  for (let i = 0; i < 4; i++) curve([200 + i * 130, 1010, 230 + i * 130, 1100, 210 + i * 130, 1200], 'rgba(0,0,0,.25)', 4);
  c.fillStyle = 'rgba(5,8,20,.35)'; c.fillRect(-500, -500, 1720, 2200);
  if (!wide && lt < 7) { letterbox(1, 150); typeText('GECE 03:12', ss(.6, 2.2, lt), 40, 1222, '600 22px Cinzel,Georgia,serif', 'rgba(200,215,240,.85)'); }
};

// ---------- 1) AKIŞ: başkalarının vitrini ----------
SCENES.akis = S => {
  const t = S.t, k = S.k, lt = S.lt;
  cam(360, 640, 1.04 + .03 * k);
  c.fillStyle = '#05070c'; c.fillRect(-300, -300, 1320, 1900);
  const posts = [['tilki.tatilde', '🏝️ Hayat bu!', beachScene, '24.871'], ['kedi.drive', '🏎️ Yeni bebeğim', carScene, '18.402'], ['ayi.gurme', '🍷 Her akşam ayrı lezzet', dinnerScene, '31.255']];
  const pos = cl(lt / 3.4, 0, posts.length - .6);  // akış yavaşça kayar
  phoneFrame(360, 610, 420, 820, (w, h) => {
    c.fillStyle = UI.head; c.fillRect(0, 0, w, 100); c.fillStyle = '#fff'; c.font = '800 30px Inter,Arial'; c.fillText('Akış', 24, 66);
    c.font = `28px ${EMOJI}`; c.fillText('🤍  💬', w - 120, 66);
    const ph = 600;
    posts.forEach(([name, cap, scene, likes], i) => {
      const y0 = 110 + i * ph - pos * ph; if (y0 > h || y0 + ph < 0) return;
      ell(36, y0 + 30, 20, 20, ['#d9742b', '#525663', '#7d5434'][i], null); c.fillStyle = '#fff'; c.font = '700 20px Inter,Arial'; c.fillText(name, 66, y0 + 37);
      c.save(); c.beginPath(); c.rect(0, y0 + 60, w, 400); c.clip(); c.translate(0, y0 + 60); c.scale(w / 720, 400 / 720); c.translate(0, -560); scene(t, { smile: 1 }); c.restore();
      LIGHTS = LIGHTS.filter(l => false);
      const lk = Math.floor(+likes.replace('.', '') * (0.6 + .4 * ss(i * 1, i * 1 + 1.2, pos + .4)));
      c.fillStyle = '#ff4d6d'; c.font = `700 30px Inter,Arial,${EMOJI}`; c.fillText('♥', 20, y0 + 500); c.fillStyle = '#fff'; c.font = '700 22px Inter,Arial'; c.fillText(lk.toLocaleString('tr') + ' beğeni', 56, y0 + 498);
      c.fillStyle = UI.dim; c.font = `500 20px Inter,Arial,${EMOJI}`; c.fillText(cap, 20, y0 + 532);
      if (Math.abs(pos - i) < .3) { const hp = (lt * 1.2) % 1; c.save(); c.globalAlpha = (1 - hp) * .9; c.font = `${80 + hp * 40}px ${EMOJI}`; c.textAlign = 'center'; c.fillText('❤️', w / 2, y0 + 280); c.restore(); }
    });
  });
  holdingPaw(600, 900, 'demir');
};

// ---------- 2) KAREDEN ÇIKINCA: fotoğraftaki an → flaş → geri çekilen kamera → gerçek ----------
function revealShot(S, sceneFn, frame, likes) {
  const t = S.t, k = S.k, out = ss(.32, .62, k), real = k > .42, [fx, fy, fw, fh] = frame;
  const z = lerp(Math.min(720 / fw, 1280 / fh) * .98, 1.0, ease(out));
  cam(lerp(fx + fw / 2, 360, ease(out)), lerp(fy + fh / 2, 640, ease(out)), z);
  sceneFn(t, { smile: real ? 0 : 1 });
  // fotoğraf çerçevesi (vizör köşeleri + beğeni)
  c.save(); c.globalAlpha = 1 - ss(.75, .95, k); c.lineWidth = 6 / z; c.strokeStyle = '#ffffff';
  const L = 60;
  for (const [ax, ay, sx, sy] of [[fx, fy, 1, 1], [fx + fw, fy, -1, 1], [fx, fy + fh, 1, -1], [fx + fw, fy + fh, -1, -1]]) { c.beginPath(); c.moveTo(ax + sx * L, ay); c.lineTo(ax, ay); c.lineTo(ax, ay + sy * L); c.stroke(); }
  if (out > .3) { c.fillStyle = 'rgba(0,0,0,.45)'; c.beginPath(); c.rect(-500, -500, 1720, 2300); c.rect(fx + fw, fy, -fw, fh); c.fill('evenodd'); }
  c.restore();
  if (!real) { c.save(); c.translate(fx + 20, fy + fh - 80); c.scale(1 / z * 1.2, 1 / z * 1.2); likeBadge(0, 0, likes, 1); c.restore(); }
  // flaş
  const fl = 1 - ss(.36, .5, k) ; if (k > .33 && k < .5) { c.save(); c.setTransform(BASEX, 0, 0, BASEX, 0, 0); c.fillStyle = `rgba(255,255,255,${fl})`; c.fillRect(0, 0, 720, 1280); c.restore(); }
  return real ? ss(.62, .8, k) : 0;
}
SCENES.kare_tatil = S => {
  const a = revealShot(S, beachScene, [230, 470, 260, 420], '24.871');
  if (a > 0) { c.save(); c.globalAlpha = a; rr(150, 330, 420, 120, 22, 'rgba(20,24,30,.94)', 'rgba(255,255,255,.25)', 2);
    c.font = `700 24px Inter,Arial,${EMOJI}`; c.fillStyle = '#eef2f5'; c.fillText('💳 Kredi Kartı', 176, 374); c.font = '600 22px Inter,Arial'; c.fillStyle = '#ff7a6a'; c.fillText('Borç: 48.750 TL · 12 taksit', 176, 412); c.restore(); }
};
SCENES.kare_araba = S => {
  const a = revealShot(S, carScene, [60, 640, 640, 470], '18.402');
  if (a > 0) { const left = Math.max(0, 3600 - Math.floor(S.pt * 37)), mm = String(Math.floor(left / 60)).padStart(2, '0'), ss2 = String(left % 60).padStart(2, '0');
    c.save(); c.globalAlpha = a; rr(30, 470, 300, 70, 10, '#121418', OL, 4); c.font = '700 40px "Courier New",monospace'; c.fillStyle = '#ff5a4a'; c.fillText(`00:${mm}:${ss2}`, 50, 520); c.restore(); }
};
SCENES.kare_sofra = S => {
  const a = revealShot(S, dinnerScene, [20, 500, 680, 520], '31.255');
  if (a > 0) { c.save(); c.globalAlpha = a * .8; c.font = 'italic 700 34px Georgia,serif'; c.fillStyle = 'rgba(240,230,210,.9)'; c.textAlign = 'center'; c.fillText('…', 360, 480); c.restore(); }
};

// ---------- 3) GERÇEK ANLAR: masaya düşen polaroitler ----------
function polaroid(x, y, rot, drop, caption, fn) {
  if (drop <= 0) return;
  const d = ease(drop), sc = lerp(1.25, 1, d);
  c.save(); c.translate(x, y - (1 - d) * 160); c.rotate(rot * d); c.scale(sc, sc); c.globalAlpha = cl(drop * 2, 0, 1);
  ell(8, 186, 150, 14, 'rgba(0,0,0,.35)', null);
  rr(-150, -190, 300, 370, 6, '#f6f1e6', OL, 4);
  c.save(); c.beginPath(); c.rect(-130, -170, 260, 260); c.clip(); fn(); c.restore();
  c.save(); c.globalAlpha *= .1; c.fillStyle = '#ffcc88'; c.fillRect(-130, -170, 260, 260); c.restore();
  c.font = '700 30px Caveat,cursive'; c.fillStyle = '#3a2410'; c.textAlign = 'center'; c.fillText(caption, 0, 140);
  c.restore();
}
SCENES.anlar = S => {
  const t = S.t, k = S.k;
  cam(360, 660, 1.05 - .04 * k);
  c.fillStyle = lg(0, 0, 0, 1280, [[0, '#6a4128'], [1, '#3e2414']]); c.fillRect(-300, -300, 1320, 1900);
  for (let y = -300; y < 1600; y += 60) line(-300, y, 1020, y + 20, 'rgba(0,0,0,.18)', 3);
  addLight(360, 500, 700, 'rgba(255,190,110,.3)');
  polaroid(210, 380, -.12, ss(.02, .2, k), 'Babamla çay', () => {
    c.fillStyle = '#4a2e1e'; c.fillRect(-130, -170, 260, 260);
    c.save(); c.translate(-50, 160); c.scale(.3, .3); drawWolf(Object.assign({}, MOODS.demir.happy, { t, lookX: .5, L: { x: -148, y: -272, hand: 'relax' }, R: { x: 148, y: -272, hand: 'relax' } })); c.restore();
    c.save(); c.translate(60, 170); c.scale(.3, .3); drawMehmetAli(Object.assign({}, MOODS.mehmetali.happy, { t, lookX: -.5 })); c.restore();
    teaGlass(0, 70, .9, 1, 1, t);
  });
  polaroid(510, 560, .1, ss(.25, .45, k), 'İskelede gülüşmeler', () => {
    c.fillStyle = lg(0, -170, 0, 90, [[0, '#0b1430'], [1, '#2a3a6a']]); c.fillRect(-130, -170, 260, 260);
    c.save(); c.translate(-50, 170); c.scale(.28, .28); drawOwl(Object.assign({}, MOODS.kazim.warm, { t, lookX: .4, talk: .4, L: { x: -215, y: -310, hand: 'fist' }, R: { x: 186, y: -300, hand: 'relax' }, lantern: 1 })); c.restore();
    c.save(); c.translate(60, 170); c.scale(.3, .3); drawWolf(Object.assign({}, MOODS.demir.happy, { t, talk: .6, lookX: -.5, L: { x: -148, y: -272, hand: 'relax' }, R: { x: 148, y: -272, hand: 'relax' } })); c.restore();
  });
  polaroid(260, 820, .06, ss(.5, .7, k), 'Yağmurlu pazar', () => {
    c.fillStyle = '#2a2030'; c.fillRect(-130, -170, 260, 260); rr(-110, -150, 120, 160, 4, '#1a2448', OL, 3);
    for (let i = 0; i < 10; i++) line(-100 + hash(i) * 100, -140 + ((hash(i + 2) * 150 + t * 60) % 150), -103 + hash(i) * 100, -128 + ((hash(i + 2) * 150 + t * 60) % 150), 'rgba(200,210,230,.5)', 2);
    c.save(); c.translate(40, 200); c.scale(.32, .32); drawWolf(Object.assign({}, MOODS.demir.happy, { t, lookX: -.2, lookY: .4, L: { x: -60, y: -420, hand: 'relax' }, R: { x: 60, y: -420, hand: 'relax' } })); c.restore();
    rr(10, 30, 70, 50, 4, '#c8402a', OL, 3);
  });
  dustMotes(t, 30, 60, 200, 600, 900, .4);
};

// ---------- 4) TELEFON CEBE ----------
SCENES.cebe = S => {
  const t = S.t, k = S.k, d = ease(cl(k / .8, 0, 1));
  cam(360, 700, 1.0);
  c.fillStyle = lg(0, 0, 0, 1280, [[0, '#6a1822'], [1, '#4a1018']]); c.fillRect(-300, -300, 1320, 1900);
  for (let x = -300; x < 1020; x += 12) line(x, -300, x, 1600, 'rgba(0,0,0,.06)', 2);
  for (const y of [300, 520, 740, 960]) ell(120, y, 12, 12, '#e9e3d6', OL, 3);
  c.save(); c.font = '900 200px Georgia,serif'; c.fillStyle = '#e8bf5c'; c.lineWidth = 12; c.strokeStyle = OL; c.strokeText('D', 420, 520); c.fillText('D', 420, 520); c.restore();
  // cep yarığı
  c.beginPath(); c.moveTo(260, 820); c.lineTo(560, 760); c.lineWidth = 14; c.strokeStyle = '#2a0a0e'; c.stroke(); c.lineWidth = 4; c.strokeStyle = OL; c.stroke();
  // telefon cebe kayar (ekran söner)
  const py = lerp(560, 860, d);
  c.save(); c.beginPath(); c.moveTo(-300, -300); c.lineTo(1020, -300); c.lineTo(1020, 760 - 60 * 0); c.lineTo(560, 760); c.lineTo(260, 820); c.lineTo(-300, 820); c.closePath(); c.clip();
  c.save(); c.translate(410, py); c.rotate(-.2); rr(-80, -150, 160, 300, 20, '#16181c', OL, 6); rr(-68, -136, 136, 272, 14, `rgba(80,130,200,${.8 * (1 - ss(.1, .5, k))})`, null); c.restore();
  ell(470, py - 40, 70, 60, WOLF_C.paw, OL, 5); capsule([700, py - 200, 520, py - 60], 110, WOLF_C.sleeve, 6);
  c.restore();
  addLight(410, py, 300 * (1 - ss(.1, .5, k)), 'rgba(120,170,255,.4)');
};

// kapanış çizimi: polaroit
function frameSketch(k, x, y, s = 1) {
  c.save(); c.translate(x, y); c.scale(s, s); c.strokeStyle = '#3a2410'; c.lineWidth = 4; c.lineCap = 'round';
  const seg = (a, b, pts) => { const kk = cl((k - a) / (b - a), 0, 1); if (kk <= 0) return; c.beginPath(); c.moveTo(pts[0], pts[1]); const n = pts.length / 2 - 1, m = kk * n; for (let i = 1; i <= Math.ceil(m); i++) { const f = Math.min(1, m - (i - 1)); c.lineTo(lerp(pts[i * 2 - 2], pts[i * 2], f), lerp(pts[i * 2 - 1], pts[i * 2 + 1], f)); } c.stroke(); };
  seg(0, .4, [-60, -70, 60, -70, 60, 70, -60, 70, -60, -70]);
  seg(.4, .6, [-46, -56, 46, -56, 46, 30, -46, 30, -46, -56]);
  seg(.6, .8, [-46, 20, -14, -12, 6, 8, 24, -8, 46, 20]);
  seg(.8, 1, [20, -36, 26, -42, 32, -36, 26, -30, 20, -36]);
  c.restore();
}
