import type {
  CrisisRepairSnapshot,
  RepairMaterialId,
  RepairSecureResult,
  RepairSelectionResult,
} from '../../../types/crisis';
import { GameStateManager } from '../../systems/GameStateManager';

export interface CarnivalCrisisRepairOptions {
  correctMaterialId?: RepairMaterialId;
  assistanceAfterAttempts?: number;
  pressesNeeded?: number;
}

export class CarnivalCrisisRepair {
  private phase: CrisisRepairSnapshot['phase'];
  private selectedMaterialId: RepairMaterialId | null = null;
  private presses = 0;
  private readonly correctMaterialId: RepairMaterialId;
  private readonly assistanceAfterAttempts: number;
  private readonly pressesNeeded: number;

  constructor(
    private readonly state: GameStateManager,
    options: CarnivalCrisisRepairOptions = {},
  ) {
    if (!state.get('crisisTriggered') || !state.get('crisisChoice')) {
      throw new Error('The repair can begin only after a Carnival Crisis choice.');
    }
    this.correctMaterialId = options.correctMaterialId ?? 'safety-clip';
    this.assistanceAfterAttempts = options.assistanceAfterAttempts ?? 2;
    this.pressesNeeded = options.pressesNeeded ?? 3;
    if (this.assistanceAfterAttempts < 1 || this.pressesNeeded < 1) {
      throw new Error('Repair assistance and securing counts must be positive.');
    }
    this.phase = state.get('crisisResolved') ? 'complete' : 'choose-fastener';
  }

  get snapshot(): CrisisRepairSnapshot {
    return Object.freeze({
      phase: this.phase,
      selectedMaterialId: this.selectedMaterialId,
      presses: this.presses,
      pressesNeeded: this.pressesNeeded,
      attempts: this.state.get('repairAttempts'),
      assistanceActive: this.phase === 'choose-fastener' && this.state.get('repairAttempts') >= this.assistanceAfterAttempts,
      crisisResolved: this.state.get('crisisResolved'),
    });
  }

  selectMaterial(materialId: RepairMaterialId): RepairSelectionResult {
    if (this.phase === 'complete') return { status: 'already-complete', materialId };
    if (this.phase !== 'choose-fastener') throw new Error('A repair material has already been selected.');
    const validMaterials: readonly RepairMaterialId[] = ['safety-clip', 'ribbon', 'confetti'];
    if (!validMaterials.includes(materialId)) throw new Error(`Unknown repair material "${materialId}".`);

    this.state.applyEffects([{ key: 'repairAttempts', operation: 'add', value: 1 }]);
    if (materialId !== this.correctMaterialId) return { status: 'try-again', materialId };

    this.selectedMaterialId = materialId;
    this.phase = 'secure-fastening';
    return { status: 'ready-to-secure', materialId };
  }

  secureFastening(): RepairSecureResult {
    if (this.phase !== 'secure-fastening') throw new Error('Choose the safety clip before securing the fastening.');
    this.presses += 1;
    if (this.presses < this.pressesNeeded) {
      return { status: 'in-progress', presses: this.presses, pressesNeeded: this.pressesNeeded };
    }

    this.phase = 'complete';
    this.state.applyEffects([{ key: 'crisisResolved', operation: 'set', value: true }]);
    return { status: 'completed', presses: this.presses, pressesNeeded: this.pressesNeeded };
  }

  resetInteraction(): void {
    if (this.state.get('crisisResolved')) return;
    this.phase = 'choose-fastener';
    this.selectedMaterialId = null;
    this.presses = 0;
  }

  restartRepair(): void {
    this.state.applyEffects([
      { key: 'repairAttempts', operation: 'set', value: 0 },
      { key: 'crisisResolved', operation: 'set', value: false },
    ]);
    this.phase = 'choose-fastener';
    this.selectedMaterialId = null;
    this.presses = 0;
  }
}
