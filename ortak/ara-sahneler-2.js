// Ara sahneler (2): telefon ekranları, kapı önü anıları, şemsiye metaforu, ters çevrilen telefon, şafağa yürüyüş.
// SCENES, cam, dustMotes, silhouette … ara-sahneler.js'ten gelir.

// ---------- telefon arayüzü ----------
const UI = { bg: '#0f1318', head: '#171c23', them: '#262c35', me: '#1f6b4c', text: '#eef2f5', dim: '#8d98a5', blue: '#4fb6ff' };
const EMOJI = "'Noto Color Emoji','Apple Color Emoji',sans-serif";
function phoneFrame(x, y, w, h, fn) { // gövde + ekran; fn ekranı yerel koordinatta (0,0)-(w,h) çizer
  rr(x - w / 2 - 16, y - h / 2 - 16, w + 32, h + 32, 58, '#0b0c0e', OL, 6);
  rr(x - w / 2 - 10, y - h / 2 - 10, w + 20, h + 20, 52, '#1c1e22', null);
  c.save(); c.beginPath(); c.roundRect(x - w / 2, y - h / 2, w, h, 44); c.clip(); c.translate(x - w / 2, y - h / 2);
  c.fillStyle = UI.bg; c.fillRect(0, 0, w, h); fn(w, h); c.restore();
  rr(x - 52, y - h / 2 + 10, 104, 26, 13, '#000', null);                     // çentik
  c.save(); c.globalAlpha = .08; c.beginPath(); c.moveTo(x - w / 2, y - h / 2); c.lineTo(x - w / 2 + w * .5, y - h / 2); c.lineTo(x - w / 2, y + h * .1); c.closePath(); c.fillStyle = '#fff'; c.fill(); c.restore();
  addLight(x, y, w * 1.1, 'rgba(160,200,255,.12)');
}
function chatHeader(w, name, status, avatar = '🌙') {
  c.fillStyle = UI.head; c.fillRect(0, 0, w, 130);
  c.fillStyle = UI.text; c.font = '600 30px Inter,Arial'; c.fillText('‹', 20, 92);
  ell(80, 82, 28, 28, '#3a4250', null); c.font = `28px ${EMOJI}`; c.textAlign = 'center'; c.fillText(avatar, 80, 92); c.textAlign = 'left';
  c.fillStyle = UI.text; c.font = '700 26px Inter,Arial'; c.fillText(name, 124, 76);
  c.fillStyle = status === 'yazıyor…' ? '#5fd08f' : UI.dim; c.font = '500 18px Inter,Arial'; c.fillText(status, 124, 102);
}
function wrapText(t, maxW) { const ws = t.split(' '), out = []; let cur = ''; for (const w of ws) { const tt = cur ? cur + ' ' + w : w; if (c.measureText(tt).width > maxW && cur) { out.push(cur); cur = w; } else cur = tt; } if (cur) out.push(cur); return out; }
// mesaj balonu; a: görünme (0..1). Döndürür: alt y
function bubble(w, y, text, me, time, a, ticks) {
  if (a <= 0) return y;
  c.save(); c.font = `500 23px Inter,Arial,${EMOJI}`;
  const lines = wrapText(text, w * .6), bw = Math.max(...lines.map(l => c.measureText(l).width)) + 110, bh = lines.length * 30 + 30;
  const x = me ? w - bw - 18 : 18, pop = ease(cl(a * 1.4, 0, 1));
  c.globalAlpha = cl(a * 2, 0, 1); c.translate(me ? x + bw : x, y + bh); c.scale(.8 + .2 * pop, .8 + .2 * pop); c.translate(me ? -(x + bw) : -x, -(y + bh));
  rr(x, y, bw, bh, 18, me ? UI.me : UI.them, null);
  c.fillStyle = UI.text; lines.forEach((l, i) => c.fillText(l, x + 16, y + 34 + i * 30));
  c.font = '500 15px Inter,Arial'; c.fillStyle = 'rgba(230,240,245,.6)'; c.textAlign = 'right'; c.fillText(time, x + bw - (me ? 40 : 14), y + bh - 10);
  if (me && ticks) { c.fillStyle = ticks === 2 ? UI.blue : 'rgba(230,240,245,.6)'; c.font = '700 16px Inter,Arial'; c.fillText('✓✓', x + bw - 12, y + bh - 10); }
  c.restore(); return y + bh + 14;
}
function typingDots(w, y, t, a) { if (a <= 0) return; c.save(); c.globalAlpha = a; rr(18, y, 96, 46, 18, UI.them, null); for (let i = 0; i < 3; i++) ell(44 + i * 22, y + 23 - Math.max(0, Math.sin(t * 8 - i)) * 6, 6, 6, UI.dim, null); c.restore(); }
function blurredStreet(t, dawn = 0) { // telefonun arkasında bulanık yağmurlu sokak
  c.fillStyle = lg(0, 0, 0, 1280, [[0, dawn ? '#3a2a24' : '#0a0806'], [1, '#160f0a']]); c.fillRect(-300, -300, 1320, 1900);
  c.save(); c.filter = 'blur(18px)';
  for (let i = 0; i < 14; i++) ell(hash(i) * 720, 200 + hash(i + 3) * 900, 40 + hash(i + 5) * 60, 40 + hash(i + 5) * 60, `rgba(255,${150 + hash(i) * 60 | 0},70,${.15 + .25 * hash(i + 2)})`, null);
  c.restore();
  drawRain(t, 720, 1280, 0, .6);
}
function holdingPaw(x, y, kind) { // telefonu tutan pati (alttan)
  if (kind === 'demir') { capsule([x + 60, 1420, x + 30, y + 120], 120, WOLF_C.sleeve, 7); capsule([x + 36, y + 170, x + 30, y + 120], 124, '#6a1822', 6); ell(x - 10, y + 70, 74, 60, WOLF_C.paw, OL, 6); for (const k of [-1, 0, 1]) ell(x - 60, y + 30 + k * 34, 22, 16, WOLF_C.paw, OL, 5); }
  else { capsule([x + 60, 1420, x + 30, y + 120], 120, '#2a2433', 7); ell(x - 10, y + 70, 74, 60, '#1a1620', 'rgba(170,140,255,.35)', 5); for (const k of [-1, 0, 1]) ell(x - 60, y + 30 + k * 34, 22, 16, '#1a1620', 'rgba(170,140,255,.35)', 4); }
}

