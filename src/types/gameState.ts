export type OpeningChoiceId = 'follow-junior' | 'follow-angel' | 'work-together';

export interface CarnivalGameState {
  angelTrust: number;
  juniorTrust: number;
  cooperation: number;
  usedShortcut: boolean;
  followedInstructions: boolean;
  combinedIdeas: boolean;
  openingChoice: OpeningChoiceId | null;
  costumeAttempts: number;
  costumeCompleted: boolean;
}

export const INITIAL_CARNIVAL_GAME_STATE: Readonly<CarnivalGameState> = {
  angelTrust: 0,
  juniorTrust: 0,
  cooperation: 0,
  usedShortcut: false,
  followedInstructions: false,
  combinedIdeas: false,
  openingChoice: null,
  costumeAttempts: 0,
  costumeCompleted: false,
};

export type CarnivalStateKey = keyof CarnivalGameState;

export type NumericStateKey = {
  [Key in CarnivalStateKey]: CarnivalGameState[Key] extends number ? Key : never;
}[CarnivalStateKey];

export type SetStateEffect = {
  [Key in CarnivalStateKey]: {
    key: Key;
    operation: 'set';
    value: CarnivalGameState[Key];
  };
}[CarnivalStateKey];

export interface AddStateEffect {
  key: NumericStateKey;
  operation: 'add';
  value: number;
}

export type StateEffect = SetStateEffect | AddStateEffect;
