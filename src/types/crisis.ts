export type RepairMaterialId = 'safety-clip' | 'ribbon' | 'confetti';

export interface RepairMaterial {
  id: RepairMaterialId;
  label: string;
  shortLabel: string;
  symbol: string;
  color: number;
}

export type CrisisRepairPhase = 'choose-fastener' | 'secure-fastening' | 'complete';

export interface RepairSelectionResult {
  status: 'try-again' | 'ready-to-secure' | 'already-complete';
  materialId: RepairMaterialId;
}

export interface RepairSecureResult {
  status: 'in-progress' | 'completed';
  presses: number;
  pressesNeeded: number;
}

export interface CrisisRepairSnapshot {
  phase: CrisisRepairPhase;
  selectedMaterialId: RepairMaterialId | null;
  presses: number;
  pressesNeeded: number;
  attempts: number;
  assistanceActive: boolean;
  crisisResolved: boolean;
}