SCENES.telefon = S => {
  const t = S.t, k = S.k, ph = S.phase || 'bildirim', pw = 400, ph2 = 780;
  const dz = ph === 'liste' ? 1.06 + .05 * k : 1.04 + .06 * k;
  cam(360, 640, dz);
  blurredStreet(t);
  const owner = ph === 'liste' ? 'o' : 'demir', tilt = Math.sin(t * .8) * .015;
  c.save(); c.translate(360, 620); c.rotate(tilt); c.translate(-360, -620);
  phoneFrame(360, 620, pw, ph2, (w, h) => {
    if (ph === 'bildirim') {
      chatHeader(w, 'Deniz', k > .1 && k < .42 ? 'yazıyor…' : 'çevrimiçi');
      c.fillStyle = UI.dim; c.font = '600 16px Inter,Arial'; c.textAlign = 'center'; c.fillText('BUGÜN', w / 2, 170); c.textAlign = 'left';
      let y = bubble(w, 200, 'Selam 🙂', true, '20:31', 1, 2);
      y = bubble(w, y, 'Napıyorsun, görüşelim mi?', true, '20:32', 1, 2);
      c.fillStyle = UI.dim; c.font = '500 16px Inter,Arial'; c.textAlign = 'center'; c.fillText('— 3 gün sonra —', w / 2, y + 30); c.textAlign = 'left'; y += 56;
      typingDots(w, y, t, k > .1 && k < .25 ? 1 : 0);
      y = bubble(w, y, 'Napıyorsun?', false, '02:14', ss(.25, .3, k));
      y = bubble(w, y, 'Canım çok sıkılıyor 😩 gelsene', false, '02:14', ss(.4, .45, k));
      y = bubble(w, y, 'Hemen geliyorum! 🏃‍♂️', true, '02:14', ss(.68, .73, k), 2);
    } else if (ph === 'gorundu') {
      const hrs = Math.floor(lerp(14 * 60 + 2, 21 * 60 + 47, ss(.1, .95, k))), clock = String(Math.floor(hrs / 60)).padStart(2, '0') + ':' + String(hrs % 60).padStart(2, '0');
      const fake = k > .55 && k < .7;
      chatHeader(w, 'Deniz', fake ? 'yazıyor…' : 'son görülme 14:03');
      let y = bubble(w, 170, 'Bugün müsait misin?', true, '14:02', 1, 2);
      y = bubble(w, y, 'Sana bir şey anlatacaktım', true, '15:30', ss(.15, .2, k), 2);
      y = bubble(w, y, 'Tamam… sen bilirsin', true, '19:45', ss(.35, .4, k), 2);
      c.fillStyle = UI.dim; c.font = '500 17px Inter,Arial'; c.textAlign = 'right'; c.fillText('Görüldü', w - 22, y + 12); c.textAlign = 'left';
      typingDots(w, y + 30, t, fake ? 1 : 0);
      // durum çubuğu saati hızla ilerliyor
      c.fillStyle = 'rgba(0,0,0,.55)'; rr(w / 2 - 90, h - 150, 180, 64, 20, 'rgba(0,0,0,.55)', null);
      c.fillStyle = '#fff'; c.font = '700 40px Inter,Arial'; c.textAlign = 'center'; c.fillText(clock, w / 2, h - 104); c.textAlign = 'left';
    } else if (ph === 'liste') {
      c.fillStyle = UI.head; c.fillRect(0, 0, w, 130); c.fillStyle = UI.text; c.font = `700 28px Inter,Arial,${EMOJI}`; c.fillText('Kimi arasam? 🥱', 26, 90);
      const rows = [['🎉', 'Parti Grubu', 'meşgul', '#c04848'], ['M', 'Mert', 'çevrimdışı', '#7a6a4a'], ['S', 'Selin', 'cevap yok', '#5b3a73'], ['E', 'Ece', 'görüldü', '#2f4a3a'], ['D', 'Demir', 'her zaman müsait ✅', '#7d1f2a']];
      const pick = Math.min(4, Math.floor(k / .17)), tap = ss(.82, .86, k);
      rows.forEach(([av, name, st, col], i) => {
        const y = 160 + i * 112, act = i === pick;
        if (act) rr(10, y - 8, w - 20, 100, 16, i === 4 ? `rgba(95,208,143,${.18 + .2 * tap})` : 'rgba(255,255,255,.06)', null);
        ell(64, y + 42, 34, 34, col, null); c.font = `700 28px Inter,Arial,${EMOJI}`; c.fillStyle = '#fff'; c.textAlign = 'center'; c.fillText(av, 64, y + 52); c.textAlign = 'left';
        c.fillStyle = UI.text; c.font = '700 25px Inter,Arial'; c.fillText(name, 116, y + 36);
        c.fillStyle = i === 4 ? '#5fd08f' : UI.dim; c.font = `500 18px Inter,Arial,${EMOJI}`; c.fillText(st, 116, y + 64);
        if (i < pick || (i < 4 && k > .82)) { c.save(); c.globalAlpha = .9; line(26, y + 42, w - 26, y + 42, '#e05252', 4); c.restore(); }
      });
      if (tap > 0) { c.save(); c.globalAlpha = 1 - ss(.9, 1, k); ell(w / 2, 160 + 4 * 112 + 42, 30 + 120 * tap, 30 + 120 * tap, null, '#5fd08f', 4); c.restore();
        c.fillStyle = 'rgba(95,208,143,' + ss(.88, .95, k) + ')'; c.font = '700 26px Inter,Arial'; c.textAlign = 'center'; c.fillText('Demir aranıyor…', w / 2, h - 120); c.textAlign = 'left'; }
      // parmak imleci
      const fy = 160 + Math.min(4, k / .17) * 112 + 50; ell(w - 80, fy, 22, 22, 'rgba(255,255,255,.18)', 'rgba(255,255,255,.4)', 3);
    }
  });
  c.restore();
  holdingPaw(600, 900, owner);
  if (ph === 'liste') { c.save(); c.globalAlpha = .55; c.font = '900 italic 40px Inter,Arial'; c.fillStyle = '#c9b8ff'; c.textAlign = 'center'; c.fillText('z z z', 560, 200 - Math.sin(t * 2) * 8); c.restore(); }
};

