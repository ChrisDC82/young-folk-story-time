import { describe, expect, it } from 'vitest';
import { panZones } from '../../src/episodes/carnival-choices/panJam';
import { SteelpanSynth } from '../../src/game/systems/SteelpanSynth';

describe('SteelpanSynth', () => {
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
