// Animasyon motoru: zaman çizelgesi, kamera, poz, altyazı, ışık, giriş/kapanış.
// Bölüm sayfası önce window.EPISODE'u tanımlar (story.js), sonra bu dosyayı yükler.
(function () {
  const EP = window.EPISODE || EPISODE, STORY = EP.story;
  const cv = document.getElementById('c'), main = cv.getContext('2d');
  const CW = cv.width, CH = cv.height, W = 720, H = 1280, BASE = CW / W;
  const layer = document.createElement('canvas'); layer.width = CW; layer.height = CH; const lc = layer.getContext('2d');
  const cap = location.search.includes('capture=1'); if (cap) document.body.classList.add('cap');
  const INTRO = EP.intro ?? 3.2, OUTRO = 6.0;
  c = main; initTextures();
  for (const g of [main, lc]) { g.lineJoin = 'round'; g.lineCap = 'round'; }

  // ---------- zaman çizelgesi ----------
  // timeline.js (generate_voices.js ile seslendirme) varsa onu kullan; yoksa okuma hızına göre tahmin et.
  function estimate() {
    let t = INTRO; const lines = [];
    for (const l of STORY) {
      const s = t, words = [];
      for (const w of l.text.split(/\s+/)) { const d = .26 + w.length * .052 + (/[.,?!…;:]$/.test(w) ? .3 : 0); words.push([w, t, t + d - (/[.,?!…]$/.test(w) ? .22 : .04)]); t += d; }
      lines.push({ ...l, start: s, end: t }); lines[lines.length - 1].words = words; t += l.pause ?? .7;
    }
    return { lines };
  }
  const TL = window.TIMELINE ? { lines: window.TIMELINE.lines.map((l, i) => ({ ...STORY[i], ...l })) } : estimate();
  const L = TL.lines, LAST = L[L.length - 1].end, OUT0 = LAST + 1.4, DUR = OUT0 + OUTRO;
  window.DURATION = DUR;

  // ---------- altyazı parçaları (en fazla ~20 harf) ----------
  const SUBS = [];
  for (const l of L) {
    let cur = null;
    for (const w of l.words) {
      const txt = w[0].toLocaleUpperCase('tr');
      if (cur && (cur.text + ' ' + txt).length <= 20 && !/[.?!…]$/.test(cur.words[cur.words.length - 1][0])) { cur.text += ' ' + txt; cur.words.push([txt, w[1], w[2]]); cur.e = w[2]; }
      else { cur = { text: txt, words: [[txt, w[1], w[2]]], s: w[1], e: w[2], line: l }; SUBS.push(cur); }
    }
  }
  SUBS.forEach((u, i) => { const n = SUBS[i + 1]; u.e = n && n.line === u.line ? n.s : u.e + .5; if (n) u.e = Math.min(u.e, n.s); });

  // ---------- yardımcılar ----------
  const lineAt = t => { let a = -1; for (let i = 0; i < L.length; i++) if (L[i].start <= t) a = i; return a; };
  const vowels = w => Math.max(1, (w.match(/[aeıioöuüâîûAEIİOÖUÜ]/g) || []).length);
  function talkOf(who, t) {
    for (const l of L) if (l.who === who && t >= l.start - .05 && t <= l.end + .1)
      for (const w of l.words) if (t >= w[1] && t < w[2]) { const ph = (t - w[1]) / (w[2] - w[1]); return .15 + .85 * Math.abs(Math.sin(ph * PI * vowels(w[0]))); }
    return 0;
  }
  const DEF_G = { kazim: { stern: 'point', warm: 'open', calm: 'rest', sad: 'rest', surprised: 'open' }, demir: { worry: 'clasp', sad: 'clasp', hope: 'chest', calm: 'rest', happy: 'open', surprised: 'open' } };
  const GEST = {
    kazim: { rest: { x: 186, y: -300, hand: 'relax' }, point: { x: 262, y: -760, hand: 'point' }, open: { x: 285, y: -575, hand: 'palm' }, shoulder: { x: 322, y: -548, hand: 'palm' } },
    demir: {
      rest: [{ x: -148, y: -272, hand: 'relax' }, { x: 148, y: -272, hand: 'relax' }],
      clasp: [{ x: -24, y: -448, hand: 'relax' }, { x: 24, y: -442, hand: 'relax' }],
      open: [{ x: -205, y: -385, hand: 'open' }, { x: 205, y: -385, hand: 'open' }],
      chin: [{ x: -24, y: -448, hand: 'relax' }, { x: 60, y: -600, hand: 'relax' }],
      chest: [{ x: -148, y: -272, hand: 'relax' }, { x: 34, y: -492, hand: 'relax' }],
    },
  };
  // Bir karakterin zaman içindeki "durum" değişimleri (ruh hali + jest), yumuşak geçişle
  function stateAt(who, t, key, def) {
    let prev = def, cur = def, t0 = -9;
    for (const l of L) if (l.who === who && l.start <= t) { const v = key(l); if (v !== cur) { prev = cur; cur = v; t0 = l.start; } }
    return { prev, cur, k: ease((t - t0) / .55) };
  }
  const mix = (a, b, k) => { const o = {}; for (const n of new Set([...Object.keys(a), ...Object.keys(b)])) o[n] = lerp(a[n] || 0, b[n] || 0, k); return o; };
  const mixT = (a, b, k) => ({ x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), hand: k < .5 ? a.hand : b.hand });
  // Jest: satır başında başlar; Kâzım satırı bitince (sıradaki satırı kendisinin değilse) elini indirir
  function gestureAt(who, t) {
    const ev = [];
    L.forEach((l, i) => {
      ev.push([l.start, l.gesture || DEF_G[who === l.who ? who : who][l.mood] || 'rest', l.who === who]);
      const n = L[i + 1];
      if (who === 'kazim' && l.who === who && (!n || n.who !== who)) ev.push([l.end + .6, 'rest', true]);
    });
    let prev = 'rest', cur = 'rest', t0 = -9;
    for (const [et, g, own] of ev) if (own && et <= t && g !== cur) { prev = cur; cur = g; t0 = et; }
    return { prev, cur, k: ease((t - t0) / .6) };
  }
  function blink(t, seed) { const per = 2.6 + hash(seed) * 1.6, ph = (t + seed) % per; return ph < .16 ? Math.sin(ph / .16 * PI) : 0; }
  function lanternState(t) {
    let up = 0, lev = 1;
    for (const l of L) {
      if (l.raise !== undefined) up = lerp(up, l.raise ? 1 : 0, ease((t - l.start) / .9));
      if (l.light === 'dim') lev = lerp(lev, .07, ss(l.start + (l.end - l.start) * .35, l.end, t));
      if (l.light === 'bright') lev = lerp(lev, 1, ss(l.start, l.start + 1.2, t));
    }
    return { up, lev };
  }

  function pose(who, t) {
    const first = L.find(l => l.who === who), m0 = first ? first.mood : 'calm';
    const ms = stateAt(who, t, l => l.mood, m0), md = MOODS[who];
    const p = mix(md[ms.prev] || md[m0], md[ms.cur] || md[m0], ms.k);
    p.t = t; p.talk = talkOf(who, t);
    const ai = lineAt(t), speaking = ai >= 0 && L[ai].who === who && t < L[ai].end + .3;
    const dir = who === 'kazim' ? 1 : -1;
    p.lookX = dir * (speaking ? .25 : .55) + noise1(t * .7 + (dir > 0 ? 0 : 40)) * .18;
    p.lookY = (p.lookY || 0) + noise1(t * .5 + 9) * .1;
    p.blink = blink(t, who === 'kazim' ? 1.3 : 3.7);
    p.tilt = Math.sin(t * .9 + dir) * .025 + (speaking ? noise1(t * 1.3) * .03 : dir * .03);
    // dinlerken arada bir onaylama başı sallama
    p.nod = 0; for (const l of L) if (l.who !== who && t > l.end && t < l.end + .7 && l.nod !== false) p.nod = Math.sin((t - l.end) / .7 * PI) * .6;
    const gs = gestureAt(who, t);
    if (who === 'kazim') {
      p.R = mixT(GEST.kazim[gs.prev], GEST.kazim[gs.cur], gs.k);
      const ls = lanternState(t);
      p.L = mixT({ x: -215, y: -310, hand: 'fist' }, { x: -258, y: -730, hand: 'fist' }, ls.up); p.L.hand = 'fist';
      p.lantern = ls.lev;
    } else {
      const a = GEST.demir[gs.prev], b = GEST.demir[gs.cur];
      p.L = mixT(a[0], b[0], gs.k); p.R = mixT(a[1], b[1], gs.k);
    }
    // nefes ve küçük el hareketleri
    for (const arm of [p.L, p.R]) { arm.x += noise1(t * .8 + arm.x) * 4; arm.y += noise1(t * .8 + arm.y) * 4; }
    if (speaking && who === 'kazim' && p.R.hand === 'point') p.R.y += Math.sin(t * 5) * 6 * p.talk;
    return p;
  }

  // ---------- kamera ----------
  const CAST = EP.cast; // { kazim:{x,y,s}, demir:{x,y,s} }
  function shotOf(i) { const l = L[i]; return l.shot || 'close-' + l.who; }
  function camFor(shot, t, t0, P) {
    const k = CAST.kazim, d = CAST.demir;
    let cx = 360, cy = 640, z = 1;
    if (shot === 'wide') { cx = 360; cy = 640; z = 1; }
    else if (shot === 'two') { cx = (k.x + d.x) / 2 + 5; cy = 700; z = 1.3; }
    else if (shot === 'close-kazim') { cx = k.x + 45; cy = k.y - k.s * 700; z = 2.35; }
    else if (shot === 'close-demir') { cx = d.x - 10; cy = d.y - d.s * 610; z = 2.55; }
    else if (shot === 'lantern') { const lp = owlLanternPos(P.kazim); cx = k.x + lp[0] * k.s + 55; cy = k.y + lp[1] * k.s - 45; z = 2.8; }
    z *= 1 + .05 * ss(0, 6, t - t0);
    cx += noise1(t * .35) * 5; cy += noise1(t * .35 + 20) * 4;
    return { cx, cy, z };
  }

  // ---------- karakteri katmanda çizip ışıkla gölgelendir ----------
  function drawChar(who, P, camM) {
    const k = CAST[who];
    lc.setTransform(1, 0, 0, 1, 0, 0); lc.clearRect(0, 0, CW, CH);
    c = lc; lc.setTransform(camM); lc.translate(k.x, k.y); lc.scale(k.s, k.s);
    if (who === 'kazim') drawOwl(P); else drawWolf(P);
    // ışık: sağ üstte sokak lambası (sıcak), karşı taraf ve alt kısım gölgede
    lc.setTransform(camM); lc.globalCompositeOperation = 'source-atop';
    lc.fillStyle = lg(k.x + 160, k.y - 640, k.x - 200, k.y - 150, [[0, 'rgba(255,190,110,.20)'], [.5, 'rgba(0,0,0,0)'], [1, 'rgba(10,5,2,.42)']]);
    lc.fillRect(-500, -500, 1720, 2300);
    lc.fillStyle = lg(0, k.y - 260 * k.s, 0, k.y, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(8,4,2,.45)']]); lc.fillRect(-500, -500, 1720, 2300);
    if (who === 'kazim') { // fenerin sıcak dolgusu
      const lp = owlLanternPos(P), lx = k.x + lp[0] * k.s, ly = k.y + lp[1] * k.s;
      lc.fillStyle = rg(lx, ly, 0, 300 * k.s, [[0, `rgba(255,160,60,${.32 * P.lantern})`], [1, 'rgba(0,0,0,0)']]); lc.fillRect(-500, -500, 1720, 2300);
    }
    lc.globalCompositeOperation = 'source-over';
    c = main; main.setTransform(1, 0, 0, 1, 0, 0); main.drawImage(layer, 0, 0);
  }

  // ---------- metin ----------
  function subtitle(t) {
    const u = SUBS.find(s => t >= s.s - .05 && t < s.e); if (!u) return;
    let fz = 50; const font = z => `italic 900 ${z}px Inter,'Inter Display',Arial,sans-serif`;
    c.font = font(fz); while (c.measureText(u.text).width > 600) { fz -= 2; c.font = font(fz); }
    const pop = 1 + .14 * (1 - ss(0, .12, t - u.s)), y = 1050;
    c.save(); c.translate(W / 2, y); c.scale(pop, pop); c.textAlign = 'left'; c.textBaseline = 'middle';
    const sp = c.measureText(' ').width, ws = u.words.map(w => c.measureText(w[0]).width), tot = ws.reduce((a, b) => a + b, 0) + sp * (ws.length - 1);
    let xx = -tot / 2;
    u.words.forEach((w, i) => {
      const on = t >= w[1] - .03;
      c.lineWidth = 10; c.strokeStyle = 'rgba(0,0,0,.95)'; c.shadowColor = 'rgba(0,0,0,.8)'; c.shadowBlur = 14; c.shadowOffsetY = 4; c.strokeText(w[0], xx, 0);
      c.shadowColor = 'transparent'; c.fillStyle = on ? (t < w[2] + .05 && u.line.who === 'kazim' ? '#f4c358' : '#ffffff') : 'rgba(255,255,255,.55)'; c.fillText(w[0], xx, 0);
      xx += ws[i] + sp;
    });
    c.restore();
  }
  function spaced(txt, x, y, font, col, sp, a = 1, glowC) {
    c.save(); c.globalAlpha = a; c.font = font; c.textAlign = 'center'; c.letterSpacing = sp + 'px'; c.fillStyle = col;
    if (glowC) { c.shadowColor = glowC; c.shadowBlur = 24; }
    c.fillText(txt, x + sp / 2, y); c.restore();
  }

  // ---------- kare çizimi ----------
  let grainIdx = 0;
  function render(t) {
    t = cl(t, 0, DUR); LIGHTS = [];
    c = main; main.setTransform(1, 0, 0, 1, 0, 0); main.globalCompositeOperation = 'source-over'; main.globalAlpha = 1;
    main.fillStyle = '#000'; main.fillRect(0, 0, CW, CH);
    const ai = lineAt(t), shot = ai < 0 ? 'wide' : (t > LAST + .5 ? 'wide' : shotOf(ai));
    let t0 = 0; if (ai >= 0) { t0 = L[ai].start; for (let i = ai; i > 0 && shotOf(i - 1) === shotOf(i); i--) t0 = L[i - 1].start; }
    if (t > LAST + .5) t0 = LAST + .5;
    const P = { kazim: pose('kazim', t), demir: pose('demir', t) };
    const cam = camFor(shot, t, t0, P);
    const camM = new DOMMatrix().scale(BASE).translate(W / 2, H / 2).scale(cam.z).translate(-cam.cx, -cam.cy);
    main.setTransform(camM);
    drawStreet(t, { lamp: 1 });
    main.setTransform(1, 0, 0, 1, 0, 0); main.setTransform(BASE, 0, 0, BASE, 0, 0); drawRain(t, W, H, 0, .8);
    for (const who of ['demir', 'kazim']) drawChar(who, P[who], camM);
    main.setTransform(camM); drawSplashes(t);
    // ışık hâleleri (toplamalı)
    main.setTransform(1, 0, 0, 1, 0, 0);
    for (const g of LIGHTS) { main.save(); main.globalCompositeOperation = 'lighter'; main.fillStyle = rg(g.x, g.y, 0, g.r, [[0, g.col], [1, 'rgba(0,0,0,0)']]); main.fillRect(g.x - g.r, g.y - g.r, g.r * 2, g.r * 2); main.restore(); }
    main.setTransform(BASE, 0, 0, BASE, 0, 0);
    drawRain(t, W, H, 1, shot.startsWith('close') || shot === 'lantern' ? .7 : 1);
    // renk tonu + vinyet
    main.save(); main.globalCompositeOperation = 'soft-light'; main.fillStyle = 'rgba(255,150,60,.25)'; main.fillRect(0, 0, W, H); main.restore();
    main.fillStyle = rg(W / 2, H * .46, W * .32, H * .72, [[0, 'rgba(0,0,0,0)'], [.7, 'rgba(6,3,1,.45)'], [1, 'rgba(3,2,1,.9)']]); main.fillRect(0, 0, W, H);
    main.fillStyle = lg(0, 900, 0, H, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,.55)']]); main.fillRect(0, 900, W, H - 900);
    // giriş başlığı
    if (t < INTRO) {
      const a = 1 - ss(INTRO - .7, INTRO - .1, t);
      main.fillStyle = `rgba(0,0,0,${.55 * a})`; main.fillRect(0, 0, W, H);
      spaced(EP.number ? 'BÖLÜM ' + EP.number : '', W / 2, 560, "600 24px Cinzel,Georgia,serif", '#d9b26a', 10, a * ss(.3, .9, t));
      spaced(EP.title.toLocaleUpperCase('tr'), W / 2, 640, "700 54px Cinzel,Georgia,serif", '#f4d79a', 6, a * ss(.5, 1.2, t), 'rgba(255,170,60,.7)');
      main.fillStyle = `rgba(217,178,106,${a * ss(.8, 1.4, t)})`; main.fillRect(W / 2 - 90 * ss(.8, 1.6, t), 672, 180 * ss(.8, 1.6, t), 2);
    }
    // altyazı + filigran
    if (t < OUT0) subtitle(t);
    spaced('BAYKUŞ KAZIM', W / 2, 70, "600 19px Cinzel,Georgia,serif", 'rgba(232,212,176,.85)', 7, 1 - ss(OUT0, OUT0 + .6, t));
    // kapanış: karanlıkta parlayan gözler
    if (t > OUT0) {
      const k = t - OUT0, a = ss(0, .8, k);
      main.fillStyle = `rgba(4,2,1,${a})`; main.fillRect(0, 0, W, H);
      const ea = ss(1, 1.8, k), bl = (k > 3.2 && k < 3.4) ? .1 : 1;
      main.save(); main.globalAlpha = ea; main.shadowColor = '#f59e0b'; main.shadowBlur = 50;
      for (const s of [-1, 1]) { ell(W / 2 + s * 66, 560, 44, 44 * bl, rg(W / 2 + s * 66, 560, 2, 44, [[0, '#ffe58a'], [1, '#e07a10']]), null); ell(W / 2 + s * 66, 562, 17, 18 * bl, '#120a06', null); }
      main.restore();
      main.save(); main.globalAlpha = ea; main.fillStyle = '#120a06';
      for (const s of [-1, 1]) { main.beginPath(); main.moveTo(W / 2 + s * 18, 510 - 6); main.lineTo(W / 2 + s * 118, 500 - 18); main.lineTo(W / 2 + s * 118, 520); main.lineTo(W / 2 + s * 22, 524); main.fill(); }
      main.restore();
      spaced('BAYKUŞ KAZIM', W / 2, 700, "700 44px Cinzel,Georgia,serif", '#e9c27a', 10, ss(2, 2.8, k), 'rgba(255,170,60,.6)');
      spaced('İZLE, ÖĞREN, BEĞEN, TAKİP ET', W / 2, 1050, "italic 900 38px Inter,Arial,sans-serif", '#ffffff', 1, ss(2.6, 3.2, k));
      spaced('@baykus.kazim', W / 2, 1100, "600 24px Inter,Arial,sans-serif", 'rgba(233,194,122,.9)', 2, ss(3, 3.6, k));
      main.fillStyle = `rgba(0,0,0,${ss(OUTRO - .6, OUTRO, k)})`; main.fillRect(0, 0, W, H);
    }
    if (t < .8) { main.fillStyle = `rgba(0,0,0,${1 - ss(0, .8, t)})`; main.fillRect(0, 0, W, H); }
    // film greni
    main.setTransform(1, 0, 0, 1, 0, 0); main.save(); main.globalCompositeOperation = 'overlay'; main.globalAlpha = .07;
    const gp = main.createPattern(TEX.grain[Math.floor(t * 24) % 4], 'repeat'); gp.setTransform(new DOMMatrix().translate(hash(Math.floor(t * 24)) * 256, hash(Math.floor(t * 24) + 1) * 256));
    main.fillStyle = gp; main.fillRect(0, 0, CW, CH); main.restore();
  }

  window.seekTo = t => { render(t); return true; };
  window.EP_INFO = { duration: DUR, lines: L.map(l => ({ who: l.who, start: l.start, end: l.end, text: l.text })) };
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => { render(0); window.READY = true; });
  if (!cap) {
    let now = 0, play = true, last = null; const pp = document.getElementById('pp'), sl = document.getElementById('sl'), tm = document.getElementById('tm'); sl.max = DUR;
    pp.onclick = () => { play = !play; pp.textContent = play ? 'Duraklat' : 'Oynat'; };
    sl.oninput = () => { now = +sl.value; render(now); };
    (function loop(ts) { if (play) { if (last != null) now = (now + (ts - last) / 1000) % DUR; render(now); sl.value = now; tm.textContent = now.toFixed(1) + 's'; } last = ts; requestAnimationFrame(loop); })();
  }
})();