// ---------- ANI: her çağrıya koşan Demir (3 kısa kesit) ----------
function umbrella(x, y, s, open = 1, col = '#7d1f2a', ang = 0) { // açık/kapalı şemsiye; (x,y) sap ucu
  c.save(); c.translate(x, y); c.rotate(ang); c.scale(s, s);
  line(0, 0, 0, -300, '#2a1a10', 8); c.beginPath(); c.arc(-14, 0, 14, 0, PI); c.lineWidth = 8; c.strokeStyle = '#2a1a10'; c.stroke();
  if (open > .05) {
    const R = 210 * open, top = -300 - 40 * open;
    c.beginPath(); c.moveTo(-R, -300 + 30); for (let i = 0; i < 6; i++) { const a = -R + i * R / 3, b = a + R / 3; c.quadraticCurveTo((a + b) / 2, -300 + 54 * open, b, -300 + 30); }
    c.quadraticCurveTo(R * .8, top - 30, 0, top - 50); c.quadraticCurveTo(-R * .8, top - 30, -R, -300 + 30); c.closePath();
    c.fillStyle = lg(0, top - 50, 0, -270, [[0, col], [1, '#4a1018']]); c.fill(); c.lineWidth = 6; c.strokeStyle = OL; c.stroke();
    for (let i = 1; i < 6; i++) { const a = -R + i * R / 3; curve([0, top - 50, a * .55, top + 10, a, -300 + 30], 'rgba(0,0,0,.35)', 3); }
    c.save(); c.globalAlpha = .35; curve([-R * .5, top + 10, -R * .2, top - 30], '#f2c766', 6); c.restore(); line(0, top - 50, 0, top - 76, '#2a1a10', 6);
  } else { blob([-16, -40, 0, -330, 16, -40, 8, -70, -8, -70], lg(-16, 0, 16, 0, [[0, '#4a1018'], [1, col]]), OL, 5); line(0, -330, 0, -356, '#2a1a10', 6); }
  c.restore();
}
SCENES.kapi = S => {
  const t = S.t, k = S.k, cut = Math.min(2, Math.floor(k * 3)), lk = (k * 3) % 1;
  const stamps = ['02:14', '23:40', '04:05'], cams = [[330, 720, 1.3], [560, 700, 1.4], [500, 740, 1.3]];
  const [cx, cy, z] = cams[cut]; cam(cx, cy, z * (1 + .05 * lk));
  drawStreet(t + cut * 3, { lamp: cut === 2 ? .35 : 1, sign: 'KIRAATHANE' });
  const pos = [[300, 985], [600, 990], [512, 990]][cut];
  const p = Object.assign({}, MOODS.demir[cut === 2 ? 'sad' : 'worry'], { t, talk: 0, lookX: cut === 2 ? .4 : -.2, lookY: cut === 2 ? .5 : 0, blink: 0, tilt: cut === 2 ? -.06 : 0,
    L: { x: -148, y: -272, hand: 'relax' }, R: cut === 2 ? { x: 150, y: -300, hand: 'relax' } : { x: 170, y: -620, hand: 'relax' } });
  c.save(); c.translate(pos[0], pos[1]); c.scale(.56, .56); drawWolf(p); if (cut === 2) umbrella(150, -260, .9, 0, '#7d1f2a', .1); else umbrella(170, -620, 1.3, 1, '#7d1f2a', -.24); c.restore();
  if (cut === 2) { c.save(); c.globalAlpha = ss(.3, .5, lk); rr(452, 600, 120, 270, 4, 'rgba(0,0,0,.55)', null); c.restore(); } // kapının ışığı söner
  drawSplashes(t); c.setTransform(1.5, 0, 0, 1.5, 0, 0);
  c.save(); c.font = '700 44px Inter,Arial'; c.fillStyle = 'rgba(255,235,200,.9)'; c.shadowColor = '#000'; c.shadowBlur = 10; c.fillText(stamps[cut], 40, 170); c.restore();
  if (lk < .06) { c.fillStyle = `rgba(255,240,220,${(1 - lk / .06) * .5})`; c.fillRect(0, 0, 720, 1280); }
};

