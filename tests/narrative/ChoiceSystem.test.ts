import { describe, expect, it } from 'vitest';
import { openingChoices } from '../../src/episodes/carnival-choices/choices';
import { ChoiceSystem } from '../../src/game/systems/ChoiceSystem';
import { GameStateManager } from '../../src/game/systems/GameStateManager';
import type { StoryChoice } from '../../src/types/narrative';

describe('ChoiceSystem', () => {
  it.each([
    [
      'follow-junior',
      {
        angelTrust: 0,
        juniorTrust: 1,
        cooperation: 0,
        usedShortcut: false,
        followedInstructions: true,
        combinedIdeas: false,
        openingChoice: 'follow-junior',
        costumeAttempts: 0,
        costumeCompleted: false,
      },
    ],
    [
      'follow-angel',
      {
        angelTrust: 1,
        juniorTrust: 0,
        cooperation: 0,
        usedShortcut: true,
        followedInstructions: false,
        combinedIdeas: false,
        openingChoice: 'follow-angel',
        costumeAttempts: 0,
        costumeCompleted: false,
      },
    ],
    [
      'work-together',
      {
        angelTrust: 1,
        juniorTrust: 1,
        cooperation: 1,
        usedShortcut: false,
        followedInstructions: true,
        combinedIdeas: true,
        openingChoice: 'work-together',
        costumeAttempts: 0,
        costumeCompleted: false,
      },
    ],
  ])('applies the %s opening effects exactly once', (choiceId, expectedState) => {
    const state = new GameStateManager();

    ChoiceSystem.select(choiceId, openingChoices, state);

    expect(state.snapshot).toEqual(expectedState);
  });

  it('filters conditional choices from current state', () => {
    const choices: StoryChoice[] = [
      {
        id: 'always',
        label: 'Always',
        confirmation: 'Available.',
        next: 'end',
      },
      {
        id: 'trusted',
        label: 'Trusted',
        confirmation: 'Trust unlocked.',
        next: 'end',
        conditions: [{ key: 'angelTrust', operator: 'greater-than-or-equal', value: 1 }],
      },
    ];
    const state = new GameStateManager();

    expect(ChoiceSystem.availableChoices(choices, state.snapshot).map((choice) => choice.id)).toEqual(['always']);
    state.applyEffects([{ key: 'angelTrust', operation: 'add', value: 1 }]);
    expect(ChoiceSystem.availableChoices(choices, state.snapshot).map((choice) => choice.id)).toEqual([
      'always',
      'trusted',
    ]);
  });

  it('rejects a choice when its condition is not met', () => {
    const state = new GameStateManager();
    const lockedChoice: StoryChoice = {
      id: 'locked',
      label: 'Locked',
      confirmation: 'Unavailable.',
      next: 'end',
      conditions: [{ key: 'juniorTrust', operator: 'greater-than', value: 0 }],
    };

    expect(() => ChoiceSystem.select('locked', [lockedChoice], state)).toThrow('missing or unavailable');
  });
});
