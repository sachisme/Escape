import { Injectable } from '@angular/core';

export type TrackKey = 'background' | 'freedom';

interface TrackConfig {
  file: string;
  volume: number;
}

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private _muted = false;
  private audioContext: AudioContext | null = null;

  private readonly audioA: HTMLAudioElement;
  private readonly audioB: HTMLAudioElement;
  private activeAudio: HTMLAudioElement;
  private currentTrackKey: TrackKey | null = null;
  private fadeFrameId: number | null = null;

  private readonly tracks: Record<TrackKey, TrackConfig> = {
    background: { file: 'background.mp3', volume: 0.1 },
    freedom:    { file: 'freedom.mp3',    volume: 0.2 }
  };

  private readonly crossfadeMs = 500;

  constructor() {
    this.audioA = this.createAudio();
    this.audioB = this.createAudio();
    this.activeAudio = this.audioA;
  }

  private createAudio(): HTMLAudioElement {
    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0;
    audio.preload = 'auto';
    return audio;
  }

  get muted(): boolean {
    return this._muted;
  }

  get currentTrack(): TrackKey | null {
    return this.currentTrackKey;
  }

  playTrack(key: TrackKey): void {
    if (this.currentTrackKey === key) {
      return;
    }

    const config = this.tracks[key];
    const url = `assets/audio/${encodeURIComponent(config.file)}`;
    const previous = this.activeAudio;
    const next = previous === this.audioA ? this.audioB : this.audioA;

    if (!next.src.endsWith(url)) {
      next.src = url;
    }
    next.loop = true;
    next.currentTime = 0;
    next.volume = 0;

    if (this._muted) {
      previous.pause();
    } else {
      next.play().catch(() => {});
      this.crossfade(previous, next, config.volume, this.crossfadeMs);
    }

    this.activeAudio = next;
    this.currentTrackKey = key;
  }

  toggle(): void {
    this._muted = !this._muted;
    if (this.currentTrackKey === null) {
      return;
    }

    const config = this.tracks[this.currentTrackKey];
    if (this._muted) {
      this.fadeVolume(this.activeAudio, 0, 250, () => {
        this.activeAudio.pause();
      });
    } else {
      this.activeAudio.volume = 0;
      this.activeAudio.play().catch(() => {});
      this.fadeVolume(this.activeAudio, config.volume, 250);
    }
  }

  play(): void {
    if (this._muted) {
      return;
    }
    if (this.currentTrackKey === null) {
      this.playTrack('background');
      return;
    }
    this.activeAudio.play().catch(() => {});
  }

  pause(): void {
    this.activeAudio.pause();
  }

  stop(): void {
    if (this.currentTrackKey === null) {
      return;
    }
    const target = this.activeAudio;
    this.fadeVolume(target, 0, 400, () => {
      target.pause();
      target.currentTime = 0;
    });
    this.currentTrackKey = null;
  }

  private crossfade(
    out: HTMLAudioElement,
    into: HTMLAudioElement,
    targetIn: number,
    durationMs: number
  ): void {
    const startOut = out.volume;
    const startIn = into.volume;
    const startTime = performance.now();

    if (this.fadeFrameId !== null) {
      cancelAnimationFrame(this.fadeFrameId);
    }

    const step = () => {
      const elapsed = performance.now() - startTime;
      const t = Math.min(elapsed / durationMs, 1);
      out.volume = this.clamp(startOut + (0 - startOut) * t);
      into.volume = this.clamp(startIn + (targetIn - startIn) * t);
      if (t < 1) {
        this.fadeFrameId = requestAnimationFrame(step);
      } else {
        out.volume = 0;
        out.pause();
        into.volume = this.clamp(targetIn);
        this.fadeFrameId = null;
      }
    };

    this.fadeFrameId = requestAnimationFrame(step);
  }

  private fadeVolume(
    audio: HTMLAudioElement,
    target: number,
    durationMs: number,
    onComplete?: () => void
  ): void {
    const start = audio.volume;
    const startTime = performance.now();

    if (this.fadeFrameId !== null) {
      cancelAnimationFrame(this.fadeFrameId);
    }

    const step = () => {
      const elapsed = performance.now() - startTime;
      const t = Math.min(elapsed / durationMs, 1);
      audio.volume = this.clamp(start + (target - start) * t);
      if (t < 1) {
        this.fadeFrameId = requestAnimationFrame(step);
      } else {
        audio.volume = this.clamp(target);
        onComplete?.();
        this.fadeFrameId = null;
      }
    };

    this.fadeFrameId = requestAnimationFrame(step);
  }

  private clamp(value: number): number {
    if (value < 0) return 0;
    if (value > 1) return 1;
    return value;
  }

  private initAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  playClick(): void {
    try {
      const ctx = this.initAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  }

  playSuccess(): void {
    try {
      const ctx = this.initAudioContext();
      const notes = [523, 659, 784];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        const startTime = ctx.currentTime + (i * 0.1);
        gain.gain.setValueAtTime(0.15, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);
        osc.start(startTime);
        osc.stop(startTime + 0.4);
      });
    } catch (e) {}
  }

  playError(): void {
    try {
      const ctx = this.initAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 200;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  }

  playUnlock(): void {
    try {
      const ctx = this.initAudioContext();
      const notes = [440, 554, 659, 784, 880];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        const startTime = ctx.currentTime + (i * 0.08);
        gain.gain.setValueAtTime(0.12, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);
        osc.start(startTime);
        osc.stop(startTime + 0.2);
      });
    } catch (e) {}
  }

  playVictory(): void {
    try {
      const ctx = this.initAudioContext();
      const notes = [523, 659, 784, 1047];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        const startTime = ctx.currentTime + (i * 0.15);
        gain.gain.setValueAtTime(0.15, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);
        osc.start(startTime);
        osc.stop(startTime + 0.5);
      });
    } catch (e) {}
  }
}