// ---------- ŞEMSİYE: yağmurda aranır, güneşte unutulur ----------
SCENES.semsiye = S => {
  const t = S.t, k = S.k, ph = S.phase || 'yagmur';
  const day = ph === 'yagmur' ? ss(.55, .95, k) : 1;
  cam(ph === 'yagmur' ? 360 : lerp(480, 560, ease(k)), ph === 'yagmur' ? 700 : lerp(760, 760, k), ph === 'yagmur' ? 1.05 : lerp(1.3, 1.75, ease(k)));
  // gökyüzü: geceden sabaha
  c.fillStyle = lg(0, -300, 0, 900, [[0, `rgb(${lerp(10, 120, day) | 0},${lerp(12, 150, day) | 0},${lerp(22, 190, day) | 0})`], [1, `rgb(${lerp(30, 245, day) | 0},${lerp(24, 190, day) | 0},${lerp(20, 130, day) | 0})`]]); c.fillRect(-300, -300, 1320, 1300);
  if (ph !== 'yagmur') { const d = (k * 4) % 1, sun = Math.sin(d * PI); ell(lerp(-50, 770, d), 380 - sun * 260, 50, 50, sun > .2 ? '#ffe7a0' : '#e7e2cf', null); }
  else if (day > 0) { ell(560, 520 - day * 260, 60, 60, '#ffe7a0', null); addLight(560, 520 - day * 260, 300 * day, `rgba(255,220,140,${.4 * day})`); }
  // kafe cephesi
  c.fillStyle = '#2c1d14'; c.fillRect(-300, 300, 1320, 600);
  rr(80, 420, 300, 380, 4, `rgba(${lerp(200, 120, day) | 0},${lerp(130, 100, day) | 0},70,.9)`, OL, 8); rr(440, 520, 130, 300, 4, '#24150c', OL, 6);
  c.save(); c.font = '700 30px Cinzel,Georgia,serif'; c.fillStyle = '#e2b35a'; c.textAlign = 'center'; c.fillText('KAFE', 230, 395); c.restore();
  c.fillStyle = lg(0, 860, 0, 1300, [[0, '#2a2019'], [1, '#14100c']]); c.fillRect(-300, 860, 1320, 800); rr(-300, 856, 1320, 10, 0, '#4a3a2c', null);
  const wet = 1 - day * .6; c.save(); c.globalAlpha = .35 * wet; ell(330, 1000, 200, 24, 'rgba(255,200,120,.4)', null); c.restore();
  if (ph === 'yagmur') {
    // "o" şemsiyeyle; yağmur dinince kapatıp duvara bırakır ve gider
    const leave = ss(.7, 1, k), close = ss(.6, .7, k);
    const ox = lerp(300, 820, leave);
    silhouette(ox, 1180, .9, { type: 'cat', eyes: false, rim: .4 * (1 - day * .5), col: '#1a1620', bob: leave ? -Math.abs(Math.sin(t * 7)) * 8 : 0 });
    if (close < 1) umbrella(ox + 60, 960, 1, 1 - close);
    else umbrella(600, 860, .9, 0, '#7d1f2a', -.12);
    if (day < .9) drawRain(t, 720, 1280, 1, 1 - day);
    if (close < .5) for (let i = 0; i < 10; i++) { const p = (t * 1.6 + hash(i)) % 1; ell(ox + 60 + (hash(i + 2) - .5) * 400, 620 + p * 40, 3, 3, `rgba(230,220,200,${(1 - p) * .6})`, null); }
  } else {
    // unutulan şemsiye: günler geçer, gölge döner, toz ve yapraklar
    const d = (k * 4) % 1, sh = (d - .5) * 2;
    c.save(); c.globalAlpha = .4; c.beginPath(); c.moveTo(600, 860); c.lineTo(600 + sh * 260, 880); c.lineTo(600 + sh * 270, 868); c.closePath(); c.fillStyle = '#000'; c.fill(); c.restore();
    umbrella(600, 860, .9, 0, '#7d1f2a', -.12 - k * .05);
    for (let i = 0; i < 8; i++) { const p = (k * 2 + hash(i)) % 1, lx = lerp(-60, 780, p), ly = 700 + Math.sin(p * 9 + i) * 60 + p * 150; c.save(); c.translate(lx, ly); c.rotate(p * 8 + i); ell(0, 0, 12, 6, ['#b5652a', '#d9a441', '#8a3a1e'][i % 3], OL, 2); c.restore(); }
    c.save(); c.globalAlpha = ss(.5, 1, k) * .5; for (let i = 0; i < 4; i++) line(600, 560, 600 + Math.cos(i * .4 - .2) * 90, 560 + Math.sin(i * .4 - .2) * 90, '#e8e2d6', 1.2); c.restore();
    dustMotes(t, 30, 450, 500, 300, 400, .4 * ss(.3, 1, k));
  }
  drawSplashes(t * (1 - day));
};

