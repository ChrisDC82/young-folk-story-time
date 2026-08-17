import type { StoryChoice } from '../../types/narrative';

export const openingChoices = [
  {
    id: 'follow-junior',
    label: 'Follow Junior',
    description: 'Follow the instructions.',
    confirmation: 'You chose Junior’s careful plan.',
    next: 'junior-reaction',
    effects: [
      { key: 'juniorTrust', operation: 'add', value: 1 },
      { key: 'usedShortcut', operation: 'set', value: false },
      { key: 'followedInstructions', operation: 'set', value: true },
      { key: 'combinedIdeas', operation: 'set', value: false },
      { key: 'openingChoice', operation: 'set', value: 'follow-junior' },
    ],
  },
  {
    id: 'follow-angel',
    label: 'Follow Angel',
    description: 'Try the shortcut.',
    confirmation: 'You chose Angel’s speedy shortcut.',
    next: 'angel-reaction',
    effects: [
      { key: 'angelTrust', operation: 'add', value: 1 },
      { key: 'usedShortcut', operation: 'set', value: true },
      { key: 'followedInstructions', operation: 'set', value: false },
      { key: 'combinedIdeas', operation: 'set', value: false },
      { key: 'openingChoice', operation: 'set', value: 'follow-angel' },
    ],
  },
  {
    id: 'work-together',
    label: 'Work Together',
    description: 'Combine Angel’s idea with the instructions.',
    confirmation: 'You found a way to use everyone’s ideas.',
    next: 'together-reaction',
    effects: [
      { key: 'angelTrust', operation: 'add', value: 1 },
      { key: 'juniorTrust', operation: 'add', value: 1 },
      { key: 'cooperation', operation: 'add', value: 1 },
      { key: 'usedShortcut', operation: 'set', value: false },
      { key: 'followedInstructions', operation: 'set', value: true },
      { key: 'combinedIdeas', operation: 'set', value: true },
      { key: 'openingChoice', operation: 'set', value: 'work-together' },
    ],
  },
] satisfies StoryChoice[];
