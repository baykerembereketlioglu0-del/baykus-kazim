// Sahneler. Dünya koordinatı 720x1280 (kamera yakınlaştırınca da vektör olduğu için net kalır).
// Yerleşim: duvar dibi y=870, kaldırım 870-1010 (karakterler y≈985'te durur), bordür 1010, sokak 1030+.

function drawWindow(x, y, w, h, lit, sil, t, seed) {
  rr(x - 10, y - 10, w + 20, h + 20, 4, '#2a1a10', OL, 5);
  if (lit) {
    const f = .92 + .08 * noise1(t * 1.5 + seed * 7);
    c.fillStyle = lg(0, y, 0, y + h, [[0, `rgba(240,170,80,${f})`], [1, `rgba(170,90,30,${f})`]]); c.fillRect(x, y, w, h);
    if (sil) { // pencerede iki siluet
      c.fillStyle = 'rgba(40,20,10,.85)';
      for (const [sx, sh] of [[x + w * .3, 0], [x + w * .68, 8]]) { ell(sx, y + h * .45 + sh, 16, 18, 'rgba(40,20,10,.85)', null); c.beginPath(); c.ellipse(sx, y + h + 4, 32, 60 - sh, 0, PI, 0); c.fill(); }
    }
    c.fillStyle = '#6e2a1d'; c.beginPath(); c.moveTo(x, y); c.lineTo(x + w * .28, y); c.quadraticCurveTo(x + w * .12, y + h * .6, x + w * .2, y + h); c.lineTo(x, y + h); c.fill(); // perde
    c.beginPath(); c.moveTo(x + w, y); c.lineTo(x + w * .72, y); c.quadraticCurveTo(x + w * .88, y + h * .6, x + w * .8, y + h); c.lineTo(x + w, y + h); c.fill();
    addLight(x + w / 2, y + h / 2, 170, `rgba(255,160,70,${.16 * f})`);
  } else { c.fillStyle = lg(0, y, 0, y + h, [[0, '#15110f'], [1, '#0c0907']]); c.fillRect(x, y, w, h); }
  c.lineWidth = 6; c.strokeStyle = '#2a1a10'; c.beginPath(); c.moveTo(x + w / 2, y); c.lineTo(x + w / 2, y + h); c.moveTo(x, y + h * .42); c.lineTo(x + w, y + h * .42); c.stroke();
  c.strokeRect(x, y, w, h);
  rr(x - 18, y + h + 8, w + 36, 14, 3, '#3a271a', OL, 4);
}

