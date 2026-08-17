export type PanZoneId = 'sun' | 'diamond' | 'moon' | 'heart';

export type PanZoneShape = 'sun' | 'diamond' | 'moon' | 'heart';

export interface PanZoneDefinition {
  id: PanZoneId;
  label: string;
  symbol: string;
  keyboardKey: string;
  frequency: number;
  color: number;
  shape: PanZoneShape;
}

export interface PanJamPlan {
  tutorialSequences: readonly (readonly PanZoneId[])[];
  roundSequences: readonly (readonly PanZoneId[])[];
}

export type PanGamePhase = 'ready' | 'playback' | 'input' | 'complete';

export interface PanInputResult {
  status: 'correct' | 'incorrect' | 'assisted';
  expectedZoneId: PanZoneId;
  sequenceComplete: boolean;
  gameComplete: boolean;
  replayRecommended: boolean;
}

export interface PanGameSnapshot {
  phase: PanGamePhase;
  inTutorial: boolean;
  tutorialStep: number;
  tutorialSteps: number;
  currentRound: number;
  totalRounds: number;
  expectedInputIndex: number;
  currentSequence: readonly PanZoneId[];
  assistLevel: number;
  playbackIntervalMs: number;
  cueDurationMs: number;
  panRoundsCompleted: number;
  panMistakes: number;
  panCompleted: boolean;
  strongPerformance: boolean;
}
