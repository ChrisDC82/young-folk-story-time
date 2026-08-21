import type { EndingDefinition, StoryCardAchievement, StoryCardData } from '../../types/endings';
import type { CarnivalGameState } from '../../types/gameState';

export class StoryCardBuilder {
  static build(state: Readonly<CarnivalGameState>, ending: EndingDefinition): StoryCardData {
    const achievements: StoryCardAchievement[] = [];
    if (state.costumeCompleted) {
      achievements.push({
        id: 'creator-badge',
        label: 'CREATOR BADGE',
        symbol: '🦋',
        description: 'Made Lexi’s Carnival wings',
        source: 'milestone',
      });
    }
    if (state.panCompleted) {
      achievements.push({
        id: 'rhythm-star',
        label: 'RHYTHM STAR',
        symbol: '♪',
        description: 'Learned the Pan Jam rhythm',
        source: 'milestone',
      });
    }
    achievements.push({
      ...ending.badge,
      source: 'ending',
    });

    const accomplishments: string[] = [];
    if (state.offeredToStayWithAngel) accomplishments.push('You stayed close when Angel needed a friend.');
    else if (state.askedAngelWhatWasWrong) accomplishments.push('You gave Angel room to explain how she felt.');
    else if (state.askedForHelp) accomplishments.push('You knew that asking for help can move a team forward.');
    else if (state.followedInstructions) accomplishments.push('You listened carefully and followed the steps.');

    if (state.repairedMistakeTogether) accomplishments.push('You brought everyone’s strengths into the repair.');
    else if (state.askedForCrisisHelp) accomplishments.push('You welcomed a helpful pair of hands during the crisis.');
    else if (state.angelAdmittedShortcut) accomplishments.push('You made room for honesty after a mistake.');
    else accomplishments.push('You helped solve the Carnival costume problem.');

    accomplishments.push('You created Carnival wings and earned the Creator Badge.');
    accomplishments.push('You learned a steelpan rhythm and earned the Rhythm Star.');

    return Object.freeze({
      heading: 'YOUR CARNIVAL STORY',
      endingId: ending.id,
      endingTitle: ending.title,
      reflection: ending.reflection,
      achievements: Object.freeze(achievements.map((achievement) => Object.freeze({ ...achievement }))),
      accomplishments: Object.freeze(accomplishments.slice(0, 4)),
    });
  }
}
