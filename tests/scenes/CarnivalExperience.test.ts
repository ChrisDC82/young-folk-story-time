import { describe, expect, it } from 'vitest';
import { carnivalHotspots } from '../../src/episodes/carnival-choices/transition';
import { CarnivalExperience } from '../../src/game/systems/CarnivalExperience';
import { GameStateManager } from '../../src/game/systems/GameStateManager';

function carnivalReadyState(): GameStateManager {
  const state = new GameStateManager();
  state.applyEffects([
    { key: 'openingChoice', operation: 'set', value: 'follow-angel' },
    { key: 'usedShortcut', operation: 'set', value: true },
    { key: 'costumeAttempts', operation: 'set', value: 3 },
    { key: 'costumeCompleted', operation: 'set', value: true },
  ]);
  return state;
}

describe('CarnivalExperience', () => {
  it('initializes Carnival with the episode-owned exploration hotspots', () => {
    const state = carnivalReadyState();
    const before = state.snapshot;

    const experience = new CarnivalExperience(state, carnivalHotspots);

    expect(experience.snapshot).toEqual({
      initialized: true,
      hotspotIds: ['steelpan-preview', 'carnival-banner', 'festival-flags'],
      visitedHotspotIds: [],
    });
    expect(state.snapshot).toEqual(before);
  });

  it('tracks hotspot visits without changing narrative state', () => {
    const state = carnivalReadyState();
    const experience = new CarnivalExperience(state, carnivalHotspots);
    const before = state.snapshot;

    const hotspot = experience.visit('steelpan-preview');

    expect(hotspot.reaction.speaker).toBe('Lexi');
    expect(experience.snapshot.visitedHotspotIds).toEqual(['steelpan-preview']);
    expect(state.snapshot).toEqual(before);
  });

  it('refuses to initialize before costume completion', () => {
    expect(() => new CarnivalExperience(new GameStateManager(), carnivalHotspots)).toThrow(
      'costume is complete',
    );
  });
});
