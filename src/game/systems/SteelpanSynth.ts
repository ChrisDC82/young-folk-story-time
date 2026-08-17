import type { PanZoneDefinition } from '../../types/panJam';

export type AudioContextFactory = () => AudioContext;

function defaultAudioContextFactory(): AudioContext {
  const AudioContextClass = window.AudioContext;
  if (!AudioContextClass) throw new Error('Web Audio is not available in this browser.');
  return new AudioContextClass();
}

export class SteelpanSynth {
  private context?: AudioContext;

  constructor(
    private readonly isMuted: () => boolean,
    private readonly createContext: AudioContextFactory = defaultAudioContextFactory,
  ) {}

  unlock(): boolean {
    if (this.isMuted()) return false;
    try {
      const context = this.getContext();
      if (context.state === 'suspended') void context.resume();
      return true;
    } catch {
      return false;
    }
  }

  play(zone: PanZoneDefinition): boolean {
    if (this.isMuted()) return false;
    try {
      const context = this.getContext();
      if (context.state === 'suspended') void context.resume();
      const now = context.currentTime;
      const filter = context.createBiquadFilter();
      const master = context.createGain();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(4200, now);
      filter.Q.setValueAtTime(0.8, now);
      master.gain.setValueAtTime(0.0001, now);
      master.gain.exponentialRampToValueAtTime(0.34, now + 0.012);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 1.25);
      filter.connect(master);
      master.connect(context.destination);

      [
        { ratio: 1, gain: 0.85, type: 'sine' as OscillatorType },
        { ratio: 2.01, gain: 0.3, type: 'sine' as OscillatorType },
        { ratio: 3.97, gain: 0.12, type: 'triangle' as OscillatorType },
      ].forEach((partial, index) => {
        const oscillator = context.createOscillator();
        const partialGain = context.createGain();
        oscillator.type = partial.type;
        oscillator.frequency.setValueAtTime(zone.frequency * partial.ratio, now);
        oscillator.detune.setValueAtTime(index === 0 ? 0 : index * 2.5, now);
        partialGain.gain.setValueAtTime(partial.gain, now);
        partialGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.72 + index * 0.18);
        oscillator.connect(partialGain);
        partialGain.connect(filter);
        oscillator.start(now);
        oscillator.stop(now + 1.3);
        oscillator.addEventListener('ended', () => {
          oscillator.disconnect();
          partialGain.disconnect();
        }, { once: true });
      });
      return true;
    } catch {
      return false;
    }
  }

  close(): void {
    if (this.context && this.context.state !== 'closed') void this.context.close();
    this.context = undefined;
  }

  private getContext(): AudioContext {
    this.context ??= this.createContext();
    return this.context;
  }
}
