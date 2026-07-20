/**
 * Generative ambient lullaby, built entirely with the Web Audio API.
 *
 * Three layers:
 *  - a slow, warm pad that drifts through a dreamy chord progression
 *  - a music-box melody plucking pentatonic notes over each chord
 *  - a procedural reverb + echo so everything floats in space
 *
 * No audio files needed — it composes itself, slightly differently every night.
 */

type Chord = {
  pad: number[]; // pad frequencies (Hz)
  bells: number[]; // melody note pool for this chord (Hz)
};

// Am9 → Fmaj7 → Cmaj7 → G6 — soft, hopeful, unresolved in a good way.
const PROGRESSION: Chord[] = [
  {
    pad: [110.0, 220.0, 261.63, 329.63, 493.88],
    bells: [440.0, 523.25, 659.26, 493.88, 880.0, 587.33],
  },
  {
    pad: [87.31, 174.61, 220.0, 261.63, 329.63],
    bells: [523.25, 440.0, 349.23, 659.26, 698.46, 880.0],
  },
  {
    pad: [130.81, 196.0, 246.94, 329.63, 392.0],
    bells: [523.25, 587.33, 659.26, 783.99, 493.88, 392.0],
  },
  {
    pad: [98.0, 196.0, 246.94, 293.66, 329.63],
    bells: [587.33, 493.88, 783.99, 440.0, 659.26, 392.0],
  },
];

const CHORD_SECONDS = 12;

export class NightMusic {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private reverbSend: GainNode | null = null;
  private delaySend: GainNode | null = null;
  private padBus: GainNode | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private chordIndex = 0;
  private nextChordTime = 0;
  private nextBellTime = 0;

  get playing() {
    return this.ctx !== null;
  }

  start() {
    if (this.ctx) return;
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctor();
    this.ctx = ctx;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.85, ctx.currentTime + 4); // slow fade in
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -28;
    compressor.ratio.value = 6;
    master.connect(compressor).connect(ctx.destination);
    this.master = master;

    // procedural reverb: 3s exponentially-decaying noise impulse
    const convolver = ctx.createConvolver();
    convolver.buffer = this.makeImpulse(ctx, 3, 2.6);
    const reverbGain = ctx.createGain();
    reverbGain.gain.value = 0.55;
    convolver.connect(reverbGain).connect(master);
    const reverbSend = ctx.createGain();
    reverbSend.connect(convolver);
    this.reverbSend = reverbSend;

    // echo for the music box
    const delay = ctx.createDelay(2);
    delay.delayTime.value = 0.46;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.34;
    const delayFilter = ctx.createBiquadFilter();
    delayFilter.type = "lowpass";
    delayFilter.frequency.value = 2200;
    delay.connect(delayFilter).connect(feedback).connect(delay);
    const delayOut = ctx.createGain();
    delayOut.gain.value = 0.5;
    delay.connect(delayOut).connect(master);
    delayOut.connect(reverbSend);
    const delaySend = ctx.createGain();
    delaySend.connect(delay);
    this.delaySend = delaySend;

    // pad bus through a gentle lowpass so it stays behind the melody
    const padFilter = ctx.createBiquadFilter();
    padFilter.type = "lowpass";
    padFilter.frequency.value = 900;
    padFilter.Q.value = 0.4;
    const padBus = ctx.createGain();
    padBus.gain.value = 1;
    padBus.connect(padFilter);
    padFilter.connect(master);
    padFilter.connect(reverbSend);
    this.padBus = padBus;

    this.chordIndex = 0;
    this.nextChordTime = ctx.currentTime + 0.1;
    this.nextBellTime = ctx.currentTime + 2.5;

