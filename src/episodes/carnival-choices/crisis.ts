import type { CharacterDialogueLine } from '../../types/carnival';
import type { RepairMaterial } from '../../types/crisis';
import type { CarnivalGameState } from '../../types/gameState';
import type { StoryChoice, StoryDefinition, StoryNode } from '../../types/narrative';

const sharedCrisisChoices = [
  {
    id: 'crisis-blame',
    label: 'Whose fault is this?',
    confirmation: 'Lexi asks who caused the problem.',
    next: 'blame-reaction',
    effects: [
      { key: 'blamedSomeone', operation: 'set', value: true },
      { key: 'crisisChoice', operation: 'set', value: 'blame' },
    ],
  },
  {
    id: 'crisis-repair-together',
    label: 'Let’s fix it together.',
    confirmation: 'Lexi invites everyone to use their strengths.',
    next: 'together-reaction',
    effects: [
      { key: 'repairedMistakeTogether', operation: 'set', value: true },
      { key: 'cooperation', operation: 'add', value: 1 },
      { key: 'crisisChoice', operation: 'set', value: 'repair-together' },
    ],
  },
  {
    id: 'crisis-ask-for-help',
    label: 'Let’s ask someone for help.',
    confirmation: 'Lexi chooses to bring in a helpful pair of hands.',
    next: 'help-reaction',
    effects: [
      { key: 'askedForHelp', operation: 'set', value: true },
      { key: 'askedForCrisisHelp', operation: 'set', value: true },
      { key: 'crisisChoice', operation: 'set', value: 'ask-for-help' },
    ],
  },
] satisfies StoryChoice[];

const shortcutAdmissionChoices = [
  {
    id: 'crisis-ask-angel-high-trust',
    label: 'Angel, tell me what happened.',
    confirmation: 'Lexi gives Angel room to tell the truth.',
    next: 'angel-admits-shortcut',
    conditions: [
      { key: 'angelTrust', operator: 'greater-than-or-equal', value: 1 },
      { key: 'dismissedAngelFear', operator: 'equals', value: false },
    ],
    effects: [
      { key: 'angelAdmittedShortcut', operation: 'set', value: true },
      { key: 'crisisChoice', operation: 'set', value: 'ask-angel' },
    ],
  },
  {
    id: 'crisis-ask-angel-low-trust',
    label: 'Angel, tell me what happened.',
    confirmation: 'Angel is not ready to explain everything, but the repair can continue.',
    next: 'angel-hesitates',
    conditions: [{ key: 'angelTrust', operator: 'less-than', value: 1 }],
    effects: [{ key: 'crisisChoice', operation: 'set', value: 'ask-angel' }],
  },
  {
    id: 'crisis-ask-angel-dismissed',
    label: 'Angel, tell me what happened.',
    confirmation: 'Angel is guarded after the earlier conversation, but the repair can continue.',
    next: 'angel-hesitates',
    conditions: [
      { key: 'angelTrust', operator: 'greater-than-or-equal', value: 1 },
      { key: 'dismissedAngelFear', operator: 'equals', value: true },
    ],
    effects: [{ key: 'crisisChoice', operation: 'set', value: 'ask-angel' }],
  },
] satisfies StoryChoice[];

const sharedReactionNodes: Record<string, StoryNode> = {
  'blame-reaction': {
    id: 'blame-reaction',
    speaker: 'angel',
    expression: 'thinking',
    text: 'Everybody was working on it! We can talk about fault after the costume is safe.',
    next: 'junior-focuses-repair',
  },
  'junior-focuses-repair': {
    id: 'junior-focuses-repair',
    speaker: 'junior',
    expression: 'thinking',
    text: 'First, we need a secure fastening. We can solve that part now.',
    end: true,
  },
  'together-reaction': {
    id: 'together-reaction',
    speaker: 'lexi',
    expression: 'happy',
    text: 'Junior can line it up, Angel can hold it steady, and I can fasten it!',
    end: true,
  },
  'help-reaction': {
    id: 'help-reaction',
    speaker: 'junior',
    expression: 'happy',
    text: 'Good asking. A Carnival helper shows us the safety clips in the repair kit.',
    end: true,
  },
  'angel-admits-shortcut': {
    id: 'angel-admits-shortcut',
    speaker: 'angel',
    expression: 'thinking',
    text: 'I skipped one of the steps.',
    next: 'lexi-thanks-angel',
  },
  'lexi-thanks-angel': {
    id: 'lexi-thanks-angel',
    speaker: 'lexi',
    expression: 'happy',
    text: 'Thanks for telling me.',
    end: true,
  },
  'angel-hesitates': {
    id: 'angel-hesitates',
    speaker: 'angel',
    expression: 'thinking',
    text: 'I… maybe one of the fastenings just shifted.',
    next: 'lexi-keeps-repair-open',
  },
  'lexi-keeps-repair-open': {
    id: 'lexi-keeps-repair-open',
    speaker: 'lexi',
    expression: 'happy',
    text: 'Okay. We can still make it secure together.',
    end: true,
  },
};

