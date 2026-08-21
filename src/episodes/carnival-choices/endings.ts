import type { EndingDefinition, EndingId } from '../../types/endings';

export const carnivalEndings: Record<EndingId, EndingDefinition> = {
  'together-on-the-road': {
    id: 'together-on-the-road',
    title: 'Together on the Road',
    reflection: 'You made room for a friend’s feelings, and the next step became something you could share.',
    badge: { id: 'caring-friend', label: 'CARING FRIEND', symbol: '♥', description: 'Supported a friend at their own pace' },
    dialogue: [
      {
        characterId: 'lexi',
        expression: 'happy',
        speaker: 'Lexi',
        text: 'We can keep walking together. Nobody has to move faster than they are ready for.',
      },
      {
        characterId: 'angel',
        expression: 'happy',
        speaker: 'Angel',
        text: 'I will come with you. I can go at my own pace—with my friends beside me.',
      },
      {
        characterId: 'junior',
        expression: 'happy',
        speaker: 'Junior',
        text: 'Then we can keep learning side by side, all along the Carnival road.',
      },
    ],
  },
  'one-little-step': {
    id: 'one-little-step',
    title: 'One Little Step',
    reflection: 'You learned that courage can be quiet, and respecting someone’s pace is part of being a friend.',
    badge: { id: 'courage-counts', label: 'COURAGE COUNTS', symbol: '✦', description: 'Respected one little step' },
    dialogue: [
      {
        characterId: 'angel',
        expression: 'thinking',
        speaker: 'Angel',
        text: 'I am not ready to walk close to the Moko Jumbies today.',
      },
      {
        characterId: 'lexi',
        expression: 'happy',
        speaker: 'Lexi',
        text: 'That is okay. One little step still counts, and you get to choose when.',
      },
      {
        characterId: 'angel',
        expression: 'happy',
        speaker: 'Angel',
        text: 'I can take one step from here—with my friends nearby.',
      },
    ],
  },
  'we-fixed-it': {
    id: 'we-fixed-it',
    title: 'We Fixed It',
    reflection: 'You made space for honesty, repaired a mistake, and discovered that learning can be part of fixing.',
    badge: { id: 'problem-solver', label: 'PROBLEM SOLVER', symbol: '◇', description: 'Learned from and repaired a mistake' },
    dialogue: [
      {
        characterId: 'angel',
        expression: 'thinking',
        speaker: 'Angel',
        text: 'My shortcut caused the loose fastening. I am glad I told the truth.',
      },
      {
        characterId: 'lexi',
        expression: 'happy',
        speaker: 'Lexi',
        text: 'We listened, repaired it, and learned from the mistake together.',
      },
      {
        characterId: 'junior',
        expression: 'happy',
        speaker: 'Junior',
        text: 'A careful fix can help a creative idea work better next time.',
      },
    ],
  },
  'cc-club-team': {
    id: 'cc-club-team',
    title: 'CC Club Team',
    reflection: 'You brought careful thinking, creative ideas, and clear communication together as one team.',
    badge: { id: 'team-player', label: 'TEAM PLAYER', symbol: '★', description: 'Brought every strength together' },
    dialogue: [
      {
        characterId: 'junior',
        expression: 'happy',
        speaker: 'Junior',
        text: 'I noticed the details and helped line everything up.',
      },
      {
        characterId: 'angel',
        expression: 'happy',
        speaker: 'Angel',
        text: 'I found a creative way to help—and I listened when the plan needed care.',
      },
      {
        characterId: 'lexi',
        expression: 'excited',
        speaker: 'Lexi',
        text: 'And we made room for every strength. That is what the CC Club team can do!',
      },
    ],
  },
};