function drawStreet(t, S = {}) {
  const lamp = S.lamp ?? 1;
  c.fillStyle = '#0b0806'; c.fillRect(-600, -600, 1920, 2600);
  // cephe + tuğla
  c.fillStyle = lg(0, -200, 0, 880, [[0, '#140e0a'], [1, '#2a1c14']]); c.fillRect(-500, -300, 1720, 1180);
  c.lineWidth = 1.6; c.strokeStyle = 'rgba(0,0,0,.4)'; c.beginPath();
  for (let r = 0, y = -300; y < 870; y += 24, r++) { c.moveTo(-500, y); c.lineTo(1220, y); for (let x = -500 + (r % 2) * 26; x < 1220; x += 52) { c.moveTo(x, y); c.lineTo(x, y + 24); } }
  c.stroke();
  for (let i = 0; i < 160; i++) { const bx = -500 + Math.floor(hash(i) * 33) * 52 + (hash(i + 50) > .5 ? 26 : 0), by = -300 + Math.floor(hash(i + 9) * 49) * 24; c.fillStyle = `rgba(${hash(i + 3) > .5 ? '120,70,40' : '0,0,0'},.12)`; c.fillRect(bx + 1, by + 1, 50, 22); }
  drawWindow(60, 120, 150, 200, 1, 0, t, 1); drawWindow(285, 120, 150, 200, 1, 1, t, 2); drawWindow(510, 120, 150, 200, 0, 0, t, 3);
  drawWindow(-200, 120, 150, 200, 0, 0, t, 4); drawWindow(735, 120, 150, 200, 1, 0, t, 5);
  rr(-500, 372, 1720, 26, 0, '#24170f', OL, 5); rr(-500, 398, 1720, 12, 0, '#140d09', null);
  // tabela
  rr(80, 430, 320, 56, 6, '#3d2516', OL, 5);
  const sign = S.sign || 'KIRAATHANE'; c.save(); c.font = '700 30px Cinzel,Georgia,serif'; c.textAlign = 'center'; c.letterSpacing = '6px';
  let fs = 30; while (c.measureText(sign).width > 290 && fs > 14) { fs -= 2; c.font = `700 ${fs}px Cinzel,Georgia,serif`; c.letterSpacing = (fs / 6 | 0) + 'px'; }
  c.fillStyle = '#e2b35a'; c.shadowColor = 'rgba(255,170,60,.6)'; c.shadowBlur = 12; c.fillText(sign, 240, 469); c.restore();
  // dükkân vitrini
  const sx = 56, sy = 560, sw = 344, sh = 300;
  rr(sx - 14, sy - 14, sw + 28, sh + 24, 4, '#2c1a10', OL, 6);
  c.fillStyle = lg(0, sy, 0, sy + sh, [[0, '#f0b45c'], [.6, '#c9782e'], [1, '#7a3e16']]); c.fillRect(sx, sy, sw, sh);
  c.fillStyle = 'rgba(70,30,10,.75)';
  for (const shy of [sy + 70, sy + 150]) { c.fillRect(sx, shy, sw, 8); for (let k = 0; k < 9; k++) { const jx = sx + 16 + k * 37, jh = 26 + hash(k + shy) * 22; rr(jx, shy - jh, 22, jh, 4, 'rgba(70,30,10,.75)', null); } }
  c.fillStyle = 'rgba(50,22,8,.85)'; ell(sx + 250, sy + 205, 22, 24, 'rgba(50,22,8,.85)', null); // çaycı siluet
  c.beginPath(); c.ellipse(sx + 250, sy + sh + 10, 46, 85, 0, PI, 0); c.fill();
  rr(sx + 80, sy + 236, 120, 64, 4, 'rgba(50,22,8,.85)', null);       // masa
  c.lineWidth = 7; c.strokeStyle = '#2c1a10'; c.beginPath(); for (const k of [1, 2]) { c.moveTo(sx + sw * k / 3, sy); c.lineTo(sx + sw * k / 3, sy + sh); } c.stroke();
  c.save(); c.globalAlpha = .18; c.fillStyle = '#fff'; c.beginPath(); c.moveTo(sx + 20, sy); c.lineTo(sx + 70, sy); c.lineTo(sx + 10, sy + 120); c.lineTo(sx, sy + 120); c.fill(); c.restore();
  addLight(sx + sw / 2, sy + sh / 2, 330, 'rgba(255,150,60,.30)');
  // tente
  c.beginPath(); c.moveTo(sx - 30, 500); c.lineTo(sx + sw + 30, 500); c.lineTo(sx + sw + 50, 560);
  for (let k = 8; k >= 0; k--) { const ax = sx - 50 + k * ((sw + 100) / 8); c.quadraticCurveTo(ax + (sw + 100) / 16, 586, ax, 560); }
  c.closePath(); c.fillStyle = '#6a1a22'; c.fill(); c.save(); c.clip();
  for (let k = 0; k < 9; k++) { c.fillStyle = k % 2 ? '#6a1a22' : '#d9c7a4'; c.beginPath(); const a = sx - 30 + k * ((sw + 60) / 9), b = sx - 50 + k * ((sw + 100) / 9); c.moveTo(a, 500); c.lineTo(a + (sw + 60) / 9, 500); c.lineTo(b + (sw + 100) / 9, 590); c.lineTo(b, 590); c.fill(); }
  c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(0, 540, 720, 60); c.restore();
  c.beginPath(); c.moveTo(sx - 30, 500); c.lineTo(sx + sw + 30, 500); c.lineTo(sx + sw + 50, 560); c.lineWidth = 5; c.strokeStyle = OL; c.stroke();
  // kapı
  rr(452, 600, 120, 270, 4, '#24150c', OL, 6); rr(470, 620, 84, 90, 3, 'rgba(240,170,80,.85)', OL, 4);
  rr(470, 730, 84, 120, 3, '#1c1009', OL, 4); ell(548, 760, 6, 6, '#d9a441', OL, 2);
  addLight(512, 665, 90, 'rgba(255,160,70,.25)');
  rr(-500, 860, 1720, 14, 0, '#1a110b', null);
  // kaldırım
  c.fillStyle = lg(0, 870, 0, 1012, [[0, '#1b140f'], [1, '#2a2019']]); c.fillRect(-500, 870, 1720, 142);
  c.lineWidth = 2; c.strokeStyle = 'rgba(0,0,0,.45)'; c.beginPath();
  for (const y of [905, 950]) { c.moveTo(-500, y); c.lineTo(1220, y); }
  for (let x = -480; x < 1220; x += 110) { c.moveTo(x, 870); c.lineTo(x - 14, 1010); } c.stroke();
  rr(-500, 1010, 1720, 22, 0, '#3a2d22', OL, 4); line(-500, 1012, 1220, 1012, 'rgba(255,220,170,.15)', 2);
  // ıslak sokak + parke taşı
  c.fillStyle = '#0f0b09'; c.fillRect(-500, 1032, 1720, 900);
  c.lineWidth = 2; c.strokeStyle = 'rgba(70,55,40,.35)';
  for (let r = 0; r < 12; r++) { const y = 1046 + r * 26, w = 40 + r * 4; c.beginPath(); for (let x = -500 + (r % 2) * w / 2; x < 1220; x += w) { c.moveTo(x + w - 6, y); c.ellipse(x + w / 2, y, w / 2 - 6, 9, 0, 0, TAU); } c.stroke(); }
  // yansımalar (titreşen dikey ışık şeritleri)
  c.save(); c.globalCompositeOperation = 'lighter';
  for (const [rx, rw, col, a] of [[sx + sw / 2, sw * .8, '255,150,60', .22 * 1], [560, 70, '255,200,110', .3 * lamp], [512, 50, '255,160,70', .12]]) {
    for (let k = 0; k < 14; k++) {
      const yy = 1036 + k * 22, wob = noise1(t * 2 + k * 3.1 + rx) * 8, ww = rw * (1 - k / 22) * (.7 + .3 * hash(k + rx));
      c.fillStyle = `rgba(${col},${a * (1 - k / 14)})`; c.fillRect(rx - ww / 2 + wob, yy, ww, 9);
    }
  } c.restore();
  // birikinti su
  for (const [px, py, pr] of [[150, 962, 70], [600, 990, 50], [380, 1110, 110]]) {
    ell(px, py, pr, pr * .16, 'rgba(8,6,5,.75)', null);
    c.save(); c.globalCompositeOperation = 'lighter'; ell(px + pr * .2, py, pr * .5, pr * .05, 'rgba(255,190,110,.18)', null); c.restore();
    for (let k = 0; k < 3; k++) { const ph = (t * .9 + hash(px + k) * 3) % 1; c.globalAlpha = (1 - ph) * .5; ell(px + (hash(k + px) - .5) * pr, py, 4 + ph * 26, (4 + ph * 26) * .22, null, 'rgba(255,220,180,.6)', 1.5); c.globalAlpha = 1; }
  }
  // sokak lambası
  const fl = lamp * (.93 + .07 * noise1(t * 6));
  c.save(); c.globalCompositeOperation = 'lighter';
  c.fillStyle = lg(0, 200, 0, 1010, [[0, `rgba(255,205,120,${.30 * fl})`], [1, 'rgba(255,205,120,0)']]);
  c.beginPath(); c.moveTo(530, 205); c.lineTo(590, 205); c.lineTo(840, 1010); c.lineTo(200, 1010); c.closePath(); c.fill(); c.restore();
  c.save(); c.globalCompositeOperation = 'lighter'; ell(470, 992, 300, 48, rg(470, 992, 0, 300, [[0, `rgba(255,190,100,${.22 * fl})`], [1, 'rgba(0,0,0,0)']]), null); c.restore();
  rr(636, 160, 18, 860, 4, '#141110', OL, 5); rr(624, 960, 42, 56, 6, '#141110', OL, 5); rr(630, 600, 30, 20, 4, '#141110', OL, 4);
  c.beginPath(); c.moveTo(645, 170); c.quadraticCurveTo(645, 130, 600, 140); c.lineTo(566, 150); c.lineWidth = 16; c.strokeStyle = OL; c.stroke(); c.lineWidth = 9; c.strokeStyle = '#141110'; c.stroke();
  poly([538, 150, 594, 150, 604, 175, 528, 175], '#141110', OL, 5);
  poly([532, 175, 600, 175, 590, 214, 542, 214], `rgba(255,${220 * fl | 0},140,${.6 + .4 * fl})`, OL, 5);
  addLight(566, 196, 380, `rgba(255,190,100,${.45 * fl})`); addLight(566, 196, 70, `rgba(255,240,200,${.9 * fl})`);
}
// Yağmur (ekran koordinatında). layer 0: arka ince, 1: ön kalın
function drawRain(t, W, H, layer, a = 1) {
  const n = layer ? 70 : 130, sp = layer ? 1500 : 1000, len = layer ? 46 : 24;
  c.lineWidth = layer ? 2.4 : 1.4; c.strokeStyle = layer ? 'rgba(230,215,190,.32)' : 'rgba(210,195,170,.22)';
  c.save(); c.globalAlpha = a; c.beginPath();
  for (let i = 0; i < n; i++) {
    const s = sp * (.8 + hash(i * 3 + layer) * .4), y = ((hash(i + layer * 99) * (H + 200) + s * t) % (H + 200)) - 100, x = hash(i * 7 + layer) * (W + 200) - 100 - y * .1;
    c.moveTo(x, y); c.lineTo(x - len * .12, y + len);
  }
  c.stroke(); c.restore();
}
// Kaldırımda sıçrayan damlalar (dünya koordinatı)
function drawSplashes(t) {
  c.save(); c.strokeStyle = 'rgba(230,215,190,.5)'; c.lineWidth = 1.5;
  for (let i = 0; i < 26; i++) {
    const per = .5 + hash(i) * .5, ph = ((t + hash(i + 3) * 5) % per) / per, k = Math.floor((t + hash(i + 3) * 5) / per);
    const x = -50 + hash(i * 13 + k) * 820, y = 880 + hash(i * 29 + k) * 340;
    c.globalAlpha = (1 - ph) * .7; c.beginPath(); c.ellipse(x, y, 2 + ph * 12, (2 + ph * 12) * .3, 0, PI, TAU); c.stroke();
  }
  c.restore();
}
