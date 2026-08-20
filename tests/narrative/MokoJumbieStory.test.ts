import { describe, expect, it } from 'vitest';
import { openingChoices } from '../../src/episodes/carnival-choices/choices';
import { mokoJumbieStory } from '../../src/episodes/carnival-choices/mokoJumbie';
import { ChoiceSystem } from '../../src/game/systems/ChoiceSystem';
import { GameStateManager } from '../../src/game/systems/GameStateManager';
import { NarrativeEngine } from '../../src/game/systems/NarrativeEngine';
import type { OpeningChoiceId } from '../../src/types/gameState';

const PRIOR_STATE_KEYS = [
  'juniorTrust',
  'usedShortcut',
  'followedInstructions',
  'combinedIdeas',
  'openingChoice',
  'costumeAttempts',
  'costumeCompleted',
  'panRoundsCompleted',
  'panMistakes',
  'panCompleted',
] as const;

function milestoneFiveState(choiceId: OpeningChoiceId = 'follow-angel'): GameStateManager {
  const state = new GameStateManager();
  ChoiceSystem.select(choiceId, openingChoices, state);
  state.applyEffects([
    { key: 'costumeAttempts', operation: 'set', value: 3 },
    { key: 'costumeCompleted', operation: 'set', value: true },
    { key: 'panRoundsCompleted', operation: 'set', value: 3 },
    { key: 'panMistakes', operation: 'set', value: 2 },
    { key: 'panCompleted', operation: 'set', value: true },
  ]);
  return state;
}

function reachEmotionalChoice(state: GameStateManager): NarrativeEngine {
  const engine = new NarrativeEngine(mokoJumbieStory, state);
  while (engine.currentNode.id !== 'lexi-emotional-choice') engine.advance();
  return engine;
}

describe('Moko Jumbie emotional sequence', () => {
  it('presents exactly four emotional choices at both trust levels', () => {
    const lowTrust = reachEmotionalChoice(milestoneFiveState('follow-junior'));
    const highTrust = reachEmotionalChoice(milestoneFiveState('follow-angel'));

    expect(lowTrust.availableChoices.map((choice) => choice.id)).toEqual([
      'dismiss-angel-fear',
      'stay-with-angel',
      'ask-angel-low-trust',
      'ask-junior-for-help',
    ]);
    expect(highTrust.availableChoices.map((choice) => choice.id)).toEqual([
      'dismiss-angel-fear',
      'stay-with-angel',
      'ask-angel-high-trust',
      'ask-junior-for-help',
    ]);
    expect(lowTrust.availableChoices[2].label).toBe(highTrust.availableChoices[2].label);
  });

  it('reduces Angel trust and records a defensive reaction when fear is dismissed', () => {
    const state = milestoneFiveState('follow-angel');
    const trustBefore = state.get('angelTrust');
    const engine = reachEmotionalChoice(state);

    engine.choose('dismiss-angel-fear');

    expect(state.get('angelTrust')).toBe(trustBefore - 1);
    expect(state.get('dismissedAngelFear')).toBe(true);
    expect(state.get('angelMokoResponse')).toBe('defensive');
    expect(engine.currentNode.id).toBe('angel-defensive');
  });

  it('increases Angel trust and records the offer to stay', () => {
    const state = milestoneFiveState('follow-junior');
    const trustBefore = state.get('angelTrust');
    const engine = reachEmotionalChoice(state);

    engine.choose('stay-with-angel');

    expect(state.get('angelTrust')).toBe(trustBefore + 1);
    expect(state.get('offeredToStayWithAngel')).toBe(true);
    expect(state.get('angelMokoResponse')).toBe('staying-close');
    expect(engine.currentNode.id).toBe('angel-stays-close');
  });

  it('allows a high-trust Angel to disclose that the height worries her', () => {
    const state = milestoneFiveState('work-together');
    const engine = reachEmotionalChoice(state);

    engine.choose('ask-angel-high-trust');

    expect(state.get('askedAngelWhatWasWrong')).toBe(true);
    expect(state.get('angelMokoResponse')).toBe('shared-height-fear');
    expect(engine.currentNode).toMatchObject({ id: 'angel-shares-height-fear', text: 'They too tall.' });
    expect(engine.advance().id).toBe('lexi-respects-distance');
  });

  it('allows a low-trust Angel to reveal less', () => {
    const state = milestoneFiveState('follow-junior');
    const engine = reachEmotionalChoice(state);

    engine.choose('ask-angel-low-trust');

    expect(state.get('askedAngelWhatWasWrong')).toBe(true);
    expect(state.get('angelMokoResponse')).toBe('withheld-fear');
    expect(engine.currentNode).toMatchObject({ id: 'angel-withholds-fear', text: 'Nothing. I just do not feel like going closer.' });
  });

  it('raises cooperation and records asking Junior for help', () => {
    const state = milestoneFiveState('work-together');
    const cooperationBefore = state.get('cooperation');
    const engine = reachEmotionalChoice(state);

    engine.choose('ask-junior-for-help');

    expect(state.get('cooperation')).toBe(cooperationBefore + 1);
    expect(state.get('askedForHelp')).toBe(true);
    expect(state.get('angelMokoResponse')).toBe('accepted-explanation');
    expect(engine.currentNode.id).toBe('junior-explains');
    expect(engine.advance().id).toBe('angel-accepts-explanation');
  });

  it.each<OpeningChoiceId>(['follow-junior', 'follow-angel', 'work-together'])(
    'preserves all Milestones 1–5 progress for the %s branch',
    (choiceId) => {
      const state = milestoneFiveState(choiceId);
      const before = state.snapshot;
      const engine = reachEmotionalChoice(state);
      engine.choose(choiceId === 'follow-junior' ? 'ask-angel-low-trust' : 'ask-angel-high-trust');

      PRIOR_STATE_KEYS.forEach((key) => expect(state.get(key)).toBe(before[key]));
      expect(state.get('angelTrust')).toBe(before.angelTrust);
      expect(state.get('cooperation')).toBe(before.cooperation);
    },
  );

  it('resets all Moko Jumbie emotional state with a new story', () => {
    const state = milestoneFiveState();
    reachEmotionalChoice(state).choose('ask-junior-for-help');

    state.reset();

    expect(state.snapshot).toMatchObject({
      offeredToStayWithAngel: false,
      askedAngelWhatWasWrong: false,
      askedForHelp: false,
      dismissedAngelFear: false,
      angelMokoResponse: null,
    });
  });

  it('does not introduce or trigger Carnival Crisis state', () => {
    const state = milestoneFiveState();
    reachEmotionalChoice(state).choose('stay-with-angel');

    expect(Object.keys(state.snapshot)).not.toContain('carnivalCrisisTriggered');
    expect(Object.keys(state.snapshot)).not.toContain('wingStrapBroken');
  });
});