export const shortcutCrisisStory: StoryDefinition = {
  id: 'carnival-crisis-shortcut',
  startNodeId: 'shortcut-crisis-begins',
  nodes: {
    'shortcut-crisis-begins': {
      id: 'shortcut-crisis-begins',
      speaker: 'lexi',
      expression: 'excited',
      text: 'The parade moves forward—and Lexi’s butterfly wings begin to flutter!',
      actions: [
        { key: 'crisisTriggered', operation: 'set', value: true },
        { key: 'wingStrapBroke', operation: 'set', value: true },
        { key: 'nearbyCostumeProblem', operation: 'set', value: false },
      ],
      next: 'strap-comes-loose',
    },
    'strap-comes-loose': {
      id: 'strap-comes-loose',
      speaker: 'lexi',
      expression: 'surprised',
      text: 'Oh! One wing fastening has come loose.',
      next: 'angel-remembers-shortcut',
    },
    'angel-remembers-shortcut': {
      id: 'angel-remembers-shortcut',
      speaker: 'angel',
      expression: 'thinking',
      text: 'That fastening… I remember the shortcut.',
      next: 'junior-spots-step',
    },
    'junior-spots-step': {
      id: 'junior-spots-step',
      speaker: 'junior',
      expression: 'thinking',
      text: 'A fastening step was missed. The wing can still be secured safely.',
      next: 'shortcut-crisis-choice',
    },
    'shortcut-crisis-choice': {
      id: 'shortcut-crisis-choice',
      speaker: 'lexi',
      expression: 'thinking',
      text: 'The parade is still moving. What should Lexi do?',
      choices: [...sharedCrisisChoices, ...shortcutAdmissionChoices],
    },
    ...sharedReactionNodes,
  },
};

export const nonShortcutCrisisStory: StoryDefinition = {
  id: 'carnival-crisis-non-shortcut',
  startNodeId: 'careful-plan-holds',
  nodes: {
    'careful-plan-holds': {
      id: 'careful-plan-holds',
      speaker: 'lexi',
      expression: 'excited',
      text: 'The parade moves forward, and Lexi’s carefully fastened wings stay strong.',
      actions: [
        { key: 'crisisTriggered', operation: 'set', value: true },
        { key: 'wingStrapBroke', operation: 'set', value: false },
        { key: 'nearbyCostumeProblem', operation: 'set', value: true },
      ],
      next: 'nearby-costume-loose',
    },
    'nearby-costume-loose': {
      id: 'nearby-costume-loose',
      speaker: 'junior',
      expression: 'surprised',
      text: 'A nearby masquerader’s shoulder decoration has come loose. They need a quick, safe repair.',
      next: 'non-shortcut-crisis-choice',
    },
    'non-shortcut-crisis-choice': {
      id: 'non-shortcut-crisis-choice',
      speaker: 'lexi',
      expression: 'thinking',
      text: 'We can help before the next parade turn. What should Lexi do?',
      choices: sharedCrisisChoices,
    },
    ...sharedReactionNodes,
  },
};

export const crisisRepairMaterials: readonly RepairMaterial[] = [
  { id: 'ribbon', label: 'Soft ribbon', shortLabel: 'Ribbon', symbol: '〰', color: 0xf49ac2 },
  { id: 'safety-clip', label: 'Safety clip', shortLabel: 'Clip', symbol: '◇', color: 0xffd34e },
  { id: 'confetti', label: 'Confetti stars', shortLabel: 'Stars', symbol: '★', color: 0x57c7e3 },
];

export function crisisResolutionDialogue(state: Readonly<CarnivalGameState>): readonly CharacterDialogueLine[] {
  const subject = state.wingStrapBroke ? 'Lexi’s wing' : 'the nearby costume';
  if (state.repairedMistakeTogether) {
    return [
      { characterId: 'junior', expression: 'happy', speaker: 'Junior', text: 'I lined up the fastening.' },
      { characterId: 'angel', expression: 'happy', speaker: 'Angel', text: 'I held it steady—even with all these arms!' },
      { characterId: 'lexi', expression: 'excited', speaker: 'Lexi', text: `And I secured the clip. ${subject} is parade-ready!` },
    ];
  }
  if (state.askedForCrisisHelp) {
    return [
      { characterId: 'junior', expression: 'happy', speaker: 'Junior', text: 'The helper’s safety clip is holding firmly.' },
      { characterId: 'lexi', expression: 'excited', speaker: 'Lexi', text: `Asking for help got ${subject} safely back into the parade!` },
    ];
  }
  if (state.crisisChoice === 'ask-angel') {
    return [
      { characterId: 'angel', expression: 'happy', speaker: 'Angel', text: 'I can hold the fastening while you press the clip.' },
      { characterId: 'lexi', expression: 'excited', speaker: 'Lexi', text: `${subject} is secure. We fixed the problem in time!` },
    ];
  }
  return [
    { characterId: 'junior', expression: 'thinking', speaker: 'Junior', text: 'The fastening is secure. We solved the immediate problem.' },
    { characterId: 'angel', expression: 'thinking', speaker: 'Angel', text: 'Good. We can talk about the rest when the parade is safe.' },
  ];
}
