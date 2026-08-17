import { describe, expect, it } from 'vitest';
import { panJamPlan } from '../../src/episodes/carnival-choices/panJam';
import { SteelpanGame } from '../../src/game/minigames/steelpan/SteelpanGame';
import { GameStateManager } from '../../src/game/systems/GameStateManager';
import type { PanInputResult, PanJamPlan, PanZoneId } from '../../src/types/panJam';

function playCurrent(game: SteelpanGame): PanInputResult {
  const sequence = game.beginPlayback();
  game.finishPlayback();
  let result: PanInputResult | undefined;
  sequence.forEach((zone) => {
    result = game.submitInput(zone);
  });
  if (!result) throw new Error('Test sequence unexpectedly had no notes.');
  return result;
}

function completeGame(game: SteelpanGame): PanInputResult {
  const sequenceCount = panJamPlan.tutorialSequences.length + panJamPlan.roundSequences.length;
  let result: PanInputResult | undefined;
  for (let index = 0; index < sequenceCount; index += 1) result = playCurrent(game);
  if (!result) throw new Error('Pan Jam plan unexpectedly had no sequences.');
  return result;
}

describe('SteelpanGame', () => {
  it('compares correct input incrementally', () => {
    const game = new SteelpanGame(new GameStateManager(), panJamPlan);
    const sequence = game.beginPlayback();
    game.finishPlayback();

    const result = game.submitInput(sequence[0]);

    expect(result.status).toBe('correct');
    expect(result.sequenceComplete).toBe(true);
  });

  it('reacts to an incorrect note immediately without advancing the pattern', () => {
    const plan: PanJamPlan = { tutorialSequences: [['sun', 'diamond']], roundSequences: [['heart', 'moon']] };
    const game = new SteelpanGame(new GameStateManager(), plan);
    game.beginPlayback();
    game.finishPlayback();
    game.submitInput('sun');

    const result = game.submitInput('heart');

    expect(result).toMatchObject({ status: 'incorrect', expectedZoneId: 'diamond', replayRecommended: true });
    expect(game.snapshot.expectedInputIndex).toBe(1);
  });

  it('counts mistakes invisibly in shared state', () => {
    const state = new GameStateManager();
    const game = new SteelpanGame(state, panJamPlan);
    game.beginPlayback();
    game.finishPlayback();

    game.submitInput('heart');
    game.beginPlayback();
    game.finishPlayback();
    game.submitInput('heart');

    expect(state.get('panMistakes')).toBe(2);
  });

  it('activates slower, longer assistance after repeated difficulty', () => {
    const plan: PanJamPlan = { tutorialSequences: [['sun', 'diamond']], roundSequences: [['heart', 'moon']] };
    const game = new SteelpanGame(new GameStateManager(), plan);
    game.beginPlayback();
    game.finishPlayback();
    game.submitInput('heart');
    game.beginPlayback();
    game.finishPlayback();
    game.submitInput('heart');

    expect(game.snapshot).toMatchObject({ assistLevel: 2, playbackIntervalMs: 900, cueDurationMs: 650 });
  });

  it('plays a difficult note together after three misses so progress is never blocked', () => {
    const plan: PanJamPlan = { tutorialSequences: [['sun', 'diamond']], roundSequences: [['heart', 'moon']] };
    const game = new SteelpanGame(new GameStateManager(), plan);
    game.beginPlayback();
    game.finishPlayback();
    game.submitInput('heart');
    game.submitInput('heart');

    const result = game.submitInput('heart');

    expect(result).toMatchObject({ status: 'assisted', expectedZoneId: 'sun' });
    expect(game.snapshot.expectedInputIndex).toBe(1);
  });

  it('advances and records each completed main round', () => {
    const state = new GameStateManager();
    const game = new SteelpanGame(state, panJamPlan);
    playCurrent(game);
    playCurrent(game);

    playCurrent(game);

    expect(state.get('panRoundsCompleted')).toBe(1);
    expect(game.snapshot.currentRound).toBe(2);
  });

  it('marks Pan Jam complete after all tutorial and main sequences', () => {
    const state = new GameStateManager();
    const game = new SteelpanGame(state, panJamPlan);

    const result = completeGame(game);

    expect(result.gameComplete).toBe(true);
    expect(state.snapshot).toMatchObject({ panRoundsCompleted: 3, panMistakes: 0, panCompleted: true });
  });

  it('slightly quickens later playback after strong performance', () => {
    const game = new SteelpanGame(new GameStateManager(), panJamPlan);
    playCurrent(game);
    playCurrent(game);
    playCurrent(game);

    expect(game.snapshot).toMatchObject({ strongPerformance: true, playbackIntervalMs: 520 });
  });

  it('preserves every earlier narrative and costume value', () => {
    const state = new GameStateManager();
    state.applyEffects([
      { key: 'angelTrust', operation: 'set', value: 2 },
      { key: 'juniorTrust', operation: 'set', value: 1 },
      { key: 'cooperation', operation: 'set', value: 1 },
      { key: 'usedShortcut', operation: 'set', value: true },
      { key: 'followedInstructions', operation: 'set', value: false },
      { key: 'combinedIdeas', operation: 'set', value: false },
      { key: 'openingChoice', operation: 'set', value: 'follow-angel' },
      { key: 'costumeAttempts', operation: 'set', value: 4 },
      { key: 'costumeCompleted', operation: 'set', value: true },
    ]);
    const before = state.snapshot;

    completeGame(new SteelpanGame(state, panJamPlan));

    expect(state.snapshot).toMatchObject({
      angelTrust: before.angelTrust,
      juniorTrust: before.juniorTrust,
      cooperation: before.cooperation,
      usedShortcut: before.usedShortcut,
      followedInstructions: before.followedInstructions,
      combinedIdeas: before.combinedIdeas,
      openingChoice: before.openingChoice,
      costumeAttempts: before.costumeAttempts,
      costumeCompleted: before.costumeCompleted,
    });
  });

  it('restarts only Pan Jam and preserves earlier story state', () => {
    const state = new GameStateManager();
    state.applyEffects([
      { key: 'openingChoice', operation: 'set', value: 'work-together' },
      { key: 'cooperation', operation: 'set', value: 1 },
      { key: 'costumeCompleted', operation: 'set', value: true },
    ]);
    const game = new SteelpanGame(state, panJamPlan);
    completeGame(game);

    game.restart();

    expect(state.snapshot).toMatchObject({
      openingChoice: 'work-together',
      cooperation: 1,
      costumeCompleted: true,
      panRoundsCompleted: 0,
      panMistakes: 0,
      panCompleted: false,
    });
    expect(game.snapshot).toMatchObject({ phase: 'ready', inTutorial: true, expectedInputIndex: 0 });
  });

  it('can finish entirely through guided assistance', () => {
    const state = new GameStateManager();
    const game = new SteelpanGame(state, panJamPlan);
    let lastResult: PanInputResult | undefined;
    const sequenceCount = panJamPlan.tutorialSequences.length + panJamPlan.roundSequences.length;
    for (let sequenceIndex = 0; sequenceIndex < sequenceCount; sequenceIndex += 1) {
      const sequence = game.beginPlayback();
      game.finishPlayback();
      sequence.forEach((expected) => {
        const wrong: PanZoneId = expected === 'heart' ? 'sun' : 'heart';
        game.submitInput(wrong);
        game.submitInput(wrong);
        lastResult = game.submitInput(wrong);
      });
    }

    expect(lastResult?.gameComplete).toBe(true);
    expect(state.get('panCompleted')).toBe(true);
  });
});