    // lookahead scheduler
    this.timer = setInterval(() => this.schedule(), 250);
    this.schedule();
  }

  stop() {
    const ctx = this.ctx;
    if (!ctx) return;
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.master?.gain.cancelScheduledValues(ctx.currentTime);
    this.master?.gain.setValueAtTime(this.master.gain.value, ctx.currentTime);
    this.master?.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2);
    const dying = ctx;
    setTimeout(() => void dying.close().catch(() => {}), 1500);
    this.ctx = null;
    this.master = null;
    this.reverbSend = null;
    this.delaySend = null;
    this.padBus = null;
  }

  private schedule() {
    const ctx = this.ctx;
    if (!ctx) return;
    const horizon = ctx.currentTime + 1.5;

    while (this.nextChordTime < horizon) {
      const chord = PROGRESSION[this.chordIndex % PROGRESSION.length];
      this.playPad(chord, this.nextChordTime);
      this.chordIndex++;
      this.nextChordTime += CHORD_SECONDS;
    }

    while (this.nextBellTime < horizon) {
      // which chord is sounding at that moment?
      const idx =
        Math.floor(
          (this.nextBellTime - (this.nextChordTime - this.chordIndex * CHORD_SECONDS)) /
            CHORD_SECONDS,
        ) % PROGRESSION.length;
      const chord =
        PROGRESSION[((idx % PROGRESSION.length) + PROGRESSION.length) % PROGRESSION.length];
      // occasionally rest — silence is part of the melody
      if (Math.random() < 0.78) {
        const f = chord.bells[Math.floor(Math.random() * chord.bells.length)];
        this.playBell(f, this.nextBellTime);
        // sometimes answer with a second, quieter note a fifth-ish away
        if (Math.random() < 0.3) {
          const g = chord.bells[Math.floor(Math.random() * chord.bells.length)];
          this.playBell(g, this.nextBellTime + 0.35 + Math.random() * 0.2, 0.5);
        }
      }
      this.nextBellTime += 1.4 + Math.random() * 1.6;
    }
  }

  private playPad(chord: Chord, when: number) {
    const ctx = this.ctx;
    const padBus = this.padBus;
    if (!ctx || !padBus) return;
    const dur = CHORD_SECONDS + 6; // overlap into the next chord
    for (const f of chord.pad) {
      for (const detune of [-4, 3]) {
        const osc = ctx.createOscillator();
        osc.type = "triangle";
        osc.frequency.value = f;
        osc.detune.value = detune;
        const g = ctx.createGain();
        const peak = 0.022 / Math.sqrt(f / 110); // quieter as pitch rises
        g.gain.setValueAtTime(0, when);
        g.gain.linearRampToValueAtTime(peak, when + 4);
        g.gain.setValueAtTime(peak, when + dur - 5);
        g.gain.linearRampToValueAtTime(0, when + dur);
        osc.connect(g).connect(padBus);
        osc.start(when);
        osc.stop(when + dur + 0.1);
      }
    }
  }

  private playBell(freq: number, when: number, velocity = 1) {
    const ctx = this.ctx;
    const master = this.master;
    const reverbSend = this.reverbSend;
    const delaySend = this.delaySend;
    if (!ctx || !master || !reverbSend || !delaySend) return;
    const out = ctx.createGain();
    out.gain.value = 1;
    out.connect(master);
    out.connect(reverbSend);
    out.connect(delaySend);

    // music-box: fundamental + soft partials, fast attack, long shimmer
    const partials: [number, number][] = [
      [1, 0.16],
      [2.0, 0.05],
      [4.2, 0.015],
    ];
    for (const [mult, amp] of partials) {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq * mult;
      const g = ctx.createGain();
      const peak = amp * velocity;
      g.gain.setValueAtTime(0, when);
      g.gain.linearRampToValueAtTime(peak, when + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, when + 1.9 / mult);
      osc.connect(g).connect(out);
      osc.start(when);
      osc.stop(when + 2.1);
    }
  }

  private makeImpulse(ctx: AudioContext, seconds: number, decay: number) {
    const rate = ctx.sampleRate;
    const len = Math.floor(rate * seconds);
    const impulse = ctx.createBuffer(2, len, rate);
    for (let ch = 0; ch < 2; ch++) {
      const data = impulse.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
      }
    }
    return impulse;
  }
}
