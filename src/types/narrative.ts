import type { CharacterExpression, CharacterId } from './characters';
import type { CarnivalGameState, CarnivalStateKey, NumericStateKey, StateEffect } from './gameState';

type EqualityCondition = {
  [Key in CarnivalStateKey]: {
    key: Key;
    operator: 'equals' | 'not-equals';
    value: CarnivalGameState[Key];
  };
}[CarnivalStateKey];

interface NumericComparisonCondition {
  key: NumericStateKey;
  operator: 'greater-than' | 'greater-than-or-equal' | 'less-than' | 'less-than-or-equal';
  value: number;
}

export type StoryCondition = EqualityCondition | NumericComparisonCondition;

export interface StoryChoice {
  id: string;
  label: string;
  description?: string;
  confirmation: string;
  next: string;
  effects?: StateEffect[];
  conditions?: StoryCondition[];
}

export interface StoryNode {
  id: string;
  speaker?: CharacterId;
  text?: string;
  expression?: CharacterExpression;
  conditions?: StoryCondition[];
  actions?: StateEffect[];
  choices?: StoryChoice[];
  next?: string;
  end?: boolean;
}

export interface StoryDefinition {
  id: string;
  startNodeId: string;
  nodes: Record<string, StoryNode>;
}
