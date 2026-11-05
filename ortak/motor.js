// Animasyon motoru: zaman çizelgesi, plan listesi (diyalog + ara sahneler), geçişler, poz, altyazı, ışık, kapanış.
// Bölüm sayfası önce EPISODE'u tanımlar (story.js), varsa timeline.js (ses zamanlaması), sonra bu dosyayı yükler.
(function () {
  const EP = window.EPISODE || EPISODE, STORY = EP.story;
  const cv = document.getElementById('c'), main = cv.getContext('2d');
  const CW = cv.width, CH = cv.height, W = 720, H = 1280, BASE = CW / W;
  const mk = () => { const e = document.createElement('canvas'); e.width = CW; e.height = CH; const g = e.getContext('2d'); g.lineJoin = 'round'; g.lineCap = 'round'; return [e, g]; };
  const [layer, lc] = mk(), [bufA, ca] = mk(), [bufB, cb] = mk();
  const cap = location.search.includes('capture=1'); if (cap) document.body.classList.add('cap');
  const INTRO = EP.intro ?? .5, TAIL = EP.tail ?? 3.8, TR = .4;
  c = main; initTextures(); main.lineJoin = 'round'; main.lineCap = 'round';

  // ---------- zaman çizelgesi ----------
  function estimate() {
    let t = INTRO; const lines = [];
    for (const l of STORY) {
      const s = t, words = [];
      for (const w of l.text.split(/\s+/)) { const d = .26 + w.length * .056 + (/[.,?!…;:]$/.test(w) ? .32 : 0); words.push([w, t, t + d - (/[.,?!…]$/.test(w) ? .24 : .04)]); t += d; }
      lines.push({ ...l, start: s, end: t, words }); t += l.pause ?? .65;
    }
    return { lines };
  }
  const TL = window.TIMELINE ? { lines: window.TIMELINE.lines.map((l, i) => ({ ...STORY[i], ...l })) } : estimate();
  const L = TL.lines, LAST = L[L.length - 1].end, DUR = LAST + TAIL;
  window.DURATION = DUR;

  // ---------- plan listesi ----------
  const DIALOG = new Set(['wide', 'two', 'close-kazim', 'close-demir', 'lantern']);
  const SHOTS = [];
  L.forEach((l, i) => {
    const list = Array.isArray(l.shot) ? l.shot : [[l.shot || 'close-' + l.who, 0, l.phase]];
    list.forEach(([name, f, phase], j) => {
      const s = i === 0 && j === 0 && !EP.openShot ? 0 : l.start + (l.end - l.start) * (f || 0);
      SHOTS.push({ name, phase: phase ?? l.phase, start: s, line: l, flash: l.flash });
    });
  });
  if (EP.openShot) SHOTS.unshift({ name: EP.openShot, phase: EP.openPhase, start: 0, line: L[0], flash: EP.openFlash });
  SHOTS.forEach((s, i) => { s.end = SHOTS[i + 1] ? SHOTS[i + 1].start : DUR; });
  SHOTS.forEach((s, i) => { // aynı sahne art arda: tek sahne gibi akar
    const p = SHOTS[i - 1]; s.sceneStart = p && p.name === s.name ? p.sceneStart : s.start;
    s.fade = !!p && p.name !== s.name && !(DIALOG.has(p.name) && DIALOG.has(s.name));
  });
  const shotAt = t => { let r = SHOTS[0]; for (const s of SHOTS) if (s.start <= t) r = s; return r; };

  // ---------- altyazı parçaları ----------
  const SUBS = [];
  for (const l of L) {
    if (l.noSub) continue; let cur = null;
    for (const w of l.words) {
      const txt = w[0].toLocaleUpperCase('tr');
      if (cur && (cur.text + ' ' + txt).length <= 20 && !/[.?!…;]$/.test(cur.words[cur.words.length - 1][0])) { cur.text += ' ' + txt; cur.words.push([txt, w[1], w[2]]); cur.e = w[2]; }
      else { cur = { text: txt, words: [[txt, w[1], w[2]]], s: w[1], e: w[2], line: l }; SUBS.push(cur); }
    }
  }
  SUBS.forEach((u, i) => { const n = SUBS[i + 1]; u.e = n && n.line === u.line ? n.s : u.e + .45; if (n) u.e = Math.min(u.e, n.s); });

  // ---------- konuşma / poz ----------
  const lineAt = t => { let a = -1; for (let i = 0; i < L.length; i++) if (L[i].start <= t) a = i; return a; };
  const vowels = w => Math.max(1, (w.match(/[aeıioöuüâîûAEIİOÖUÜ]/g) || []).length);
  function talkOf(who, t) {
    for (const l of L) if (l.who === who && t >= l.start - .05 && t <= l.end + .1) {
      if (l.env) { const f = (t - l.start) * (l.envRate || 50), i = Math.floor(f); if (i < 0 || i >= l.env.length - 1) return 0; return cl(lerp(l.env[i], l.env[i + 1], f - i) * 1.25, 0, 1); }
      for (const w of l.words) if (t >= w[1] && t < w[2]) { const ph = (t - w[1]) / (w[2] - w[1]); return .15 + .85 * Math.abs(Math.sin(ph * PI * vowels(w[0]))); }
    }
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
  function stateAt(who, t, key, def) {
    let prev = def, cur = def, t0 = -9;
    for (const l of L) if (l.who === who && l.start <= t) { const v = key(l); if (v !== cur) { prev = cur; cur = v; t0 = l.start; } }
    return { prev, cur, k: ease((t - t0) / .55) };
  }
  const mix = (a, b, k) => { const o = {}; for (const n of new Set([...Object.keys(a), ...Object.keys(b)])) o[n] = lerp(a[n] || 0, b[n] || 0, k); return o; };
  const mixT = (a, b, k) => ({ x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), hand: k < .5 ? a.hand : b.hand });
  function gestureAt(who, t) {
    const ev = [];
    L.forEach((l, i) => {
      if (l.who !== who) return;
      ev.push([l.start, l.gesture || DEF_G[who][l.mood] || 'rest']);
      const n = L[i + 1]; if (who === 'kazim' && (!n || n.who !== who)) ev.push([l.end + .6, 'rest']);
    });
    let prev = 'rest', cur = 'rest', t0 = -9;
    for (const [et, g] of ev) if (et <= t && g !== cur) { prev = cur; cur = g; t0 = et; }
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
    const ai = lineAt(t), speaking = ai >= 0 && L[ai].who === who && t < L[ai].end + .3, dir = who === 'kazim' ? 1 : -1;
    p.lookX = dir * (speaking ? .25 : .55) + noise1(t * .7 + (dir > 0 ? 0 : 40)) * .18;
    p.lookY = (p.lookY || 0) + noise1(t * .5 + 9) * .1;
    p.blink = blink(t, who === 'kazim' ? 1.3 : 3.7);
    p.tilt = Math.sin(t * .9 + dir) * .025 + (speaking ? noise1(t * 1.3) * .03 : dir * .03);
    p.nod = 0; for (const l of L) if (l.who !== who && t > l.end && t < l.end + .7 && l.nod !== false) p.nod = Math.sin((t - l.end) / .7 * PI) * .6;
    const gs = gestureAt(who, t);
    if (who === 'kazim') {
      p.R = mixT(GEST.kazim[gs.prev], GEST.kazim[gs.cur], gs.k);
      const ls = lanternState(t);
      p.L = mixT({ x: -215, y: -310, hand: 'fist' }, { x: -258, y: -730, hand: 'fist' }, ls.up); p.L.hand = 'fist'; p.lantern = ls.lev;
    } else { const a = GEST.demir[gs.prev], b = GEST.demir[gs.cur]; p.L = mixT(a[0], b[0], gs.k); p.R = mixT(a[1], b[1], gs.k); }
    for (const arm of [p.L, p.R]) { arm.x += noise1(t * .8 + arm.x) * 4; arm.y += noise1(t * .8 + arm.y) * 4; }
    if (speaking && who === 'kazim' && p.R.hand === 'point') p.R.y += Math.sin(t * 5) * 6 * p.talk;
    return p;
  }

  // ---------- diyalog planı (sokak) ----------
  const CAST = EP.cast;
  function camFor(shot, t, t0, P) {
    const k = CAST.kazim, d = CAST.demir; let cx = 360, cy = 640, z = 1;
    if (shot === 'two') { cx = (k.x + d.x) / 2 + 5; cy = 700; z = 1.3; }
    else if (shot === 'close-kazim') { cx = k.x + 45; cy = k.y - k.s * 700; z = 2.35; }
    else if (shot === 'close-demir') { cx = d.x - 10; cy = d.y - d.s * 610; z = 2.55; }
    else if (shot === 'lantern') { const lp = owlLanternPos(P.kazim); cx = k.x + lp[0] * k.s + 55; cy = k.y + lp[1] * k.s - 45; z = 2.8; }
    z *= 1 + .05 * ss(0, 6, t - t0);
    cx += noise1(t * .35) * 5; cy += noise1(t * .35 + 20) * 4;
    return { cx, cy, z };
  }
  function drawChar(dst, who, P, camM) {
    const k = CAST[who];
    lc.setTransform(1, 0, 0, 1, 0, 0); lc.clearRect(0, 0, CW, CH);
    c = lc; lc.setTransform(camM); lc.translate(k.x, k.y); lc.scale(k.s, k.s);
    if (who === 'kazim') drawOwl(P); else drawWolf(P);
    lc.setTransform(camM); lc.globalCompositeOperation = 'source-atop';
    lc.fillStyle = lg(k.x + 160, k.y - 640, k.x - 200, k.y - 150, [[0, 'rgba(255,190,110,.20)'], [.5, 'rgba(0,0,0,0)'], [1, 'rgba(10,5,2,.42)']]); lc.fillRect(-500, -500, 1720, 2300);
    lc.fillStyle = lg(0, k.y - 260 * k.s, 0, k.y, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(8,4,2,.45)']]); lc.fillRect(-500, -500, 1720, 2300);
    if (who === 'kazim') { const lp = owlLanternPos(P), lx = k.x + lp[0] * k.s, ly = k.y + lp[1] * k.s; lc.fillStyle = rg(lx, ly, 0, 300 * k.s, [[0, `rgba(255,160,60,${.32 * P.lantern})`], [1, 'rgba(0,0,0,0)']]); lc.fillRect(-500, -500, 1720, 2300); }
    lc.globalCompositeOperation = 'source-over';
    c = dst; dst.setTransform(1, 0, 0, 1, 0, 0); dst.drawImage(layer, 0, 0);
  }
  function lightsOn(dst) {
    dst.setTransform(1, 0, 0, 1, 0, 0);
    for (const g of LIGHTS) { dst.save(); dst.globalCompositeOperation = 'lighter'; dst.fillStyle = rg(g.x, g.y, 0, g.r, [[0, g.col], [1, 'rgba(0,0,0,0)']]); dst.fillRect(g.x - g.r, g.y - g.r, g.r * 2, g.r * 2); dst.restore(); }
    LIGHTS = [];
  }
  function drawDialog(dst, shot, t) {
    const P = { kazim: pose('kazim', t), demir: pose('demir', t) };
    const cam = camFor(shot.name, t, shot.sceneStart, P);
    const camM = new DOMMatrix().scale(BASE).translate(W / 2, H / 2).scale(cam.z).translate(-cam.cx, -cam.cy);
    dst.setTransform(camM); drawStreet(t, { lamp: 1, sign: EP.sign });
    dst.setTransform(BASE, 0, 0, BASE, 0, 0); drawRain(t, W, H, 0, .8);
    for (const who of ['demir', 'kazim']) drawChar(dst, who, P[who], camM);
    dst.setTransform(camM); drawSplashes(t);
    lightsOn(dst);
    dst.setTransform(BASE, 0, 0, BASE, 0, 0); drawRain(t, W, H, 1, shot.name === 'two' || shot.name === 'wide' ? 1 : .7);
  }
  function drawShot(dst, shot, t) {
    c = dst; LIGHTS = [];
    dst.setTransform(1, 0, 0, 1, 0, 0); dst.globalCompositeOperation = 'source-over'; dst.globalAlpha = 1; dst.filter = 'none';
    dst.fillStyle = '#000'; dst.fillRect(0, 0, CW, CH);
    if (DIALOG.has(shot.name)) return drawDialog(dst, shot, t);
    const fn = SCENES[shot.name]; if (!fn) return;
    const pt = t - shot.start, pd = shot.end - shot.start;
    dst.setTransform(BASE, 0, 0, BASE, 0, 0); dst.save();
    fn({ t, lt: t - shot.sceneStart, pt, pd, k: cl(pt / pd, 0, 1), phase: shot.phase, quote: EP.quote, number: EP.number, title: EP.title, sketch: EP.sketch,
      talk: new Proxy({}, { get: (_, w) => talkOf(String(w), t) }) });
    dst.restore(); lightsOn(dst);
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
  function spaced(txt, x, y, font, col, sp, a = 1) {
    c.save(); c.globalAlpha = a; c.font = font; c.textAlign = 'center'; c.letterSpacing = sp + 'px'; c.fillStyle = col; c.fillText(txt, x + sp / 2, y); c.restore();
  }
  const FLASH = 'sepia(.62) saturate(.75) contrast(1.06) brightness(.95)', COLD = 'saturate(.25) brightness(.8) contrast(1.08) hue-rotate(185deg) sepia(.15)';
  function blit(buf, shot, a) {
    main.save(); main.setTransform(1, 0, 0, 1, 0, 0); main.globalAlpha = a; if (shot.flash) main.filter = shot.flash === 'cold' ? COLD : FLASH; main.drawImage(buf, 0, 0); main.restore();
  }

  // ---------- kare ----------
  function render(t) {
    t = cl(t, 0, DUR);
    const shot = shotAt(t), idx = SHOTS.indexOf(shot), prev = SHOTS[idx - 1];
    drawShot(ca, shot, t);
    c = main; main.setTransform(1, 0, 0, 1, 0, 0); main.globalAlpha = 1; main.globalCompositeOperation = 'source-over'; main.filter = 'none';
    main.fillStyle = '#000'; main.fillRect(0, 0, CW, CH);
    const fk = shot.fade && prev ? ss(0, TR, t - shot.start) : 1;
    if (fk < 1) { drawShot(cb, prev, t); blit(bufB, prev, 1); }
    blit(bufA, shot, fk);
    c = main; main.setTransform(BASE, 0, 0, BASE, 0, 0);
    const ending = shot.name === 'kapanis';
    main.save(); main.globalCompositeOperation = 'soft-light'; main.fillStyle = 'rgba(255,150,60,.22)'; main.fillRect(0, 0, W, H); main.restore();
    main.fillStyle = rg(W / 2, H * .46, W * .32, H * .72, [[0, 'rgba(0,0,0,0)'], [.7, 'rgba(6,3,1,.42)'], [1, 'rgba(3,2,1,.9)']]); main.fillRect(0, 0, W, H);
    if (!ending) { main.fillStyle = lg(0, 900, 0, H, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,.5)']]); main.fillRect(0, 900, W, H - 900); }
    if (shot.flash === true) { // eski film: çizik + titreme
      main.save(); main.globalAlpha = .25 + .1 * hash(Math.floor(t * 24)); main.strokeStyle = '#f3e6c8'; main.lineWidth = 1.2;
      for (let i = 0; i < 3; i++) { const sx = hash(Math.floor(t * 12) + i * 7) * W; main.beginPath(); main.moveTo(sx, 0); main.lineTo(sx + (hash(i + Math.floor(t * 12)) - .5) * 20, H); main.stroke(); }
      main.restore(); main.fillStyle = `rgba(255,240,210,${.03 * hash(Math.floor(t * 24) + 3)})`; main.fillRect(0, 0, W, H);
    }
    if (!ending) { subtitle(t); spaced('BAYKUŞ KAZIM', W / 2, 70, "600 19px Cinzel,Georgia,serif", 'rgba(232,212,176,.85)', 7); }
    if (t < .8) { main.fillStyle = `rgba(0,0,0,${1 - ss(0, .8, t)})`; main.fillRect(0, 0, W, H); }
    main.fillStyle = `rgba(0,0,0,${ss(DUR - .6, DUR, t)})`; main.fillRect(0, 0, W, H);
    main.setTransform(1, 0, 0, 1, 0, 0); main.save(); main.globalCompositeOperation = 'overlay'; main.globalAlpha = shot.flash ? .12 : .07;
    const gi = Math.floor(t * 24), gp = main.createPattern(TEX.grain[gi % 4], 'repeat'); gp.setTransform(new DOMMatrix().translate(hash(gi) * 256, hash(gi + 1) * 256));
    main.fillStyle = gp; main.fillRect(0, 0, CW, CH); main.restore();
  }

  window.seekTo = t => { render(t); return true; };
  window.EP_INFO = { duration: DUR, lines: L.map(l => ({ who: l.who, start: +l.start.toFixed(2), end: +l.end.toFixed(2), text: l.text })), shots: SHOTS.map(s => [s.name, s.phase || '', +s.start.toFixed(2)]) };
  // Yazı tiplerini önceden yükle (yoksa ilk kullanıldığı karede yedek fonta düşer; paralel kayıtta tutarsızlık olur)
  const FONTS = ['700 66px Caveat', '600 20px Cinzel', '700 20px Cinzel', 'italic 900 50px Inter', '600 24px Inter', '700 26px Inter', '500 22px Inter', "22px 'Noto Color Emoji'"];
  (document.fonts ? Promise.all(FONTS.map(f => document.fonts.load(f, 'AaÇçĞğİıÖöŞşÜü🙂'))).then(() => document.fonts.ready) : Promise.resolve()).then(() => { render(0); window.READY = true; });
  if (!cap) {
    let now = 0, play = true, last = null; const pp = document.getElementById('pp'), sl = document.getElementById('sl'), tm = document.getElementById('tm'); sl.max = DUR;
    pp.onclick = () => { play = !play; pp.textContent = play ? 'Duraklat' : 'Oynat'; };
    sl.oninput = () => { now = +sl.value; render(now); };
    (function loop(ts) { if (play) { if (last != null) now = (now + (ts - last) / 1000) % DUR; render(now); sl.value = now; tm.textContent = now.toFixed(1) + 's'; } last = ts; requestAnimationFrame(loop); })();
  }
})();
