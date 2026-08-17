export type CostumeStepId = 'shape' | 'colour' | 'decorate' | 'attach';

export interface CostumeStep {
  id: CostumeStepId;
  label: string;
  shortLabel: string;
  accent: number;
}

export type CostumeMoveStatus = 'in-progress' | 'incorrect' | 'completed';

export interface CostumeMoveResult {
  status: CostumeMoveStatus;
  displacedStepId?: CostumeStepId;
  submittedOrder?: CostumeStepId[];
}

export interface CostumeSequenceSnapshot {
  slots: ReadonlyArray<CostumeStepId | null>;
  attempts: number;
  completed: boolean;
  hintActive: boolean;
  hintStepId: CostumeStepId | null;
  hintSlotIndex: number | null;
}
