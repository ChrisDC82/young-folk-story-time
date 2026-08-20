import { describe, expect, it } from 'vitest';
import { panZones } from '../../src/episodes/carnival-choices/panJam';
import { STEELPAN_PARTIALS, SteelpanSynth } from '../../src/game/systems/SteelpanSynth';

describe('SteelpanSynth', () => {
  it('uses a short strike transient and inharmonic ringing partials', () => {
    const strike = STEELPAN_PARTIALS.filter((partial) => partial.route === 'strike');
    const body = STEELPAN_PARTIALS.filter((partial) => partial.route === 'body');

    expect(strike).toHaveLength(1);
    expect(strike[0].decaySeconds).toBeLessThanOrEqual(0.06);
    expect(strike[0].ratio).toBeGreaterThan(8);
    expect(body).toHaveLength(5);
    expect(body.slice(1).every((partial) => Math.abs(partial.ratio - Math.round(partial.ratio)) >= 0.1)).toBe(true);
    expect(body[0]).toMatchObject({ ratio: 1, decaySeconds: 1.18 });
  });

  it('does not create or play Web Audio while global mute is active', () => {
    let contextCreations = 0;
    const synth = new SteelpanSynth(
      () => true,
      () => {
        contextCreations += 1;
        throw new Error('Muted audio should not request a context.');
      },
    );

    expect(synth.unlock()).toBe(false);
    expect(synth.play(panZones[0])).toBe(false);
    expect(contextCreations).toBe(0);
  });
});
