// İsteğe bağlı seslendirme (ElevenLabs). Herhangi bir bölüm için çalışır.
// Kullanım:  ELEVENLABS_API_KEY=... node ortak/seslendir.js <bölüm-klasörü>
// (PowerShell: $env:ELEVENLABS_API_KEY="..."; node ortak/seslendir.js bolum5-fenerin-yagi)
// Çıktı (bölüm klasörüne): ses/NN.mp3, ses.mp3 (birleşik), timeline.js (kelime kelime zamanlama).
// Sonra `node ortak/kaydet.js <bölüm>` sesi ve dudak senkronunu otomatik kullanır.
const fs = require('fs'), path = require('path');
const { execFileSync } = require('child_process');

const EP_DIR = path.resolve(process.argv[2] || '.');
const EP = require(path.join(EP_DIR, 'story.js')), STORY = EP.story;
const KEY = process.env.ELEVENLABS_API_KEY;
if (!KEY) { console.error('ELEVENLABS_API_KEY ortam değişkeni tanımlı değil.'); process.exit(1); }
const VOICES = {
  kazim: process.env.VOICE_KAZIM || 'pNInz6obpgDQGcFmaJgB', // derin, bilge ses
  demir: process.env.VOICE_DEMIR || 'TxGEqnHWrfWFTfGW9XjX', // genç, yumuşak ses
};
const SETTINGS = { kazim: { stability: 0.55, similarity_boost: 0.8, style: 0.25 }, demir: { stability: 0.4, similarity_boost: 0.75, style: 0.35 } };
const LEAD = EP.intro ?? 3.2, GAP = 0.55;
const dir = path.join(EP_DIR, 'ses'); fs.mkdirSync(dir, { recursive: true });

async function tts(i, line) {
  const base = path.join(dir, String(i).padStart(2, '0')), key = line.who + '|' + line.text;
  if (fs.existsSync(base + '.json')) { const j = JSON.parse(fs.readFileSync(base + '.json', 'utf8')); if (j.key === key) return j; } // önbellek
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICES[line.who]}/with-timestamps`, {
    method: 'POST', headers: { 'xi-api-key': KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: line.text, model_id: 'eleven_multilingual_v2', voice_settings: SETTINGS[line.who] }),
  });
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`);
  const j = await res.json();
  fs.writeFileSync(base + '.mp3', Buffer.from(j.audio_base64, 'base64'));
  const out = { key, alignment: j.alignment }; fs.writeFileSync(base + '.json', JSON.stringify(out)); return out;
}
function toWords(al) {
  const ws = []; let cur = null;
  al.characters.forEach((ch, k) => {
    if (/\s/.test(ch)) { cur = null; return; }
    if (!cur) { cur = ['', al.character_start_times_seconds[k], 0]; ws.push(cur); }
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
    lines.push({ start: t, end: t + dur, words: toWords(alignment).map(w => [w[0], t + w[1], t + w[2]]) });
    ins.push({ f, ms: Math.round(t * 1000) });
    t += dur + (l.pause ?? GAP);
  }
  const a = ['-y']; ins.forEach(x => a.push('-i', x.f));
  const fc = ins.map((x, i) => `[${i}:a]adelay=${x.ms}:all=1[a${i}]`).join(';') + ';' + ins.map((_, i) => `[a${i}]`).join('') + `amix=inputs=${ins.length}:normalize=0[out]`;
  execFileSync('ffmpeg', [...a, '-filter_complex', fc, '-map', '[out]', path.join(EP_DIR, 'ses.mp3')], { stdio: 'inherit' });
  fs.writeFileSync(path.join(EP_DIR, 'timeline.js'), 'window.TIMELINE=' + JSON.stringify({ lines }) + ';');
  console.log('Hazır: ses.mp3 + timeline.js. Şimdi: node ortak/kaydet.js ' + path.basename(EP_DIR));
})().catch(e => { console.error(e.message); process.exit(1); });
