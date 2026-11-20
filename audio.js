// Procedural Web Audio synthesizer for TV Anime 3D "Slime Lotion Gel Amoeba"

class KusogeAudio3D {
  constructor() {
    this.ctx = null;
    this.sfxEnabled = true;
    this.bgmEnabled = true;
    this.bgmInterval = null;
    this.bgmStep = 0;
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  startBgm() {
    this.ensureContext();
    if (this.bgmInterval || !this.bgmEnabled || !this.ctx) return;

    // Surreal cheerful-yet-cursed cheap 3D indie game synth loop
    const melody = [
      523.25, 0, 587.33, 659.25, 0, 523.25, 493.88, 440,
      392, 0, 440, 493.88, 523.25, 0, 392, 0,
      659.25, 0, 622.25, 659.25, 783.99, 0, 698.46, 659.25,
      587.33, 523.25, 493.88, 523.25, 587.33, 0, 392, 0,
    ];
    const bass = [
      130.81, 196, 130.81, 196, 146.83, 220, 196, 146.83,
      164.81, 246.94, 174.61, 220, 196, 196, 130.81, 196,
    ];

    this.bgmInterval = setInterval(() => {
      if (!this.bgmEnabled || !this.ctx || this.ctx.state !== 'running') return;
      const now = this.ctx.currentTime;
      const m = melody[this.bgmStep % melody.length];
      const b = bass[Math.floor(this.bgmStep / 2) % bass.length];

      if (m > 0) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(m, now);
        osc.frequency.linearRampToValueAtTime(m * 1.009, now + 0.14);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.17);
      }

      if (this.bgmStep % 2 === 0 && b > 0) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(b, now);
        gain.gain.setValueAtTime(0.055, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.27);
      }

      this.bgmStep++;
    }, 175);
  }

  stopBgm() {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  toggleBgm() {
    this.bgmEnabled = !this.bgmEnabled;
    if (this.bgmEnabled) this.startBgm();
    else this.stopBgm();
    return this.bgmEnabled;
  }

  toggleSfx() {
    this.sfxEnabled = !this.sfxEnabled;
    return this.sfxEnabled;
  }

  playStartSplash() {
    if (!this.sfxEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.14);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.26);
    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  playJump() {
    if (!this.sfxEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(175, now);
    osc.frequency.exponentialRampToValueAtTime(840, now + 0.17);
    gain.gain.setValueAtTime(0.085, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.19);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  playSlimeSlide() {
    if (!this.sfxEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    const base = 180 + Math.random() * 110;
    osc.frequency.setValueAtTime(base, now);
    osc.frequency.exponentialRampToValueAtTime(base * 1.9, now + 0.06);
    gain.gain.setValueAtTime(0.028, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.07);
  }

  playSumoBump() {
    if (!this.sfxEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(62, now + 0.15);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.17);
  }

  playImpale() {
    if (!this.sfxEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Crunchy stab + comical wet gush noise
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(340, now);
    osc.frequency.exponentialRampToValueAtTime(52, now + 0.24);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.27);

    // Filtered noise burst for hilarious blood fountain spray!
    const bufSize = Math.floor(this.ctx.sampleRate * 0.28);
    const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufSize);
    const noise = this.ctx.createBufferSource();
    noise.buffer = buf;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1100, now);
    const nGain = this.ctx.createGain();
    nGain.gain.setValueAtTime(0.14, now);
    nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.27);
    noise.connect(filter);
    filter.connect(nGain);
    nGain.connect(this.ctx.destination);
    noise.start(now);
  }

  playWallJump() {
    if (!this.sfxEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // Punchy wood-kick + high spring chirp
    const kick = this.ctx.createOscillator();
    const kGain = this.ctx.createGain();
    kick.type = 'triangle';
    kick.frequency.setValueAtTime(220, now);
    kick.frequency.exponentialRampToValueAtTime(95, now + 0.08);
    kGain.gain.setValueAtTime(0.16, now);
    kGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    kick.connect(kGain);
    kGain.connect(this.ctx.destination);
    kick.start(now);
    kick.stop(now + 0.1);

    const spring = this.ctx.createOscillator();
    const sGain = this.ctx.createGain();
    spring.type = 'sawtooth';
    spring.frequency.setValueAtTime(320, now + 0.02);
    spring.frequency.exponentialRampToValueAtTime(980, now + 0.18);
    sGain.gain.setValueAtTime(0.075, now + 0.02);
    sGain.gain.exponentialRampToValueAtTime(0.001, now + 0.19);
    spring.connect(sGain);
    sGain.connect(this.ctx.destination);
    spring.start(now + 0.02);
    spring.stop(now + 0.2);
  }

  playCoin() {
    if (!this.sfxEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const freqs = [987.77, 1318.51]; // Crisp Mario-inspired B5 -> E6 coin chime!
    freqs.forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      const t = now + i * 0.075;
      osc.frequency.setValueAtTime(f, t);
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + (i === 1 ? 0.34 : 0.09));
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + (i === 1 ? 0.36 : 0.1));
    });
  }

  playGoalOne() {
    if (!this.sfxEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + i * 0.06);
      gain.gain.setValueAtTime(0.11, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.16);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.18);
    });
  }

  playStageClear() {
    if (!this.sfxEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5, 987.77, 1046.5];
    notes.forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      const t = now + i * 0.095;
      osc.frequency.setValueAtTime(f, t);
      gain.gain.setValueAtTime(0.065, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.24);
    });
  }
}

window.kusogeAudio = new KusogeAudio3D();
