import { describe, expect, it } from 'vitest';
import { openingChoices } from '../../src/episodes/carnival-choices/choices';
import { costumeStepOrder } from '../../src/episodes/carnival-choices/costume';
import { CostumeSequenceGame } from '../../src/game/minigames/costume/CostumeSequenceGame';
import { ChoiceSystem } from '../../src/game/systems/ChoiceSystem';
import { GameStateManager } from '../../src/game/systems/GameStateManager';
import { StoryProgression } from '../../src/game/systems/StoryProgression';
import { INITIAL_CARNIVAL_GAME_STATE, type OpeningChoiceId } from '../../src/types/gameState';

function completeCostume(state: GameStateManager, choiceId: OpeningChoiceId = 'follow-angel'): void {
  ChoiceSystem.select(choiceId, openingChoices, state);
  const costume = new CostumeSequenceGame(state, costumeStepOrder);
  costumeStepOrder.forEach((stepId, index) => costume.place(stepId, index));
}

describe('StoryProgression', () => {
  it('allows completed costume play to transition into Story Time', () => {
    const state = new GameStateManager();
    const progression = new StoryProgression(state);
    completeCostume(state);
    progression.enterCostume();

    expect(progression.enterStoryTime()).toBe('story-time');
  });

  it.each<OpeningChoiceId>(['follow-junior', 'follow-angel', 'work-together'])(
    'preserves every narrative value across Story Time for %s',
    (choiceId) => {
      const state = new GameStateManager();
      const progression = new StoryProgression(state);
      completeCostume(state, choiceId);
      const before = state.snapshot;

      progression.enterCostume();
      progression.enterStoryTime();

      expect(state.snapshot).toEqual(before);
    },
  );

  it('preserves usedShortcut unchanged through Carnival arrival', () => {
    const state = new GameStateManager();
    const progression = new StoryProgression(state);
    completeCostume(state, 'follow-angel');
    progression.enterCostume();
    progression.enterStoryTime();
    progression.arriveAtCarnival();

    expect(state.get('usedShortcut')).toBe(true);
  });

  it('preserves costumeAttempts unchanged through Carnival arrival', () => {
    const state = new GameStateManager();
    const progression = new StoryProgression(state);
    ChoiceSystem.select('work-together', openingChoices, state);
    state.applyEffects([
      { key: 'costumeAttempts', operation: 'set', value: 4 },
      { key: 'costumeCompleted', operation: 'set', value: true },
    ]);
    progression.enterCostume();
    progression.enterStoryTime();
    progression.arriveAtCarnival();

    expect(state.get('costumeAttempts')).toBe(4);
  });

  it('reaches an initialized Carnival stage only after Story Time', () => {
    const state = new GameStateManager();
    const progression = new StoryProgression(state);
    completeCostume(state, 'follow-junior');
    progression.enterCostume();
    progression.enterStoryTime();

    expect(progression.arriveAtCarnival()).toBe('carnival');
    expect(progression.carnivalReady).toBe(true);
  });

  it('restarting the full story clears all state and returns to the club', () => {
    const state = new GameStateManager();
    const progression = new StoryProgression(state);
    completeCostume(state, 'work-together');
    progression.enterCostume();
    progression.enterStoryTime();
    progression.arriveAtCarnival();

    progression.startNewStory();

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
      offeredToStayWithAngel: false,
      askedAngelWhatWasWrong: false,
      askedForHelp: false,
      dismissedAngelFear: false,
      angelMokoResponse: null,
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
    expect(progression.currentStage).toBe('club');
  });

  it('contains only the implemented typed run state through Milestone 8', () => {
    const keys = Object.keys(new GameStateManager().snapshot).sort();

    expect(keys).toEqual([
      'angelAdmittedShortcut',
      'angelMokoResponse',
      'angelTrust',
      'askedAngelWhatWasWrong',
      'askedForCrisisHelp',
      'askedForHelp',
      'blamedSomeone',
      'combinedIdeas',
      'cooperation',
      'costumeAttempts',
      'costumeCompleted',
      'crisisChoice',
      'crisisResolved',
      'crisisTriggered',
      'dismissedAngelFear',
      'followedInstructions',
      'juniorTrust',
      'nearbyCostumeProblem',
      'offeredToStayWithAngel',
      'openingChoice',
      'panCompleted',
      'panMistakes',
      'panRoundsCompleted',
      'repairAttempts',
      'repairedMistakeTogether',
      'usedShortcut',
      'wingStrapBroke',
    ]);
  });

  it('guards Pan Jam entry and Milestone 5 completion', () => {
    const state = new GameStateManager();
    const progression = new StoryProgression(state);
    completeCostume(state, 'work-together');
    progression.enterCostume();
    progression.enterStoryTime();
    progression.arriveAtCarnival();

    expect(progression.enterPanJam()).toBe('pan-jam');
    expect(() => progression.completeMilestone5()).toThrow('rounds must be complete');
    state.applyEffects([{ key: 'panCompleted', operation: 'set', value: true }]);
    expect(progression.completeMilestone5()).toBe('milestone-5-complete');
  });

  it('guards the Moko Jumbie scene and Milestone 6 endpoint', () => {
    const state = new GameStateManager();
    const progression = new StoryProgression(state);
    completeCostume(state, 'follow-angel');
    progression.enterCostume();
    progression.enterStoryTime();
    progression.arriveAtCarnival();
    progression.enterPanJam();
    state.applyEffects([{ key: 'panCompleted', operation: 'set', value: true }]);
    progression.completeMilestone5();

    expect(progression.enterMokoJumbie()).toBe('moko-jumbie');
    expect(progression.mokoJumbieReady).toBe(true);
    expect(() => progression.completeMilestone6()).toThrow('must receive a response');
    state.applyEffects([{ key: 'angelMokoResponse', operation: 'set', value: 'staying-close' }]);
    expect(progression.completeMilestone6()).toBe('milestone-6-complete');
  });

  it('guards Carnival Crisis entry and Milestone 7 completion', () => {
    const state = new GameStateManager();
    const progression = new StoryProgression(state);
    completeCostume(state, 'follow-angel');
    progression.enterCostume();
    progression.enterStoryTime();
    progression.arriveAtCarnival();
    progression.enterPanJam();
    state.applyEffects([
      { key: 'panCompleted', operation: 'set', value: true },
      { key: 'angelMokoResponse', operation: 'set', value: 'staying-close' },
    ]);
    progression.completeMilestone5();
    progression.enterMokoJumbie();
    progression.completeMilestone6();

    expect(progression.enterCarnivalCrisis()).toBe('carnival-crisis');
    expect(progression.carnivalCrisisReady).toBe(true);
    expect(() => progression.completeMilestone7()).toThrow('choice and repair must be complete');
    state.applyEffects([
      { key: 'crisisTriggered', operation: 'set', value: true },
      { key: 'crisisChoice', operation: 'set', value: 'repair-together' },
      { key: 'crisisResolved', operation: 'set', value: true },
    ]);
    expect(progression.completeMilestone7()).toBe('milestone-7-complete');
  });

  it('guards ending entry, Story Card completion, and full replay reset', () => {
    const state = new GameStateManager();
    const progression = new StoryProgression(state);
    expect(() => progression.enterEnding()).toThrow('Carnival Crisis must be resolved');

    completeCostume(state, 'work-together');
    progression.enterCostume();
    progression.enterStoryTime();
    progression.arriveAtCarnival();
    progression.enterPanJam();
    state.applyEffects([
      { key: 'panCompleted', operation: 'set', value: true },
      { key: 'angelMokoResponse', operation: 'set', value: 'accepted-explanation' },
    ]);
    progression.completeMilestone5();
    progression.enterMokoJumbie();
    progression.completeMilestone6();
    progression.enterCarnivalCrisis();
    state.applyEffects([
      { key: 'crisisTriggered', operation: 'set', value: true },
      { key: 'crisisChoice', operation: 'set', value: 'repair-together' },
      { key: 'crisisResolved', operation: 'set', value: true },
    ]);
    progression.completeMilestone7();

    expect(progression.enterEnding()).toBe('ending');
    expect(progression.endingReady).toBe(true);
    expect(progression.completeMilestone8()).toBe('milestone-8-complete');
    expect(progression.startNewStory()).toBe('club');
    expect(state.snapshot).toEqual(INITIAL_CARNIVAL_GAME_STATE);
  });
});
