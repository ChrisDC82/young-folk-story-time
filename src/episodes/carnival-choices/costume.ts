import type { CostumeStep, CostumeStepId } from '../../types/minigames';

export const costumeSteps: readonly CostumeStep[] = [
  { id: 'shape', label: 'Shape the wings', shortLabel: 'Shape', accent: 0xf49ac2 },
  { id: 'colour', label: 'Colour the wings', shortLabel: 'Colour', accent: 0x57c7e3 },
  { id: 'decorate', label: 'Decorate the wings', shortLabel: 'Decorate', accent: 0xffd34e },
  { id: 'attach', label: 'Attach the straps', shortLabel: 'Straps', accent: 0x79d18b },
] as const;

export const costumeStepOrder: readonly CostumeStepId[] = costumeSteps.map((step) => step.id);

export const costumeCardStartingOrder: readonly CostumeStepId[] = ['decorate', 'attach', 'shape', 'colour'];

export const costumeSlotLabels = ['First', 'Next', 'Then', 'Last'] as const;
