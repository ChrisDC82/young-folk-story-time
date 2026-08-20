import type { PanZoneDefinition } from '../../types/panJam';

export type AudioContextFactory = () => AudioContext;

export interface SteelpanPartial {
  ratio: number;
  gain: number;
  decaySeconds: number;
  type: OscillatorType;
  detuneCents: number;
  route: 'body' | 'strike';
}

export const STEELPAN_PARTIALS: readonly SteelpanPartial[] = Object.freeze([
  { ratio: 1, gain: 0.66, decaySeconds: 1.18, type: 'sine', detuneCents: 0, route: 'body' },
  { ratio: 2.76, gain: 0.34, decaySeconds: 0.78, type: 'sine', detuneCents: 2.5, route: 'body' },
  { ratio: 4.11, gain: 0.23, decaySeconds: 0.61, type: 'sine', detuneCents: -3, route: 'body' },
  { ratio: 5.43, gain: 0.14, decaySeconds: 0.46, type: 'triangle', detuneCents: 4, route: 'body' },
  { ratio: 6.79, gain: 0.08, decaySeconds: 0.34, type: 'sine', detuneCents: -4.5, route: 'body' },
  { ratio: 9.17, gain: 0.2, decaySeconds: 0.052, type: 'triangle', detuneCents: 7, route: 'strike' },
]);

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
      const bodyFilter = context.createBiquadFilter();
      const strikeFilter = context.createBiquadFilter();
      const master = context.createGain();
      bodyFilter.type = 'lowpass';
      bodyFilter.frequency.setValueAtTime(6500, now);
      bodyFilter.Q.setValueAtTime(1.15, now);
      strikeFilter.type = 'highpass';
      strikeFilter.frequency.setValueAtTime(1650, now);
      strikeFilter.Q.setValueAtTime(0.72, now);
      master.gain.setValueAtTime(0.0001, now);
      master.gain.exponentialRampToValueAtTime(0.3, now + 0.003);
      master.gain.exponentialRampToValueAtTime(0.22, now + 0.035);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 1.32);
      bodyFilter.connect(master);
      strikeFilter.connect(master);
      master.connect(context.destination);

      STEELPAN_PARTIALS.forEach((partial) => {
        const oscillator = context.createOscillator();
        const partialGain = context.createGain();
        oscillator.type = partial.type;
        oscillator.frequency.setValueAtTime(zone.frequency * partial.ratio, now);
        oscillator.detune.setValueAtTime(partial.detuneCents, now);
        partialGain.gain.setValueAtTime(0.0001, now);
        partialGain.gain.exponentialRampToValueAtTime(
          partial.gain,
          now + (partial.route === 'strike' ? 0.001 : 0.0025),
        );
        partialGain.gain.exponentialRampToValueAtTime(0.0001, now + partial.decaySeconds);
        oscillator.connect(partialGain);
        partialGain.connect(partial.route === 'strike' ? strikeFilter : bodyFilter);
        oscillator.start(now);
        oscillator.stop(now + Math.max(0.08, partial.decaySeconds + 0.08));
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
