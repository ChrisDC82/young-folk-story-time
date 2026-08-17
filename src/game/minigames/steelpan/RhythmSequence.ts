import type { PanZoneId } from '../../../types/panJam';

export class RhythmSequence {
  static generate(zoneIds: readonly PanZoneId[], length: number, seed = 1): readonly PanZoneId[] {
    if (zoneIds.length < 2 || new Set(zoneIds).size !== zoneIds.length) {
      throw new Error('A rhythm needs at least two unique pan zones.');
    }
    if (!Number.isInteger(length) || length < 1) throw new Error('Rhythm length must be a positive integer.');

    let value = seed >>> 0;
    const sequence: PanZoneId[] = [];
    while (sequence.length < length) {
      value = (Math.imul(value, 1664525) + 1013904223) >>> 0;
      let index = value % zoneIds.length;
      if (sequence.length > 0 && zoneIds[index] === sequence[sequence.length - 1]) {
        index = (index + 1) % zoneIds.length;
      }
      sequence.push(zoneIds[index]);
    }
    return Object.freeze(sequence);
  }
}
