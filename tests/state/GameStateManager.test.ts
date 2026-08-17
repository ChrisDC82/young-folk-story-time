import { describe, expect, it } from 'vitest';
import { GameStateManager } from '../../src/game/systems/GameStateManager';

describe('GameStateManager', () => {
  it('starts with a fresh, private episode state', () => {
    const state = new GameStateManager();

    expect(state.snapshot).toEqual({
      angelTrust: 0,
      juniorTrust: 0,
      cooperation: 0,
      usedShortcut: false,
      followedInstructions: false,
      combinedIdeas: false,
      openingChoice: null,
      costumeAttempts: 0,
      costumeCompleted: false,
      panRoundsCompleted: 0,
      panMistakes: 0,
      panCompleted: false,
    });
  });

  it('adds and sets typed state effects without resetting unrelated trust', () => {
    const state = new GameStateManager();
    state.applyEffects([
      { key: 'angelTrust', operation: 'add', value: 1 },
      { key: 'usedShortcut', operation: 'set', value: true },
    ]);
    state.applyEffects([{ key: 'juniorTrust', operation: 'add', value: 2 }]);

    expect(state.get('angelTrust')).toBe(1);
    expect(state.get('juniorTrust')).toBe(2);
    expect(state.get('usedShortcut')).toBe(true);
  });

  it('clears episode progress on reset', () => {
    const state = new GameStateManager();
    state.applyEffects([
      { key: 'cooperation', operation: 'add', value: 1 },
      { key: 'openingChoice', operation: 'set', value: 'work-together' },
    ]);

    state.reset();

    expect(state.get('cooperation')).toBe(0);
    expect(state.get('openingChoice')).toBeNull();
    expect(state.get('costumeAttempts')).toBe(0);
    expect(state.get('costumeCompleted')).toBe(false);
    expect(state.get('panRoundsCompleted')).toBe(0);
    expect(state.get('panCompleted')).toBe(false);
  });
});
