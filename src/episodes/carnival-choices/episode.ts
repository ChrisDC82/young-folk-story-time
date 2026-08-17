import type { DialogueLine, MilestoneChoice } from '../../types/dialogue';

export const carnivalChoicesEpisode = {
  id: 'carnival-choices',
  title: 'Young Folk: Story Time',
  subtitle: 'Carnival Choices',
  assets: {
    clubBackground: '/assets/backgrounds/cc-club/cc-club-interior.png',
    lexiFront: '/assets/characters/lexi/lexi-front.png',
  },
  hotspotDialogue: {
    speaker: 'Lexi',
    text: 'Hear that steelpan? Every note can help us tell a Carnival story!',
  } satisfies DialogueLine,
  choices: [
    {
      id: 'listen',
      label: 'Listen for the rhythm',
      response: 'You chose to listen first — a great way to learn a new rhythm!',
    },
    {
      id: 'invite',
      label: 'Invite a friend to play',
      response: 'You chose to share the music — Carnival is brighter together!',
    },
    {
      id: 'explore',
      label: 'Explore another sound',
      response: 'You chose to explore — every sound can begin a new story!',
    },
  ] satisfies MilestoneChoice[],
} as const;
