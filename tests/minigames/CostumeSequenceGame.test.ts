import { describe, expect, it } from 'vitest';
import { costumeStepOrder } from '../../src/episodes/carnival-choices/costume';
import { CostumeSequenceGame } from '../../src/game/minigames/costume/CostumeSequenceGame';
import { GameStateManager } from '../../src/game/systems/GameStateManager';
import type { CostumeMoveResult, CostumeStepId } from '../../src/types/minigames';

const incorrectOrder: readonly CostumeStepId[] = ['colour', 'shape', 'decorate', 'attach'];

function submit(game: CostumeSequenceGame, order: readonly CostumeStepId[]): CostumeMoveResult {
  let result: CostumeMoveResult = { status: 'in-progress' };
  order.forEach((stepId, index) => {
    result = game.place(stepId, index);
  });
  return result;
}

describe('CostumeSequenceGame', () => {
  it('accepts the correct four-step sequence', () => {
    const game = new CostumeSequenceGame(new GameStateManager(), costumeStepOrder);

    const result = submit(game, costumeStepOrder);

    expect(result.status).toBe('completed');
    expect(result.submittedOrder).toEqual(costumeStepOrder);
  });

  it('gently resets the board data after an incorrect sequence', () => {
    const game = new CostumeSequenceGame(new GameStateManager(), costumeStepOrder);

    const result = submit(game, incorrectOrder);

    expect(result.status).toBe('incorrect');
    expect(result.submittedOrder).toEqual(incorrectOrder);
    expect(game.snapshot.slots).toEqual([null, null, null, null]);
  });

  it('counts every submitted sequence attempt invisibly', () => {
    const state = new GameStateManager();
    const game = new CostumeSequenceGame(state, costumeStepOrder);

    submit(game, incorrectOrder);
    submit(game, incorrectOrder);
    submit(game, costumeStepOrder);

    expect(state.get('costumeAttempts')).toBe(3);
  });

  it('activates a progressive hint after repeated difficulty', () => {
    const game = new CostumeSequenceGame(new GameStateManager(), costumeStepOrder);

    submit(game, incorrectOrder);
    expect(game.snapshot.hintActive).toBe(false);
    submit(game, incorrectOrder);

    expect(game.snapshot).toMatchObject({ hintActive: true, hintStepId: 'shape', hintSlotIndex: 0 });
    game.place('shape', 0);
    expect(game.snapshot).toMatchObject({ hintActive: true, hintStepId: 'colour', hintSlotIndex: 1 });
  });

  it('marks costumeCompleted only after successful completion', () => {
    const state = new GameStateManager();
    const game = new CostumeSequenceGame(state, costumeStepOrder);

    submit(game, incorrectOrder);
    expect(state.get('costumeCompleted')).toBe(false);
    submit(game, costumeStepOrder);

    expect(state.get('costumeCompleted')).toBe(true);
  });

  it('preserves all opening narrative state across the mini-game', () => {
    const state = new GameStateManager();
    state.applyEffects([
      { key: 'angelTrust', operation: 'add', value: 1 },
      { key: 'usedShortcut', operation: 'set', value: true },
      { key: 'openingChoice', operation: 'set', value: 'follow-angel' },
    ]);
    const before = state.snapshot;

    submit(new CostumeSequenceGame(state, costumeStepOrder), costumeStepOrder);

    expect(state.snapshot).toMatchObject({
      angelTrust: before.angelTrust,
      juniorTrust: before.juniorTrust,
      cooperation: before.cooperation,
      usedShortcut: true,
      followedInstructions: before.followedInstructions,
      combinedIdeas: before.combinedIdeas,
      openingChoice: 'follow-angel',
      costumeCompleted: true,
    });
  });

  it('resets board placement without clearing attempts or narrative state', () => {
    const state = new GameStateManager();
    state.applyEffects([
      { key: 'juniorTrust', operation: 'add', value: 1 },
      { key: 'openingChoice', operation: 'set', value: 'follow-junior' },
    ]);
    const game = new CostumeSequenceGame(state, costumeStepOrder);
    submit(game, incorrectOrder);
    game.place('shape', 0);

    game.resetBoard();

    expect(game.snapshot.slots).toEqual([null, null, null, null]);
    expect(state.get('costumeAttempts')).toBe(1);
    expect(state.get('openingChoice')).toBe('follow-junior');
    expect(state.get('juniorTrust')).toBe(1);
  });

  it('restarts only costume progress and preserves the earlier choice', () => {
    const state = new GameStateManager();
    state.applyEffects([
      { key: 'angelTrust', operation: 'add', value: 1 },
      { key: 'juniorTrust', operation: 'add', value: 1 },
      { key: 'cooperation', operation: 'add', value: 1 },
      { key: 'combinedIdeas', operation: 'set', value: true },
      { key: 'openingChoice', operation: 'set', value: 'work-together' },
    ]);
    const game = new CostumeSequenceGame(state, costumeStepOrder);
    submit(game, costumeStepOrder);

    game.restartChallenge();

    expect(state.snapshot).toMatchObject({
      angelTrust: 1,
      juniorTrust: 1,
      cooperation: 1,
      combinedIdeas: true,
      openingChoice: 'work-together',
      costumeAttempts: 0,
      costumeCompleted: false,
    });
    expect(game.snapshot.slots).toEqual([null, null, null, null]);
  });
});
