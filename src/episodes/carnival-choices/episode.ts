import { carnivalCharacters } from './characters';
import { ccClubOpeningStory } from './dialogue';

export const carnivalChoicesEpisode = {
  id: 'carnival-choices',
  title: 'Young Folk: Story Time',
  subtitle: 'Carnival Choices',
  assets: {
    clubBackground: '/assets/backgrounds/cc-club/cc-club-interior.png',
    lexiMakingWings: '/assets/backgrounds/cc-club/lexi-making-wings.png',
  },
  characters: carnivalCharacters,
  openingStory: ccClubOpeningStory,
} as const;
