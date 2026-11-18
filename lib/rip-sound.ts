/**
 * Krátky zvuk „rrrip“ syntetizovaný cez Web Audio (žiadny súbor, ~0,25 s).
 * Volať len po používateľskom geste (klik) – inak prehliadač zvuk zablokuje. Pri chybe ticho skončí.
 */
export function playRip() {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const dur = 0.26;
    const buf = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * dur), ctx.sampleRate);
    const data = buf.getChannelData(0);
    // šum s „vláknami“ – náhodné krátke praskavé impulzy na pozadí jemnejšieho šumu
    for (let i = 0; i < data.length; i++) {
      const t = i / data.length;
      const env = Math.pow(1 - t, 1.6) * (0.35 + 0.65 * Math.min(1, t * 12));
      const crackle = Math.random() < 0.08 ? (Math.random() * 2 - 1) * 1.6 : 0;
      data[i] = ((Math.random() * 2 - 1) * 0.45 + crackle) * env;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(1800, ctx.currentTime);
    bp.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + dur);
    bp.Q.value = 0.7;
    const gain = ctx.createGain();
    gain.gain.value = 0.22;
    src.connect(bp).connect(gain).connect(ctx.destination);
    src.start();
    src.onended = () => void ctx.close();
  } catch {
    /* bez zvuku */
  }
}
