import type { CharacterDialogueLine } from './carnival';

export type EndingId =
  | 'together-on-the-road'
  | 'one-little-step'
  | 'we-fixed-it'
  | 'cc-club-team';

export type EndingBadgeId = 'caring-friend' | 'courage-counts' | 'problem-solver' | 'team-player';
export type AchievementId = 'creator-badge' | 'rhythm-star' | EndingBadgeId;

export interface EndingBadgeDefinition {
  id: EndingBadgeId;
  label: string;
  symbol: string;
  description: string;
}

export interface EndingDefinition {
  id: EndingId;
  title: string;
  reflection: string;
  badge: EndingBadgeDefinition;
  dialogue: readonly CharacterDialogueLine[];
}

export interface StoryCardAchievement {
  id: AchievementId;
  label: string;
  symbol: string;
  description: string;
  source: 'milestone' | 'ending';
}

export interface StoryCardData {
  heading: 'YOUR CARNIVAL STORY';
  endingId: EndingId;
  endingTitle: string;
  reflection: string;
  achievements: readonly StoryCardAchievement[];
  accomplishments: readonly string[];
}
