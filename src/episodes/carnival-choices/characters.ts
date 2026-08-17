import type { CharacterDefinition, CharacterId } from '../../types/characters';

export const carnivalCharacters: Record<CharacterId, CharacterDefinition> = {
  lexi: {
    id: 'lexi',
    displayName: 'Lexi',
    accentColor: 0xe84a9b,
    defaultExpression: 'neutral',
    textures: {
      neutral: 'lexi-front',
      happy: 'lexi-happy',
      excited: 'lexi-excited',
    },
    assets: {
      neutral: '/assets/characters/lexi/lexi-front.png',
      happy: '/assets/characters/lexi/lexi-happy.png',
      excited: '/assets/characters/lexi/lexi-excited.png',
    },
    stage: { x: 770, y: 450, width: 220, height: 305 },
  },
  angel: {
    id: 'angel',
    displayName: 'Angel',
    accentColor: 0x9b59b6,
    defaultExpression: 'neutral',
    textures: {
      neutral: 'angel-front',
      happy: 'angel-happy',
      thinking: 'angel-thinking',
      excited: 'angel-excited',
    },
    assets: {
      neutral: '/assets/characters/angel/angel-front.png',
      happy: '/assets/characters/angel/angel-happy.png',
      thinking: '/assets/characters/angel/angel-thinking.png',
      excited: '/assets/characters/angel/angel-excited.png',
    },
    stage: { x: 1010, y: 452, width: 245, height: 315 },
  },
  junior: {
    id: 'junior',
    displayName: 'Junior',
    accentColor: 0x4f9d69,
    defaultExpression: 'neutral',
    textures: {
      neutral: 'junior-front',
      happy: 'junior-happy',
      thinking: 'junior-thinking',
      surprised: 'junior-surprised',
    },
    assets: {
      neutral: '/assets/characters/junior/junior-front.png',
      happy: '/assets/characters/junior/junior-happy.png',
      thinking: '/assets/characters/junior/junior-thinking.png',
      surprised: '/assets/characters/junior/junior-surprised.png',
    },
    stage: { x: 1190, y: 450, width: 170, height: 300 },
  },
};

export function characterName(characterId: CharacterId): string {
  return carnivalCharacters[characterId].displayName;
}
