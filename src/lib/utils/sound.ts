/**
 * A simple sound utility using the Web Audio API to generate synthesized sounds
 * without needing external audio files.
 */
class SoundPlayer {
  private ctx: AudioContext | null = null;

  private getContext() {
    if (!this.ctx) {
      this.ctx = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
    }
    return this.ctx;
  }

  /**
   * Plays a simple beep sound
   * @param frequency - Frequency in Hz (default 440 - A4)
   * @param duration - Duration in seconds (default 0.1)
   * @param type - Oscillator type: 'sine', 'square', 'sawtooth', 'triangle'
   */
  playTone(
    frequency = 440,
    duration = 0.1,
    type: OscillatorType = "sine",
    volume = 1.0,
  ) {
    const ctx = this.getContext();

    // Resume context if it was suspended (browsers often block auto-play)
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    // Fade out to avoid "clicks"
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.0001,
      ctx.currentTime + duration,
    );

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + duration);
  }

  /**
   * Plays a quick two-note sweep between two frequencies, used by
   * playToggleOn/playToggleOff. Kept private since it's just a building block.
   */
  private playSweep(
    startFreq: number,
    endFreq: number,
    duration = 0.06,
    volume = 0.015,
  ) {
    const ctx = this.getContext();

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(startFreq, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      endFreq,
      ctx.currentTime + duration,
    );

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.0001,
      ctx.currentTime + duration,
    );

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + duration);
  }

  /**
   * A pleasant "success" double-beep
   */
  playSuccess() {
    this.playTone(523.25, 0.1, "sine", 0.1); // C5
    setTimeout(() => this.playTone(659.25, 0.15, "sine", 0.1), 100); // E5
  }

  /**
   * A soft "click" for UI interactions
   */
  playClick() {
    this.playTone(800, 0.05, "sine", 0.05);
  }

  /**
   * A very subtle rising blip for switching a toggle ON.
   */
  playToggleOn() {
    this.playSweep(600, 900, 0.06, 0.15);
  }

  /**
   * A very subtle falling blip for switching a toggle OFF.
   * Mirrors playToggleOn but sweeps downward, so on/off feel paired.
   */
  playToggleOff() {
    this.playSweep(900, 600, 0.06, 0.15);
  }

  /**
   * A light, quiet tap sound for simple taps on a summary/row.
   * Quieter and shorter than playClick.
   */
  playTap() {
    this.playTone(1000, 0.04, "sine", 0.012);
  }

  /**
   * An almost-subliminal blip for hovering over a summary/row.
   * Deliberately the quietest and shortest sound in the set,
   * since hover fires far more often than click.
   */
  playHover() {
    this.playTone(1200, 0.025, "sine", 0.006);
  }
}

export const sound = new SoundPlayer();
