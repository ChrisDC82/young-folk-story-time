import { describe, expect, it } from 'vitest';
import { ccClubOpeningStory } from '../../src/episodes/carnival-choices/dialogue';
import { GameStateManager } from '../../src/game/systems/GameStateManager';
import { NarrativeEngine } from '../../src/game/systems/NarrativeEngine';

function advanceToOpeningDecision(engine: NarrativeEngine): void {
  while (engine.currentNode.id !== 'opening-decision') engine.advance();
}

describe('NarrativeEngine', () => {
  it('progresses through episode-owned dialogue to three choices', () => {
    const engine = new NarrativeEngine(ccClubOpeningStory, new GameStateManager());

    expect(engine.currentNode.id).toBe('lexi-prepares');
    advanceToOpeningDecision(engine);

    expect(engine.availableChoices.map((choice) => choice.id)).toEqual([
      'follow-junior',
      'follow-angel',
      'work-together',
    ]);
  });

  it.each([
    ['follow-junior', 'junior-reaction'],
    ['follow-angel', 'angel-reaction'],
    ['work-together', 'together-reaction'],
  ])('moves %s to its visibly distinct reaction node', (choiceId, reactionNodeId) => {
    const engine = new NarrativeEngine(ccClubOpeningStory, new GameStateManager());
    advanceToOpeningDecision(engine);

    engine.choose(choiceId);

    expect(engine.currentNode.id).toBe(reactionNodeId);
    expect(engine.currentNode.end).toBe(true);
  });

  it('keeps narrative state when a new scene-level engine uses the same manager', () => {
    const state = new GameStateManager();
    const firstSceneEngine = new NarrativeEngine(ccClubOpeningStory, state);
    advanceToOpeningDecision(firstSceneEngine);
    firstSceneEngine.choose('follow-angel');

    const nextSceneEngine = new NarrativeEngine(ccClubOpeningStory, state);

    expect(nextSceneEngine.currentNode.id).toBe('lexi-prepares');
    expect(state.get('usedShortcut')).toBe(true);
    expect(state.get('angelTrust')).toBe(1);
  });

  it('does not allow dialogue progression past a required choice', () => {
    const engine = new NarrativeEngine(ccClubOpeningStory, new GameStateManager());
    advanceToOpeningDecision(engine);

    expect(() => engine.advance()).toThrow('requires a choice');
  });
});
