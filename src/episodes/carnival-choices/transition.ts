import type { CarnivalHotspotDefinition, CharacterDialogueLine } from '../../types/carnival';

export const storyTimeIntroDialogue: readonly CharacterDialogueLine[] = [
  {
    characterId: 'lexi',
    expression: 'happy',
    speaker: 'Lexi',
    text: 'Our Carnival wings are ready! Look—the story pot is starting to glow.',
  },
  {
    characterId: 'angel',
    expression: 'excited',
    speaker: 'Angel',
    text: 'Then let’s not keep a magical adventure waiting!',
  },
  {
    characterId: 'junior',
    expression: 'thinking',
    speaker: 'Junior',
    text: 'A journey together sounds like the wisest next step.',
  },
];

export const storyTimeMagicDialogue: readonly CharacterDialogueLine[] = [
  {
    characterId: 'lexi',
    expression: 'excited',
    speaker: 'Lexi',
    text: 'Story time is here!',
  },
  {
    characterId: 'angel',
    expression: 'excited',
    speaker: 'Angel',
    text: 'Kiddies Carnival, here we come!',
  },
  {
    characterId: 'junior',
    expression: 'happy',
    speaker: 'Junior',
    text: 'Together, then. Let’s see where the story takes us.',
  },
];

export const carnivalArrivalDialogue: readonly CharacterDialogueLine[] = [
  {
    characterId: 'lexi',
    expression: 'excited',
    speaker: 'Lexi',
    text: 'We made it! Kiddies Carnival is bright, busy, and beautiful!',
  },
  {
    characterId: 'angel',
    expression: 'excited',
    speaker: 'Angel',
    text: 'I call first dance—and second dance too!',
  },
  {
    characterId: 'junior',
    expression: 'happy',
    speaker: 'Junior',
    text: 'There is a great deal to notice. We should look around together.',
  },
];

export const carnivalHotspots: readonly CarnivalHotspotDefinition[] = [
  {
    id: 'steelpan-preview',
    label: 'Steelpan stage',
    icon: '♪',
    x: 205,
    y: 445,
    color: 0x57c7e3,
    reaction: {
      characterId: 'lexi',
      expression: 'excited',
      speaker: 'Lexi',
      text: 'Those steelpans are shining! We can learn their rhythm another time.',
    },
  },
  {
    id: 'carnival-banner',
    label: 'Carnival banner',
    icon: '★',
    x: 245,
    y: 205,
    color: 0xffd34e,
    reaction: {
      characterId: 'angel',
      expression: 'happy',
      speaker: 'Angel',
      text: 'That banner needs more sparkle. Everything needs more sparkle!',
    },
  },
  {
    id: 'festival-flags',
    label: 'Festival flags',
    icon: '◆',
    x: 890,
    y: 160,
    color: 0xf49ac2,
    reaction: {
      characterId: 'junior',
      expression: 'thinking',
      speaker: 'Junior',
      text: 'Each flag moves with the breeze. Carnival is full of patterns.',
    },
  },
];
