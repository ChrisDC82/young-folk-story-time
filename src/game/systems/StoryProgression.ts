import type { EpisodeStage } from '../../types/flow';
import { GameStateManager } from './GameStateManager';

export class StoryProgression {
  private static instance?: StoryProgression;
  private stage: EpisodeStage = 'title';

  constructor(private readonly state: GameStateManager) {}

  static get shared(): StoryProgression {
    StoryProgression.instance ??= new StoryProgression(GameStateManager.shared);
    return StoryProgression.instance;
  }

  get currentStage(): EpisodeStage {
    return this.stage;
  }

  get carnivalReady(): boolean {
    return this.stage === 'carnival' && this.state.get('costumeCompleted');
  }

  startNewStory(): EpisodeStage {
    this.state.reset();
    this.stage = 'club';
    return this.stage;
  }

  enterCostume(): EpisodeStage {
    if (!this.state.get('openingChoice')) throw new Error('The opening choice must be completed before the costume challenge.');
    this.stage = 'costume';
    return this.stage;
  }

  enterStoryTime(): EpisodeStage {
    if (!this.state.get('costumeCompleted')) throw new Error('The costume challenge must be completed before Story Time.');
    this.stage = 'story-time';
    return this.stage;
  }

  arriveAtCarnival(): EpisodeStage {
    if (this.stage !== 'story-time') throw new Error('Story Time must begin before Carnival arrival.');
    this.stage = 'carnival';
    return this.stage;
  }

  completeMilestone4(): EpisodeStage {
    if (!this.carnivalReady) throw new Error('Carnival must be ready before Milestone 4 can complete.');
    this.stage = 'milestone-4-complete';
    return this.stage;
  }
}