// ---------- TERS ÇEVRİLEN TELEFON ----------
SCENES.ters = S => {
  const t = S.t, k = S.k, flip = ease(cl((k - .3) / .3, 0, 1)), buzz = k > .7 ? Math.sin(t * 60) * 3 * (Math.sin(t * 3) > 0 ? 1 : 0) : 0;
  cam(360, 700, 1.15 + .1 * k);
  c.fillStyle = '#0b0807'; c.fillRect(-300, -300, 1320, 1900);
  // ıslak bank tahtaları
  for (let i = 0; i < 5; i++) { rr(-300, 760 + i * 70, 1320, 58, 8, lg(0, 760 + i * 70, 0, 818 + i * 70, [[0, '#5a3a24'], [1, '#3a2416']]), OL, 5); for (let j = 0; j < 8; j++) ell(hash(i * 9 + j) * 720, 780 + i * 70 + hash(j) * 30, 8, 3, 'rgba(255,220,170,.15)', null); }
  drawRain(t, 720, 1280, 0, .6);
  const px = 360 + buzz, py = lerp(560, 860, ease(cl(k / .35, 0, 1))), sy = Math.cos(flip * PI);
  c.save(); c.translate(px, py); c.rotate(-.08); c.scale(1, Math.max(.06, Math.abs(sy)) * .62);
  if (sy > 0) { rr(-140, -280, 280, 560, 40, '#0b0c0e', OL, 6); rr(-128, -268, 256, 536, 32, UI.bg, null);
    c.fillStyle = UI.them; rr(-110, -150, 200, 60, 16, UI.them, null); c.fillStyle = UI.text; c.font = `500 22px Inter,Arial,${EMOJI}`; c.fillText('Deniz: Müsait misin? 🙂', -98, -112);
    addLight(0, 0, 420, `rgba(160,200,255,${.35 * sy})`); }
  else { rr(-140, -280, 280, 560, 40, '#7d1f2a', OL, 6); ell(-80, -210, 30, 30, '#1c1e22', OL, 4); ell(-80, -150, 22, 22, '#1c1e22', OL, 4);
    c.save(); c.font = '900 120px Georgia,serif'; c.textAlign = 'center'; c.fillStyle = '#e8bf5c'; c.fillText('D', 10, 90); c.restore(); }
  c.restore();
  if (k > .7) { c.save(); c.globalAlpha = .6 * (Math.sin(t * 3) > 0 ? 1 : 0); for (const s of [-1, 1]) for (let i = 0; i < 3; i++) curve([px + s * (190 + i * 22), py - 40, px + s * (200 + i * 22), py, px + s * (190 + i * 22), py + 40], 'rgba(200,220,255,.6)', 4); c.restore(); }
  // Demir'in patisi telefonu bırakıp çekiliyor
  const pawY = lerp(py - 60, 1300, ss(.6, .85, k));
  ell(px + 150, pawY, 80, 64, WOLF_C.paw, OL, 6); capsule([px + 260, pawY + 500, px + 200, pawY + 40], 120, WOLF_C.sleeve, 7);
};

