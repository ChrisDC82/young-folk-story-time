import type Phaser from 'phaser';
import { describe, expect, it, vi } from 'vitest';
import { carnivalEndings } from '../../src/episodes/carnival-choices/endings';
import { AudioManager } from '../../src/game/systems/AudioManager';
import {
  EndingResolver,
  HIGH_ANGEL_TRUST_THRESHOLD,
  HIGH_COOPERATION_THRESHOLD,
} from '../../src/game/systems/EndingResolver';
import { GameStateManager } from '../../src/game/systems/GameStateManager';
import { StoryCardBuilder } from '../../src/game/systems/StoryCardBuilder';
import { StoryProgression } from '../../src/game/systems/StoryProgression';
import { INITIAL_CARNIVAL_GAME_STATE, type CarnivalGameState } from '../../src/types/gameState';

vi.mock('phaser', () => ({ default: { Sound: { Events: { DESTROY: 'destroy' } } } }));

function completedState(overrides: Partial<CarnivalGameState> = {}): CarnivalGameState {
  return {
    ...INITIAL_CARNIVAL_GAME_STATE,
    openingChoice: 'follow-junior',
    followedInstructions: true,
    costumeAttempts: 1,
    costumeCompleted: true,
    panRoundsCompleted: 3,
    panCompleted: true,
    angelMokoResponse: 'defensive',
    crisisTriggered: true,
    nearbyCostumeProblem: true,
    crisisChoice: 'blame',
    crisisResolved: true,
    repairAttempts: 1,
    ...overrides,
  };
}

describe('EndingResolver', () => {
  it('resolves CC Club Team from a reachable high-cooperation shared-repair journey', () => {
    const state = completedState({
      openingChoice: 'work-together',
      cooperation: 3,
      repairedMistakeTogether: true,
      crisisChoice: 'repair-together',
      angelMokoResponse: 'accepted-explanation',
      askedForHelp: true,
    });

    expect(state.cooperation).toBeGreaterThanOrEqual(HIGH_COOPERATION_THRESHOLD);
    expect(EndingResolver.resolve(state)).toBe('cc-club-team');
  });

  it('resolves Together on the Road from high Angel trust and a supportive Moko response', () => {
    const state = completedState({
      openingChoice: 'work-together',
      angelTrust: 2,
      angelMokoResponse: 'staying-close',
      offeredToStayWithAngel: true,
      crisisChoice: 'ask-for-help',
      askedForHelp: true,
      askedForCrisisHelp: true,
    });

    expect(state.angelTrust).toBeGreaterThanOrEqual(HIGH_ANGEL_TRUST_THRESHOLD);
    expect(EndingResolver.resolve(state)).toBe('together-on-the-road');
  });

  it('resolves We Fixed It when the shortcut is followed and Angel admits it', () => {
    const state = completedState({
      openingChoice: 'follow-angel',
      followedInstructions: false,
      usedShortcut: true,
      angelTrust: 1,
      angelMokoResponse: 'shared-height-fear',
      askedAngelWhatWasWrong: true,
      wingStrapBroke: true,
      nearbyCostumeProblem: false,
      crisisChoice: 'ask-angel',
      angelAdmittedShortcut: true,
    });

    expect(EndingResolver.resolve(state)).toBe('we-fixed-it');
  });

  it('resolves One Little Step as the gentle reachable fallback', () => {
    const state = completedState({
      openingChoice: 'follow-junior',
      angelTrust: -1,
      dismissedAngelFear: true,
      angelMokoResponse: 'defensive',
      blamedSomeone: true,
    });

    expect(EndingResolver.resolve(state)).toBe('one-little-step');
  });

  it('uses deterministic documented priority when more than one condition matches', () => {
    const state = completedState({
      cooperation: 3,
      repairedMistakeTogether: true,
      angelTrust: 2,
      angelMokoResponse: 'staying-close',
      usedShortcut: true,
      angelAdmittedShortcut: true,
    });

    expect(Array.from({ length: 8 }, () => EndingResolver.resolve(state))).toEqual(
      Array.from({ length: 8 }, () => 'cc-club-team'),
    );
  });

  it('lets relevant relationship state change the result', () => {
    const base = completedState({ angelTrust: 2 });

    expect(EndingResolver.resolve({ ...base, angelMokoResponse: 'defensive' })).toBe('one-little-step');
    expect(EndingResolver.resolve({ ...base, angelMokoResponse: 'staying-close' })).toBe('together-on-the-road');
  });

  it('rejects an ending request before the complete journey', () => {
    expect(() => EndingResolver.resolve({ ...completedState(), crisisResolved: false })).toThrow(
      'complete Carnival journey',
    );
  });
});

describe('StoryCardBuilder and replay', () => {
  it('builds a personal card with preserved milestone badges and the ending badge', () => {
    const state = completedState({
      cooperation: 2,
      repairedMistakeTogether: true,
      crisisChoice: 'repair-together',
      offeredToStayWithAngel: true,
    });
    const endingId = EndingResolver.resolve(state);
    const card = StoryCardBuilder.build(state, carnivalEndings[endingId]);

    expect(card).toMatchObject({ heading: 'YOUR CARNIVAL STORY', endingId, endingTitle: 'CC Club Team' });
    expect(card.achievements.map((achievement) => achievement.id)).toEqual([
      'creator-badge',
      'rhythm-star',
      'team-player',
    ]);
    expect(card.accomplishments).toContain('You brought everyone’s strengths into the repair.');
  });

  it('does not mutate earlier narrative state while resolving the ending or Story Card', () => {
    const state = completedState({ usedShortcut: true, wingStrapBroke: true, angelAdmittedShortcut: true });
    const before = { ...state };
    const endingId = EndingResolver.resolve(state);
    StoryCardBuilder.build(state, carnivalEndings[endingId]);

    expect(state).toEqual(before);
  });

  it('replay clears narrative state while leaving mute preference intact', () => {
    const state = new GameStateManager(completedState({ usedShortcut: true, wingStrapBroke: true }));
    const progression = new StoryProgression(state);
    const audio = new AudioManager();
    const scene = { sound: { mute: false } } as unknown as Phaser.Scene;
    audio.setMuted(scene, true);

    expect(progression.startNewStory()).toBe('club');
    expect(state.snapshot).toEqual(INITIAL_CARNIVAL_GAME_STATE);
    expect(audio.isMuted()).toBe(true);
  });
});
