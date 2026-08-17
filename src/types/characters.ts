export type CharacterId = 'lexi' | 'angel' | 'junior';

export type CharacterExpression = 'neutral' | 'happy' | 'thinking' | 'surprised' | 'excited';

export interface CharacterStageLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CharacterDefinition {
  id: CharacterId;
  displayName: string;
  accentColor: number;
  defaultExpression: CharacterExpression;
  textures: Partial<Record<CharacterExpression, string>> & { neutral: string };
  assets: Partial<Record<CharacterExpression, string>> & { neutral: string };
  stage: CharacterStageLayout;
}