// ---------- ŞAFAĞA YÜRÜYÜŞ ----------
function drawWolfBack(p) { // arkadan Demir: sırtında "DEMİR" yazılı kolej ceketi
  const t = p.t, walk = p.walk || 0;
  ell(0, 0, 175, 20, 'rgba(0,0,0,.4)', null);
  for (const s of [-1, 1]) { const sw = Math.sin(t * 7 + (s > 0 ? PI : 0)) * 16 * walk; poly([s * 20, -292, s * 90, -292, s * 84 + sw, -50, s * 28 + sw, -50], WOLF_C.jeans, OL, 6); blob([s * 20 + sw, -56, s * 92 + sw, -58, s * 100 + sw, -10, s * 20 + sw, -4], '#d9772b', OL, 6); }
  capsule([-126, -548, -150, -300], 58, WOLF_C.sleeve, 6); capsule([126, -548, 150 + Math.sin(t * 7) * 10 * walk, -300], 58, WOLF_C.sleeve, 6);
  const J = [-56, -592, -128, -566, -150, -520, -140, -400, -128, -300, -134, -262, 0, -258, 134, -262, 128, -300, 140, -400, 150, -520, 128, -566, 56, -592];
  c.beginPath(); smoothPath(J); c.fillStyle = lg(-150, 0, 150, 0, [[0, '#5a1520'], [.3, WOLF_C.jacket], [.7, WOLF_C.jacket], [1, '#5a1520']]); c.fill(); c.lineWidth = 6; c.strokeStyle = OL; c.stroke();
  c.save(); c.font = '900 50px Georgia,serif'; c.textAlign = 'center'; c.lineWidth = 8; c.strokeStyle = OL; c.strokeText('DEMİR', 0, -440); c.fillStyle = '#e8bf5c'; c.fillText('DEMİR', 0, -440); c.restore();
  c.save(); c.translate(100, -290); c.rotate(Math.sin(t * 3) * .1); blob([0, -10, 80, 10, 135, 90, 125, 190, 95, 236, 92, 160, 60, 90, -10, 40], lg(0, 0, 120, 230, [[0, WOLF_C.furD], [1, '#eef0f2']]), OL, 6); c.restore();
  c.beginPath(); smoothPath([-108, -612, 0, -630, 108, -612, 114, -566, 0, -548, -114, -566]); c.fillStyle = WOLF_C.scarf; c.fill(); texFill('knit', 1); c.lineWidth = 6; c.strokeStyle = OL; c.stroke();
  c.save(); c.translate(0, -728); c.rotate(p.tilt || 0);
  for (const s of [-1, 1]) blob([s * 46, -112, s * 112, -246, s * 168, -326, s * 206, -180, s * 196, -52], WOLF_C.furD, OL, 6, .7);
  c.beginPath(); smoothPath([0, -168, 112, -152, 176, -92, 196, 0, 210, 70, 150, 124, 0, 160, -150, 124, -210, 70, -196, 0, -176, -92, -112, -152], true, .85);
  c.fillStyle = rg(0, -60, 20, 240, [[0, '#a8b1bb'], [1, WOLF_C.furD]]); c.fill(); texFill('fur', 1); c.lineWidth = 6; c.strokeStyle = OL; c.stroke();
  for (const s of [-1, 1]) line(s * 196, -40, s * 150, -30, '#1f1c1a', 6); // gözlük sapları
  c.restore();
}
SCENES.yuruyus = S => {
  const t = S.t, k = S.k, dawn = ss(0, .8, k);
  cam(360, 700, 1.05 + .06 * k);
  c.fillStyle = lg(0, -300, 0, 900, [[0, `rgb(${lerp(20, 70, dawn) | 0},${lerp(22, 60, dawn) | 0},${lerp(40, 90, dawn) | 0})`], [.7, `rgb(${lerp(60, 240, dawn) | 0},${lerp(40, 150, dawn) | 0},${lerp(30, 90, dawn) | 0})`], [1, `rgb(${lerp(70, 255, dawn) | 0},${lerp(50, 200, dawn) | 0},${lerp(30, 120, dawn) | 0})`]]); c.fillRect(-300, -300, 1320, 1300);
  ell(360, 820 - dawn * 160, 90, 90, `rgba(255,230,160,${dawn})`, null); addLight(360, 820 - dawn * 160, 700, `rgba(255,190,110,${.55 * dawn})`);
  // perspektif sokak: iki yanda bina silüetleri
  for (const s of [-1, 1]) for (let i = 0; i < 6; i++) { const d = i / 6, x = 360 + s * lerp(420, 60, d), w = lerp(260, 40, d), h = lerp(700, 120, d); rr(s < 0 ? x - w : x, 860 - h, w, h, 2, `rgb(${lerp(18, 60, d) | 0},${lerp(12, 40, d) | 0},${lerp(10, 34, d) | 0})`, null);
    for (let j = 0; j < 4; j++) if (hash(i * 7 + j + (s > 0 ? 50 : 0)) > .5) rr((s < 0 ? x - w : x) + w * .2, 860 - h + h * (.15 + j * .2), w * .25, h * .08, 2, `rgba(255,190,100,${.5 * (1 - dawn * .7)})`, null); }
  c.beginPath(); c.moveTo(-300, 1600); c.lineTo(330, 860); c.lineTo(390, 860); c.lineTo(1020, 1600); c.closePath(); c.fillStyle = lg(0, 860, 0, 1300, [[0, '#4a3a30'], [1, '#1c1510']]); c.fill();
  c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = lg(0, 860, 0, 1300, [[0, `rgba(255,190,110,${.45 * dawn})`], [1, 'rgba(255,190,110,0)']]); c.beginPath(); c.moveTo(330, 860); c.lineTo(390, 860); c.lineTo(520, 1300); c.lineTo(200, 1300); c.closePath(); c.fill(); c.restore();
  // Demir uzaklaşıyor (arkadan), elinde kapalı şemsiye
  const d = ease(k), sc = lerp(.5, .18, d), y = lerp(1180, 900, d);
  c.save(); c.translate(360 + Math.sin(t * 3.5) * 4 * (1 - d), y); c.scale(sc, sc); drawWolfBack({ t, walk: 1, tilt: Math.sin(t * 3.5) * .02 }); umbrella(170, -300, .9, 0); c.restore();
  // önde ıslak bank + yüzü açık telefon: bildirim
  rr(-300, 1130, 1320, 46, 8, '#4a3020', OL, 5); rr(-300, 1182, 1320, 46, 8, '#3a2416', OL, 5);
  const nb = ss(.25, .32, k);
  c.save(); c.translate(150, 1110); c.rotate(-.12); rr(-70, -40, 140, 70, 14, '#0b0c0e', OL, 4); rr(-62, -34, 124, 58, 10, nb > 0 ? '#1d2836' : '#0f1318', null); c.restore();
  if (nb > 0) { c.save(); c.globalAlpha = nb; c.translate(230, 960); rr(-150, -40, 300, 80, 20, 'rgba(25,30,38,.92)', 'rgba(255,255,255,.2)', 2); c.fillStyle = '#eef2f5'; c.font = `700 22px Inter,Arial,${EMOJI}`; c.fillText('Deniz', -130, -8); c.font = `500 20px Inter,Arial,${EMOJI}`; c.fillStyle = '#c9d2db'; c.fillText('Müsait misin? 🙂', -130, 22); c.restore(); addLight(150, 1100, 200, `rgba(160,200,255,${.4 * nb})`); }
  if (dawn < .7) drawRain(t, 720, 1280, 0, .5 * (1 - dawn));
};

