import { carnivalCharacters } from './characters';
import { ccClubOpeningStory } from './dialogue';
import { mokoJumbieStory } from './mokoJumbie';
import { nonShortcutCrisisStory, shortcutCrisisStory } from './crisis';

export const carnivalChoicesEpisode = {
  id: 'carnival-choices',
  title: 'Young Folk: Story Time',
  subtitle: 'Carnival Choices',
  assets: {
    clubBackground: '/assets/backgrounds/cc-club/cc-club-interior.png',
    lexiMakingWings: '/assets/backgrounds/cc-club/lexi-making-wings.png',
    storyPot: '/assets/backgrounds/cc-club/story-pot.png',
    carnivalBackground: '/assets/backgrounds/carnival/kiddies-carnival-background.png',
    panJamBackground: '/assets/backgrounds/carnival/pan-kids.png',
    mokoJumbieBackground: '/assets/backgrounds/carnival/kiddies-carnival-scene.png',
  },
  characters: carnivalCharacters,
  openingStory: ccClubOpeningStory,
  mokoJumbieStory,
  crisisStories: {
    shortcut: shortcutCrisisStory,
    nonShortcut: nonShortcutCrisisStory,
  },
} as const;
