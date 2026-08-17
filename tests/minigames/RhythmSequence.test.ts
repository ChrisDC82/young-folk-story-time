import { describe, expect, it } from 'vitest';
import { RhythmSequence } from '../../src/game/minigames/steelpan/RhythmSequence';
import type { PanZoneId } from '../../src/types/panJam';

const zones: readonly PanZoneId[] = ['sun', 'diamond', 'moon', 'heart'];

describe('RhythmSequence', () => {
  it('generates deterministic sequences of the requested length', () => {
    expect(RhythmSequence.generate(zones, 4, 19)).toEqual(RhythmSequence.generate(zones, 4, 19));
    expect(RhythmSequence.generate(zones, 4, 19)).toHaveLength(4);
  });

  it('uses only configured zones and avoids immediate repeats', () => {
    const sequence = RhythmSequence.generate(zones, 20, 7);

    expect(sequence.every((zone) => zones.includes(zone))).toBe(true);
    expect(sequence.every((zone, index) => index === 0 || zone !== sequence[index - 1])).toBe(true);
  });

  it('rejects unusable rhythm configuration', () => {
    expect(() => RhythmSequence.generate(['sun'], 2)).toThrow('two unique');
    expect(() => RhythmSequence.generate(zones, 0)).toThrow('positive integer');
  });
});
