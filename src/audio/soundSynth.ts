// Web Audio API procedural sound synthesizer for Ricochet Strike
class SoundSynth {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;

  constructor() {
    // Context is initialized on-demand following user interaction
  }

  public setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
  }

  private initCtx(): void {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a simple button tap sound
  public playButton(): void {
    this.initCtx();
    if (!this.soundEnabled || !this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  // Play tension build sound when drawing the sling/aiming
  public playAimTension(intensity: number): void {
    this.initCtx();
    if (!this.soundEnabled || !this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const baseFreq = 220 + intensity * 280; // Scale from 220Hz to 500Hz
    osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.05 * intensity, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  // Sound of projectile launching
  public playLaunch(): void {
    this.initCtx();
    if (!this.soundEnabled || !this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  // Sound of a physical wall bounce
  public playBounce(): void {
    this.initCtx();
    if (!this.soundEnabled || !this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(350, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  // Sound of glass shattering
  public playGlassBreak(): void {
    this.initCtx();
    if (!this.soundEnabled || !this.ctx) return;

    // We can simulate glass break by firing several quick high-pitched FM square waves
    for (let i = 0; i < 4; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      const startFreq = 2000 + Math.random() * 2500;
      osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime + i * 0.02);
      osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.25 + i * 0.02);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime + i * 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25 + i * 0.02);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + i * 0.02);
      osc.stop(this.ctx.currentTime + 0.3 + i * 0.02);
    }
  }

  // Sound of passing through a portal
  public playPortal(): void {
    this.initCtx();
    if (!this.soundEnabled || !this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(1200, this.ctx.currentTime + 0.1);
    osc.frequency.linearRampToValueAtTime(300, this.ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  // Volt electric lightning chaining sound
  public playVoltChain(): void {
    this.initCtx();
    if (!this.soundEnabled || !this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(800, this.ctx.currentTime + 0.1);
    osc.frequency.linearRampToValueAtTime(1200, this.ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    // Rough crackly distortion
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  // Ice slowing sound
  public playFrostSlow(): void {
    this.initCtx();
    if (!this.soundEnabled || !this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 0.4);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.4);
  }

  // Collision with instant hazard/failing sound
  public playHazardFailure(): void {
    this.initCtx();
    if (!this.soundEnabled || !this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(45, this.ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
  }

  // Winning / Target destroyed explosion sound
  public playTargetDestruction(): void {
    this.initCtx();
    if (!this.soundEnabled || !this.ctx) return;

    // Combine a noise sweep with a bassy sine drop
    const oscBass = this.ctx.createOscillator();
    const gainBass = this.ctx.createGain();

    oscBass.type = 'sine';
    oscBass.frequency.setValueAtTime(220, this.ctx.currentTime);
    oscBass.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.45);

    gainBass.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gainBass.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.45);

    oscBass.connect(gainBass);
    gainBass.connect(this.ctx.destination);

    oscBass.start();
    oscBass.stop(this.ctx.currentTime + 0.45);

    // Crackle explosion
    const oscExpl = this.ctx.createOscillator();
    const gainExpl = this.ctx.createGain();
    oscExpl.type = 'triangle';
    oscExpl.frequency.setValueAtTime(400, this.ctx.currentTime);
    oscExpl.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.3);

    gainExpl.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gainExpl.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

    oscExpl.connect(gainExpl);
    gainExpl.connect(this.ctx.destination);

    oscExpl.start();
    oscExpl.stop(this.ctx.currentTime + 0.3);
  }

  // Perfect high value ricochet multiplier sound
  public playPerfectRicochet(): void {
    this.initCtx();
    if (!this.soundEnabled || !this.ctx) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    const gain2 = this.ctx.createGain();

    // Harmonic perfect chord sound
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5
    osc1.frequency.setValueAtTime(659.25, this.ctx.currentTime + 0.08); // E5
    osc1.frequency.setValueAtTime(783.99, this.ctx.currentTime + 0.16); // G5

    gain1.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);

    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1046.50, this.ctx.currentTime + 0.20); // C6

    gain2.gain.setValueAtTime(0.12, this.ctx.currentTime + 0.20);
    gain2.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.45);

    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);

    osc1.start();
    osc1.stop(this.ctx.currentTime + 0.45);
    osc2.start(this.ctx.currentTime + 0.20);
    osc2.stop(this.ctx.currentTime + 0.50);
  }
}

export const soundSynth = new SoundSynth();
export default soundSynth;