// kapanış defterine bölüm çizimi: şemsiye
function umbrellaSketch(k, x, y, s = 1) {
  c.save(); c.translate(x, y); c.scale(s, s); c.strokeStyle = '#3a2410'; c.lineWidth = 4; c.lineCap = 'round';
  const seg = (a, b, pts) => { const kk = cl((k - a) / (b - a), 0, 1); if (kk <= 0) return; c.beginPath(); c.moveTo(pts[0], pts[1]); const n = pts.length / 2 - 1, m = kk * n; for (let i = 1; i <= Math.ceil(m); i++) { const f = Math.min(1, m - (i - 1)); c.lineTo(lerp(pts[i * 2 - 2], pts[i * 2], f), lerp(pts[i * 2 - 1], pts[i * 2 + 1], f)); } c.stroke(); };
  seg(0, .35, [-90, 0, -70, -40, -30, -66, 0, -72, 30, -66, 70, -40, 90, 0]);                  // kubbe
  seg(.3, .55, [-90, 0, -60, -10, -30, 0, 0, -10, 30, 0, 60, -10, 90, 0]);                      // etek
  seg(.5, .75, [0, -72, 0, 70]); seg(.7, .85, [0, 70, -4, 84, -16, 86, -24, 76]);                // sap
  seg(.8, 1, [-40, 104, 40, 104]);                                                             // yer
  c.restore();
}
