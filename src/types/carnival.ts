import type { CharacterExpression, CharacterId } from './characters';

export interface CharacterDialogueLine {
  characterId: CharacterId;
  expression: CharacterExpression;
  speaker: string;
  text: string;
}

export type CarnivalHotspotId = 'steelpan-preview' | 'carnival-banner' | 'festival-flags';

export interface CarnivalHotspotDefinition {
  id: CarnivalHotspotId;
  label: string;
  icon: string;
  x: number;
  y: number;
  color: number;
  reaction: CharacterDialogueLine;
}
