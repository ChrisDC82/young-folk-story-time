import type { StoryDefinition } from '../../types/narrative';
import { openingChoices } from './choices';

export const ccClubOpeningStory: StoryDefinition = {
  id: 'cc-club-opening',
  startNodeId: 'lexi-prepares',
  nodes: {
    'lexi-prepares': {
      id: 'lexi-prepares',
      speaker: 'lexi',
      expression: 'excited',
      text: 'Junior, the Carnival wings are almost ready. One more careful step!',
      next: 'junior-instructions',
    },
    'junior-instructions': {
      id: 'junior-instructions',
      speaker: 'junior',
      expression: 'thinking',
      text: 'The instructions say we should fasten every piece before we decorate.',
      next: 'angel-shortcut',
    },
    'angel-shortcut': {
      id: 'angel-shortcut',
      speaker: 'angel',
      expression: 'excited',
      text: 'We taking too long! I know a shortcut.',
      next: 'junior-warning',
    },
    'junior-warning': {
      id: 'junior-warning',
      speaker: 'junior',
      expression: 'thinking',
      text: 'A shortcut is often simply a longer route whose problems have not yet introduced themselves.',
      next: 'angel-reply',
    },
    'angel-reply': {
      id: 'angel-reply',
      speaker: 'angel',
      expression: 'thinking',
      text: 'Junior. Normal people does just say no.',
      next: 'opening-decision',
    },
    'opening-decision': {
      id: 'opening-decision',
      speaker: 'lexi',
      expression: 'happy',
      text: 'We all want the wings to be ready. What should we try?',
      choices: openingChoices,
    },
    'junior-reaction': {
      id: 'junior-reaction',
      speaker: 'junior',
      expression: 'happy',
      text: 'Good plan. We can finish each step and make the wings strong.',
      conditions: [{ key: 'openingChoice', operator: 'equals', value: 'follow-junior' }],
      end: true,
    },
    'angel-reaction': {
      id: 'angel-reaction',
      speaker: 'angel',
      expression: 'excited',
      text: 'Yes! Quick and clever. Leave the shortcut to me!',
      conditions: [{ key: 'usedShortcut', operator: 'equals', value: true }],
      end: true,
    },
    'together-reaction': {
      id: 'together-reaction',
      speaker: 'lexi',
      expression: 'excited',
      text: 'That gives us Junior’s careful steps and Angel’s bright idea. Teamwork!',
      conditions: [
        { key: 'combinedIdeas', operator: 'equals', value: true },
        { key: 'cooperation', operator: 'greater-than-or-equal', value: 1 },
      ],
      end: true,
    },
  },
};
