import { describe, expect, it } from 'vitest';
import { openingChoices } from '../../src/episodes/carnival-choices/choices';
import { nonShortcutCrisisStory, shortcutCrisisStory } from '../../src/episodes/carnival-choices/crisis';
import { mokoJumbieStory } from '../../src/episodes/carnival-choices/mokoJumbie';
import { ChoiceSystem } from '../../src/game/systems/ChoiceSystem';
import { GameStateManager } from '../../src/game/systems/GameStateManager';
import { NarrativeEngine } from '../../src/game/systems/NarrativeEngine';
import type { OpeningChoiceId } from '../../src/types/gameState';

function preparedState(openingChoice: OpeningChoiceId, mokoChoiceId: string): GameStateManager {
  const state = new GameStateManager();
  ChoiceSystem.select(openingChoice, openingChoices, state);
  state.applyEffects([
    { key: 'costumeAttempts', operation: 'set', value: 3 },
    { key: 'costumeCompleted', operation: 'set', value: true },
    { key: 'panRoundsCompleted', operation: 'set', value: 3 },
    { key: 'panMistakes', operation: 'set', value: 2 },
    { key: 'panCompleted', operation: 'set', value: true },
  ]);
  const moko = new NarrativeEngine(mokoJumbieStory, state);
  while (moko.currentNode.id !== 'lexi-emotional-choice') moko.advance();
  moko.choose(mokoChoiceId);
  return state;
}

function reachCrisisChoice(state: GameStateManager): NarrativeEngine {
  const story = state.get('usedShortcut') ? shortcutCrisisStory : nonShortcutCrisisStory;
  const engine = new NarrativeEngine(story, state);
  while (!engine.currentNode.choices?.length) engine.advance();
  return engine;
}

describe('Carnival Crisis story', () => {
  it('turns the shortcut into Lexi’s loose wing fastening', () => {
    const state = preparedState('follow-angel', 'stay-with-angel');
    const engine = reachCrisisChoice(state);

    expect(engine.currentNode.id).toBe('shortcut-crisis-choice');
    expect(state.snapshot).toMatchObject({
      usedShortcut: true,
      crisisTriggered: true,
      wingStrapBroke: true,
      nearbyCostumeProblem: false,
    });
    expect(engine.availableChoices).toHaveLength(4);
  });

  it('keeps Lexi’s wings intact and gives a nearby participant the non-shortcut problem', () => {
    const state = preparedState('work-together', 'ask-angel-high-trust');
    const engine = reachCrisisChoice(state);

    expect(engine.currentNode.id).toBe('non-shortcut-crisis-choice');
    expect(state.snapshot).toMatchObject({
      usedShortcut: false,
      crisisTriggered: true,
      wingStrapBroke: false,
      nearbyCostumeProblem: true,
    });
    expect(engine.availableChoices.map((choice) => choice.id)).toEqual([
      'crisis-blame',
      'crisis-repair-together',
      'crisis-ask-for-help',
    ]);
  });

  it('allows a high-trust Angel to admit the skipped step in exact child-facing language', () => {
    const state = preparedState('follow-angel', 'stay-with-angel');
    const engine = reachCrisisChoice(state);

    expect(engine.availableChoices.map((choice) => choice.id)).toContain('crisis-ask-angel-high-trust');
    engine.choose('crisis-ask-angel-high-trust');

    expect(state.snapshot).toMatchObject({ crisisChoice: 'ask-angel', angelAdmittedShortcut: true });
    expect(engine.currentNode.text).toBe('I skipped one of the steps.');
    expect(engine.advance().text).toBe('Thanks for telling me.');
  });

  it('lets a low-trust Angel hesitate without blocking the repair', () => {
    const state = preparedState('follow-angel', 'dismiss-angel-fear');
    const engine = reachCrisisChoice(state);

    expect(engine.availableChoices.map((choice) => choice.id)).toContain('crisis-ask-angel-low-trust');
    engine.choose('crisis-ask-angel-low-trust');

    expect(state.snapshot).toMatchObject({ crisisChoice: 'ask-angel', angelAdmittedShortcut: false });
    expect(engine.currentNode.id).toBe('angel-hesitates');
    expect(engine.advance()).toMatchObject({ id: 'lexi-keeps-repair-open', end: true });
  });

  it('keeps a previously dismissive Angel guarded even if later trust is high', () => {
    const state = preparedState('follow-angel', 'dismiss-angel-fear');
    state.applyEffects([{ key: 'angelTrust', operation: 'set', value: 2 }]);
    const engine = reachCrisisChoice(state);

    expect(engine.availableChoices.map((choice) => choice.id)).toContain('crisis-ask-angel-dismissed');
    expect(engine.availableChoices.map((choice) => choice.id)).not.toContain('crisis-ask-angel-high-trust');
  });

  it('records blame without changing cooperation', () => {
    const state = preparedState('follow-junior', 'stay-with-angel');
    const cooperationBefore = state.get('cooperation');
    const engine = reachCrisisChoice(state);

    engine.choose('crisis-blame');

    expect(state.snapshot).toMatchObject({ blamedSomeone: true, crisisChoice: 'blame' });
    expect(state.get('cooperation')).toBe(cooperationBefore);
    expect(engine.currentNode.id).toBe('blame-reaction');
  });

  it('records repairing together and raises cooperation by one', () => {
    const state = preparedState('work-together', 'stay-with-angel');
    const cooperationBefore = state.get('cooperation');
    const engine = reachCrisisChoice(state);

    engine.choose('crisis-repair-together');

    expect(state.snapshot).toMatchObject({ repairedMistakeTogether: true, crisisChoice: 'repair-together' });
    expect(state.get('cooperation')).toBe(cooperationBefore + 1);
  });

  it('preserves earlier help history and records crisis-specific help', () => {
    const state = preparedState('follow-junior', 'ask-junior-for-help');
    expect(state.get('askedForHelp')).toBe(true);
    const engine = reachCrisisChoice(state);

    engine.choose('crisis-ask-for-help');

    expect(state.snapshot).toMatchObject({
      askedForHelp: true,
      askedForCrisisHelp: true,
      crisisChoice: 'ask-for-help',
    });
  });

  it('preserves all Milestones 1–6 state when blame is selected', () => {
    const state = preparedState('follow-angel', 'stay-with-angel');
    const before = state.snapshot;
    reachCrisisChoice(state).choose('crisis-blame');

    const priorKeys = [
      'angelTrust', 'juniorTrust', 'cooperation', 'usedShortcut', 'followedInstructions', 'combinedIdeas',
      'openingChoice', 'costumeAttempts', 'costumeCompleted', 'panRoundsCompleted', 'panMistakes',
      'panCompleted', 'offeredToStayWithAngel', 'askedAngelWhatWasWrong', 'askedForHelp',
      'dismissedAngelFear', 'angelMokoResponse',
    ] as const;
    priorKeys.forEach((key) => expect(state.get(key)).toBe(before[key]));
  });

  it('clears every Carnival Crisis field on a full-story reset', () => {
    const state = preparedState('follow-angel', 'stay-with-angel');
    reachCrisisChoice(state).choose('crisis-ask-angel-high-trust');

    state.reset();

    expect(state.snapshot).toMatchObject({
      crisisTriggered: false,
      wingStrapBroke: false,
      nearbyCostumeProblem: false,
      blamedSomeone: false,
      repairedMistakeTogether: false,
      askedForCrisisHelp: false,
      angelAdmittedShortcut: false,
      crisisChoice: null,
      crisisResolved: false,
      repairAttempts: 0,
    });
  });
});
