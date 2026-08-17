import { describe, expect, it } from 'vitest';
import { reducedMotionRequested } from '../../src/game/systems/MotionPreference';

describe('MotionPreference', () => {
  it('accepts an explicit reduced-motion URL fallback', () => {
    expect(reducedMotionRequested('?motion=reduce')).toBe(true);
  });

  it('does not reduce motion for unrelated query parameters', () => {
    expect(reducedMotionRequested('?branch=angel')).toBe(false);
  });
});
