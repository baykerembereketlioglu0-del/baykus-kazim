// Kullanım:  ELEVENLABS_API_KEY=... node generate_voices.js
// (PowerShell: $env:ELEVENLABS_API_KEY="..."; node generate_voices.js)
// Çıktı: audio/NN.mp3, audio.mp3 (birleşik ses), timeline.js (kelime kelime zamanlama)
const fs = require('fs'), path = require('path');
const { execFileSync } = require('child_process');
const STORY = require('./story.js');

const KEY = process.env.ELEVENLABS_API_KEY;
if (!KEY) { console.error('ELEVENLABS_API_KEY ortam değişkeni tanımlı değil.'); process.exit(1); }
// Sesleri değiştirmek için ElevenLabs'teki voice_id değerlerini ortam değişkeniyle ver.
const VOICES = {
  kazim: process.env.VOICE_KAZIM || 'pNInz6obpgDQGcFmaJgB', // derin, bilge ses
  demir: process.env.VOICE_DEMIR || 'TxGEqnHWrfWFTfGW9XjX', // daha genç, yumuşak ses
};
const SETTINGS = {
  kazim: { stability: 0.55, similarity_boost: 0.8, style: 0.25 },
  demir: { stability: 0.4, similarity_boost: 0.75, style: 0.35 },
};
const LEAD = 1.2, GAP = 0.45, TAIL = 3;
const dir = path.join(__dirname, 'audio'); fs.mkdirSync(dir, { recursive: true });

async function tts(i, line) {
  const base = path.join(dir, String(i).padStart(2, '0'));
  if (fs.existsSync(base + '.json')) return JSON.parse(fs.readFileSync(base + '.json', 'utf8')); // önbellek: kredi harcama
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICES[line.who]}/with-timestamps`, {
    method: 'POST',
    headers: { 'xi-api-key': KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: line.text, model_id: 'eleven_multilingual_v2', voice_settings: SETTINGS[line.who] }),
  });
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`);
  const j = await res.json();
  fs.writeFileSync(base + '.mp3', Buffer.from(j.audio_base64, 'base64'));
  fs.writeFileSync(base + '.json', JSON.stringify({ alignment: j.alignment }));
  return { alignment: j.alignment };
}
function toWords(al) { // karakter zamanlarından kelime zamanları
  const ws = []; let cur = null;
  al.characters.forEach((ch, k) => {
    if (/\s/.test(ch)) { cur = null; return; }
    if (!cur) { cur = [ '', al.character_start_times_seconds[k], 0 ]; ws.push(cur); }
    cur[0] += ch; cur[2] = al.character_end_times_seconds[k];
  });
  return ws;
}
const probe = f => parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString());

(async () => {
  let t = LEAD; const lines = [], ins = [];
  for (let i = 0; i < STORY.length; i++) {
    const l = STORY[i]; console.log(`Ses ${i + 1}/${STORY.length}: ${l.text}`);
    const { alignment } = await tts(i, l);
    const f = path.join(dir, String(i).padStart(2, '0') + '.mp3'), dur = probe(f);
    lines.push({ who: l.who, mood: l.mood, start: t, end: t + dur, words: toWords(alignment).map(w => [w[0], t + w[1], t + w[2]]) });
    ins.push({ f, ms: Math.round(t * 1000) });
    t += dur + GAP;
  }
  const args = ['-y']; ins.forEach(a => args.push('-i', a.f));
  const fc = ins.map((a, i) => `[${i}:a]adelay=${a.ms}:all=1[a${i}]`).join(';') + ';' +
    ins.map((_, i) => `[a${i}]`).join('') + `amix=inputs=${ins.length}:normalize=0[out]`;
  execFileSync('ffmpeg', [...args, '-filter_complex', fc, '-map', '[out]', path.join(__dirname, 'audio.mp3')], { stdio: 'inherit' });
  fs.writeFileSync(path.join(__dirname, 'timeline.js'), 'window.TIMELINE=' + JSON.stringify({ duration: t - GAP + TAIL, lines }) + ';');
  const ip = path.join(__dirname, 'index.html'), tlJson = JSON.stringify({ duration: t - GAP + TAIL, lines });
  fs.writeFileSync(ip, fs.readFileSync(ip, 'utf8').replace(/<script id="tl">[\s\S]*?<\/script>/, () => `<script id="tl">window.TIMELINE=${tlJson};</script>`));
  console.log('Hazır: audio.mp3 + timeline.js. Şimdi: node record.js');
})().catch(e => { console.error(e.message); process.exit(1); });
