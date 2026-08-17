import type { CharacterDialogueLine } from '../../types/carnival';
import type { PanJamPlan, PanZoneDefinition, PanZoneId } from '../../types/panJam';
import { RhythmSequence } from '../../game/minigames/steelpan/RhythmSequence';

export const panJamIntroDialogue: readonly CharacterDialogueLine[] = [
  {
    characterId: 'lexi',
    expression: 'excited',
    speaker: 'Lexi',
    text: 'Listen—the steelpans are calling! Will you try a rhythm with us?',
  },
  {
    characterId: 'junior',
    expression: 'thinking',
    speaker: 'Junior',
    text: 'Listen first. Then play. The pattern will show you the way.',
  },
  {
    characterId: 'angel',
    expression: 'excited',
    speaker: 'Angel',
    text: 'Yes! Let’s play Pan Jam!',
  },
];

export const panZones: readonly PanZoneDefinition[] = [
  { id: 'sun', label: 'Sun', symbol: '☀', keyboardKey: '1', frequency: 261.63, color: 0xffd34e, shape: 'sun' },
  { id: 'diamond', label: 'Diamond', symbol: '◆', keyboardKey: '2', frequency: 329.63, color: 0x57c7e3, shape: 'diamond' },
  { id: 'moon', label: 'Moon', symbol: '☾', keyboardKey: '3', frequency: 392, color: 0x9b6bd0, shape: 'moon' },
  { id: 'heart', label: 'Heart', symbol: '♥', keyboardKey: '4', frequency: 523.25, color: 0xf49ac2, shape: 'heart' },
] as const;

const zoneIds = panZones.map((zone) => zone.id) as PanZoneId[];

export const panJamPlan: PanJamPlan = {
  tutorialSequences: [['sun'], ['diamond', 'heart']],
  roundSequences: [
    RhythmSequence.generate(zoneIds, 2, 11),
    RhythmSequence.generate(zoneIds, 3, 27),
    RhythmSequence.generate(zoneIds, 4, 43),
  ],
};
