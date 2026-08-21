import { describe, expect, it } from 'vitest';
import { CarnivalCrisisRepair } from '../../src/game/minigames/crisis/CarnivalCrisisRepair';
import { GameStateManager } from '../../src/game/systems/GameStateManager';

function crisisReadyState(): GameStateManager {
  const state = new GameStateManager();
  state.applyEffects([
    { key: 'angelTrust', operation: 'set', value: 2 },
    { key: 'juniorTrust', operation: 'set', value: 1 },
    { key: 'cooperation', operation: 'set', value: 2 },
    { key: 'usedShortcut', operation: 'set', value: true },
    { key: 'openingChoice', operation: 'set', value: 'follow-angel' },
    { key: 'costumeAttempts', operation: 'set', value: 3 },
    { key: 'costumeCompleted', operation: 'set', value: true },
    { key: 'panRoundsCompleted', operation: 'set', value: 3 },
    { key: 'panCompleted', operation: 'set', value: true },
    { key: 'offeredToStayWithAngel', operation: 'set', value: true },
    { key: 'angelMokoResponse', operation: 'set', value: 'staying-close' },
    { key: 'crisisTriggered', operation: 'set', value: true },
    { key: 'wingStrapBroke', operation: 'set', value: true },
    { key: 'repairedMistakeTogether', operation: 'set', value: true },
    { key: 'crisisChoice', operation: 'set', value: 'repair-together' },
  ]);
  return state;
}

describe('CarnivalCrisisRepair', () => {
  it('gently rejects an unsuitable material and counts the attempt', () => {
    const state = crisisReadyState();
    const repair = new CarnivalCrisisRepair(state);

    expect(repair.selectMaterial('ribbon').status).toBe('try-again');
    expect(repair.snapshot).toMatchObject({ phase: 'choose-fastener', attempts: 1, crisisResolved: false });
  });

  it('activates assistance after repeated difficulty', () => {
    const repair = new CarnivalCrisisRepair(crisisReadyState());

    repair.selectMaterial('ribbon');
    repair.selectMaterial('confetti');

    expect(repair.snapshot.assistanceActive).toBe(true);
  });

  it('uses the safety clip and three presses to resolve the crisis', () => {
    const state = crisisReadyState();
    const repair = new CarnivalCrisisRepair(state);

    expect(repair.selectMaterial('safety-clip').status).toBe('ready-to-secure');
    expect(repair.secureFastening()).toMatchObject({ status: 'in-progress', presses: 1 });
    expect(repair.secureFastening()).toMatchObject({ status: 'in-progress', presses: 2 });
    expect(repair.secureFastening()).toMatchObject({ status: 'completed', presses: 3 });
    expect(state.get('crisisResolved')).toBe(true);
    expect(repair.snapshot.phase).toBe('complete');
  });

  it('preserves the complete earlier narrative state throughout repair', () => {
    const state = crisisReadyState();
    const before = state.snapshot;
    const repair = new CarnivalCrisisRepair(state);
    repair.selectMaterial('confetti');
    repair.selectMaterial('safety-clip');
    repair.secureFastening();
    repair.secureFastening();
    repair.secureFastening();

    const preservedKeys = [
      'angelTrust', 'juniorTrust', 'cooperation', 'usedShortcut', 'openingChoice', 'costumeAttempts',
      'costumeCompleted', 'panRoundsCompleted', 'panCompleted', 'offeredToStayWithAngel',
      'angelMokoResponse', 'wingStrapBroke', 'repairedMistakeTogether', 'crisisChoice',
    ] as const;
    preservedKeys.forEach((key) => expect(state.get(key)).toBe(before[key]));
  });

  it('resets the local interaction without clearing attempts or story state', () => {
    const state = crisisReadyState();
    const repair = new CarnivalCrisisRepair(state);
    repair.selectMaterial('ribbon');

    repair.resetInteraction();

    expect(repair.snapshot).toMatchObject({ phase: 'choose-fastener', attempts: 1, presses: 0 });
    expect(state.snapshot).toMatchObject({ openingChoice: 'follow-angel', wingStrapBroke: true });
  });

  it('restarts only repair progress while preserving the crisis choice and earlier story', () => {
    const state = crisisReadyState();
    const repair = new CarnivalCrisisRepair(state);
    repair.selectMaterial('safety-clip');
    repair.secureFastening();
    repair.secureFastening();
    repair.secureFastening();

    repair.restartRepair();

    expect(repair.snapshot).toMatchObject({ phase: 'choose-fastener', attempts: 0, crisisResolved: false });
    expect(state.snapshot).toMatchObject({
      openingChoice: 'follow-angel',
      angelMokoResponse: 'staying-close',
      wingStrapBroke: true,
      repairedMistakeTogether: true,
      crisisChoice: 'repair-together',
    });
  });

  it('cannot begin before the crisis choice', () => {
    expect(() => new CarnivalCrisisRepair(new GameStateManager())).toThrow('only after a Carnival Crisis choice');
  });
});
