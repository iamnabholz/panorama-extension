import { toStore } from "svelte/store";
import { appState } from "../state.svelte";

type Note = {
  frequency: number;
  endFrequency?: number;
  duration: number;
  level: number;
  type?: OscillatorType;
  delay?: number;
};

type Voice = {
  oscillator: OscillatorNode;
  gain: GainNode;
};

const MASTER_VOLUME = 0.15;
const MAX_VOICES = 8;

class SoundPlayer {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private voices = new Set<Voice>();
  private unsubscribe?: () => void;
  private resuming = false;
  private generation = 0;
  private disposed = false;

  constructor() {
    if (typeof window === "undefined") return;

    // React to rune-backed state without needing a .svelte.ts filename.
    this.unsubscribe = toStore(() => appState.playSounds).subscribe(
      (enabled) => {
        if (this.master && this.ctx) {
          this.master.gain.setValueAtTime(
            enabled ? MASTER_VOLUME : 0,
            this.ctx.currentTime,
          );
        }

        if (!enabled) this.stopAll();
      },
    );
  }

  private getContext() {
    if (this.ctx) return this.ctx;

    const ctx = new AudioContext();
    const master = ctx.createGain();

    master.gain.value = appState.playSounds ? MASTER_VOLUME : 0;
    master.connect(ctx.destination);

    this.ctx = ctx;
    this.master = master;

    return ctx;
  }

  private release(voice: Voice) {
    voice.oscillator.onended = null;
    voice.oscillator.disconnect();
    voice.gain.disconnect();
    this.voices.delete(voice);
  }

  private stopVoice(voice: Voice) {
    try {
      voice.oscillator.stop();
    } catch {
      // Also allow cleanup if scheduling failed before start().
    }

    this.release(voice);
  }

  private stopAll() {
    this.generation += 1;

    for (const voice of this.voices) {
      this.stopVoice(voice);
    }
  }

  private schedule(ctx: AudioContext, note: Note, baseTime: number) {
    const master = this.master;
    if (!master) return;

    while (this.voices.size >= MAX_VOICES) {
      const oldest = this.voices.values().next().value;
      if (!oldest) break;
      this.stopVoice(oldest);
    }

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    const voice = { oscillator, gain };

    this.voices.add(voice);

    const start = baseTime + (note.delay ?? 0);
    const end = start + note.duration;
    const attack = Math.min(0.003, note.duration * 0.15);
    const release = Math.min(0.01, note.duration * 0.2);
    const maxFrequency = ctx.sampleRate * 0.45;

    oscillator.type = note.type ?? "sine";
    oscillator.frequency.setValueAtTime(
      Math.min(note.frequency, maxFrequency),
      start,
    );
    oscillator.frequency.exponentialRampToValueAtTime(
      Math.min(note.endFrequency ?? note.frequency, maxFrequency),
      end,
    );

    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(note.level, start + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, end - release);
    gain.gain.linearRampToValueAtTime(0, end);

    oscillator.connect(gain);
    gain.connect(master);

    oscillator.onended = () => this.release(voice);
    oscillator.start(start);
    oscillator.stop(end);
  }

  // The only playback entry point for every preset and custom tone.
  private async play(notes: readonly Note[]) {
    if (this.disposed || typeof window === "undefined") return;

    if (!appState.playSounds) {
      this.stopAll();
      return;
    }

    const generation = this.generation;

    try {
      const ctx = this.getContext();

      if (ctx.state !== "running") {
        // Don't queue up a burst of feedback while audio is blocked.
        if (this.resuming) return;

        this.resuming = true;
        const requestedAt = Date.now();

        try {
          await ctx.resume();
        } finally {
          this.resuming = false;
        }

        if (Date.now() - requestedAt > 300) return;
      }

      if (
        this.disposed ||
        !appState.playSounds ||
        generation !== this.generation ||
        ctx.state !== "running"
      ) {
        return;
      }

      const start = ctx.currentTime + 0.005;

      for (const note of notes) {
        this.schedule(ctx, note, start);
      }
    } catch {
      // Optional feedback must never break the interaction.
      this.stopAll();
    }
  }

  /**
   * Custom tone, using the same mute and master-volume pipeline.
   * Volume is now a relative level between 0 and 1.
   */
  playTone(
    frequency = 440,
    duration = 0.1,
    type: OscillatorType = "sine",
    volume = 1,
  ) {
    if (
      !Number.isFinite(frequency) ||
      !Number.isFinite(duration) ||
      !Number.isFinite(volume) ||
      frequency <= 0 ||
      duration <= 0 ||
      volume <= 0
    ) {
      return;
    }

    void this.play([
      {
        frequency,
        duration: Math.max(0.01, Math.min(duration, 5)),
        type,
        level: Math.min(volume, 1),
      },
    ]);
  }

  /** An upward, springy “bloop”. */
  playToggleOn() {
    void this.play([
      {
        frequency: 420,
        endFrequency: 840,
        duration: 0.09,
        level: 0.5,
      },
      {
        frequency: 1050,
        duration: 0.045,
        delay: 0.045,
        level: 0.12,
      },
    ]);
  }

  /** A rounded downward “plop”, paired with toggle-on. */
  playToggleOff() {
    void this.play([
      {
        frequency: 720,
        endFrequency: 280,
        duration: 0.095,
        level: 0.5,
      },
    ]);
  }

  /** A crisp, two-part mechanical “tick”. */
  playClick() {
    void this.play([
      {
        frequency: 1500,
        endFrequency: 700,
        duration: 0.025,
        type: "triangle",
        level: 0.38,
      },
      {
        frequency: 480,
        endFrequency: 320,
        duration: 0.04,
        delay: 0.012,
        level: 0.3,
      },
    ]);
  }

  /** A soft, low “tok”, like tapping a hollow wooden key. */
  playTap() {
    void this.play([
      {
        frequency: 360,
        endFrequency: 170,
        duration: 0.07,
        level: 0.5,
      },
      {
        frequency: 900,
        endFrequency: 600,
        duration: 0.02,
        type: "triangle",
        level: 0.1,
      },
    ]);
  }

  /** A tiny glassy “ting”; intentionally quieter for frequent events. */
  playHover() {
    void this.play([
      {
        frequency: 1400,
        endFrequency: 1600,
        duration: 0.035,
        level: 0.18,
      },
    ]);
  }

  /** A short, ascending three-note reward. */
  playSuccess() {
    void this.play([
      { frequency: 523.25, duration: 0.11, level: 0.42 },
      {
        frequency: 659.25,
        duration: 0.11,
        delay: 0.075,
        level: 0.4,
      },
      {
        frequency: 783.99,
        duration: 0.16,
        delay: 0.15,
        level: 0.38,
      },
    ]);
  }

  dispose() {
    this.disposed = true;
    this.unsubscribe?.();
    this.stopAll();
    this.master?.disconnect();

    if (this.ctx && this.ctx.state !== "closed") {
      void this.ctx.close().catch(() => {});
    }

    this.master = null;
    this.ctx = null;
  }
}

export const sound = new SoundPlayer();

if (import.meta.hot) {
  import.meta.hot.dispose(() => sound.dispose());
}
