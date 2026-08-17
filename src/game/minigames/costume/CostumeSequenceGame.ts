import type { CostumeMoveResult, CostumeSequenceSnapshot, CostumeStepId } from '../../../types/minigames';
import { GameStateManager } from '../../systems/GameStateManager';

export interface CostumeSequenceOptions {
  hintAfterAttempts?: number;
}

export class CostumeSequenceGame {
  private readonly slots: Array<CostumeStepId | null>;
  private readonly hintAfterAttempts: number;

  constructor(
    private readonly state: GameStateManager,
    private readonly correctOrder: readonly CostumeStepId[],
    options: CostumeSequenceOptions = {},
  ) {
    if (correctOrder.length < 2 || new Set(correctOrder).size !== correctOrder.length) {
      throw new Error('A costume sequence needs at least two unique steps.');
    }
    this.slots = correctOrder.map(() => null);
    this.hintAfterAttempts = options.hintAfterAttempts ?? 2;
  }

  get snapshot(): CostumeSequenceSnapshot {
    const hint = this.findHint();
    return Object.freeze({
      slots: Object.freeze([...this.slots]),
      attempts: this.state.get('costumeAttempts'),
      completed: this.state.get('costumeCompleted'),
      hintActive: hint !== null,
      hintStepId: hint?.stepId ?? null,
      hintSlotIndex: hint?.slotIndex ?? null,
    });
  }

  place(stepId: CostumeStepId, slotIndex: number): CostumeMoveResult {
    if (this.state.get('costumeCompleted')) return { status: 'completed' };
    if (!this.correctOrder.includes(stepId)) throw new Error(`Unknown costume step "${stepId}".`);
    if (!Number.isInteger(slotIndex) || slotIndex < 0 || slotIndex >= this.slots.length) {
      throw new Error(`Costume slot ${slotIndex} is out of range.`);
    }

    const previousSlotIndex = this.slots.indexOf(stepId);
    const displacedStepId = this.slots[slotIndex] ?? undefined;

    if (previousSlotIndex >= 0) this.slots[previousSlotIndex] = null;
    this.slots[slotIndex] = stepId;

    if (displacedStepId && displacedStepId !== stepId && previousSlotIndex >= 0) {
      this.slots[previousSlotIndex] = displacedStepId;
    }

    if (this.slots.some((slot) => slot === null)) {
      return { status: 'in-progress', displacedStepId: displacedStepId === stepId ? undefined : displacedStepId };
    }

    const submittedOrder = [...this.slots] as CostumeStepId[];
    this.state.applyEffects([{ key: 'costumeAttempts', operation: 'add', value: 1 }]);
    const correct = submittedOrder.every((id, index) => id === this.correctOrder[index]);

    if (correct) {
      this.state.applyEffects([{ key: 'costumeCompleted', operation: 'set', value: true }]);
      return { status: 'completed', submittedOrder };
    }

    this.resetBoard();
    return { status: 'incorrect', submittedOrder };
  }

  resetBoard(): void {
    this.slots.fill(null);
  }

  restartChallenge(): void {
    this.resetBoard();
    this.state.applyEffects([
      { key: 'costumeAttempts', operation: 'set', value: 0 },
      { key: 'costumeCompleted', operation: 'set', value: false },
    ]);
  }

  private findHint(): { stepId: CostumeStepId; slotIndex: number } | null {
    if (
      this.state.get('costumeCompleted') ||
      this.state.get('costumeAttempts') < this.hintAfterAttempts
    ) {
      return null;
    }

    const slotIndex = this.correctOrder.findIndex((stepId, index) => this.slots[index] !== stepId);
    if (slotIndex < 0) return null;
    return { stepId: this.correctOrder[slotIndex], slotIndex };
  }
}
