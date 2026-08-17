import type { PanGamePhase, PanGameSnapshot, PanInputResult, PanJamPlan, PanZoneId } from '../../../types/panJam';
import { GameStateManager } from '../../systems/GameStateManager';

export class SteelpanGame {
  private phase: PanGamePhase = 'ready';
  private tutorialIndex = 0;
  private roundIndex = 0;
  private expectedInputIndex = 0;
  private mistakesThisSequence = 0;
  private mistakesOnCurrentNote = 0;

  constructor(
    private readonly state: GameStateManager,
    private readonly plan: PanJamPlan,
  ) {
    if (!plan.tutorialSequences.length || !plan.roundSequences.length) {
      throw new Error('Pan Jam needs tutorial and round sequences.');
    }
    [...plan.tutorialSequences, ...plan.roundSequences].forEach((sequence) => {
      if (!sequence.length) throw new Error('Pan Jam sequences cannot be empty.');
    });
  }

  get snapshot(): PanGameSnapshot {
    const assistLevel = Math.min(3, this.mistakesThisSequence);
    const strongPerformance = this.state.get('panMistakes') === 0 && this.state.get('panRoundsCompleted') > 0;
    return Object.freeze({
      phase: this.phase,
      inTutorial: this.inTutorial,
      tutorialStep: Math.min(this.tutorialIndex + 1, this.plan.tutorialSequences.length),
      tutorialSteps: this.plan.tutorialSequences.length,
      currentRound: Math.min(this.roundIndex + 1, this.plan.roundSequences.length),
      totalRounds: this.plan.roundSequences.length,
      expectedInputIndex: this.expectedInputIndex,
      currentSequence: Object.freeze([...this.currentSequence]),
      assistLevel,
      playbackIntervalMs: strongPerformance ? 520 : assistLevel >= 2 ? 900 : assistLevel === 1 ? 740 : 640,
      cueDurationMs: assistLevel >= 2 ? 650 : assistLevel === 1 ? 500 : 380,
      panRoundsCompleted: this.state.get('panRoundsCompleted'),
      panMistakes: this.state.get('panMistakes'),
      panCompleted: this.state.get('panCompleted'),
      strongPerformance,
    });
  }

  beginPlayback(): readonly PanZoneId[] {
    if (this.phase === 'complete') throw new Error('Completed Pan Jam cannot start another sequence without a restart.');
    this.phase = 'playback';
    return Object.freeze([...this.currentSequence]);
  }

  finishPlayback(): void {
    if (this.phase !== 'playback') throw new Error('Pan Jam playback is not active.');
    this.phase = 'input';
  }

  submitInput(zoneId: PanZoneId): PanInputResult {
    if (this.phase !== 'input') throw new Error('Pan Jam is not accepting player input.');
    const expectedZoneId = this.currentSequence[this.expectedInputIndex];
    if (!expectedZoneId) throw new Error('Pan Jam has no expected note.');

    if (zoneId !== expectedZoneId) {
      this.state.applyEffects([{ key: 'panMistakes', operation: 'add', value: 1 }]);
      this.mistakesThisSequence += 1;
      this.mistakesOnCurrentNote += 1;
      if (this.mistakesOnCurrentNote >= 3) {
        const completion = this.acceptExpectedNote();
        return {
          status: 'assisted',
          expectedZoneId,
          sequenceComplete: completion.sequenceComplete,
          gameComplete: completion.gameComplete,
          replayRecommended: false,
        };
      }
      return {
        status: 'incorrect',
        expectedZoneId,
        sequenceComplete: false,
        gameComplete: false,
        replayRecommended: true,
      };
    }

    const completion = this.acceptExpectedNote();
    return {
      status: 'correct',
      expectedZoneId,
      sequenceComplete: completion.sequenceComplete,
      gameComplete: completion.gameComplete,
      replayRecommended: false,
    };
  }

  restart(): void {
    this.state.applyEffects([
      { key: 'panRoundsCompleted', operation: 'set', value: 0 },
      { key: 'panMistakes', operation: 'set', value: 0 },
      { key: 'panCompleted', operation: 'set', value: false },
    ]);
    this.phase = 'ready';
    this.tutorialIndex = 0;
    this.roundIndex = 0;
    this.expectedInputIndex = 0;
    this.mistakesThisSequence = 0;
    this.mistakesOnCurrentNote = 0;
  }

  private get inTutorial(): boolean {
    return this.tutorialIndex < this.plan.tutorialSequences.length;
  }

  private get currentSequence(): readonly PanZoneId[] {
    return this.inTutorial
      ? this.plan.tutorialSequences[this.tutorialIndex]
      : this.plan.roundSequences[this.roundIndex];
  }

  private acceptExpectedNote(): { sequenceComplete: boolean; gameComplete: boolean } {
    this.expectedInputIndex += 1;
    this.mistakesOnCurrentNote = 0;
    if (this.expectedInputIndex < this.currentSequence.length) {
      return { sequenceComplete: false, gameComplete: false };
    }

    this.expectedInputIndex = 0;
    this.mistakesThisSequence = 0;
    if (this.inTutorial) {
      this.tutorialIndex += 1;
    } else {
      this.state.applyEffects([{ key: 'panRoundsCompleted', operation: 'add', value: 1 }]);
      if (this.roundIndex === this.plan.roundSequences.length - 1) {
        this.state.applyEffects([{ key: 'panCompleted', operation: 'set', value: true }]);
        this.phase = 'complete';
        return { sequenceComplete: true, gameComplete: true };
      }
      this.roundIndex += 1;
    }
    this.phase = 'ready';
    return { sequenceComplete: true, gameComplete: false };
  }
}
