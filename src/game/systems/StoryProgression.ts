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

  get panJamReady(): boolean {
    return this.stage === 'pan-jam' && this.state.get('costumeCompleted');
  }

  get mokoJumbieReady(): boolean {
    return this.stage === 'moko-jumbie' && this.state.get('panCompleted');
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

  enterPanJam(): EpisodeStage {
    if (!this.carnivalReady) throw new Error('Carnival arrival must be complete before Pan Jam.');
    this.stage = 'pan-jam';
    return this.stage;
  }

  replayPanJam(): EpisodeStage {
    if (this.stage !== 'milestone-5-complete') throw new Error('Pan Jam can replay only after completion.');
    this.stage = 'pan-jam';
    return this.stage;
  }

  completeMilestone5(): EpisodeStage {
    if (!this.panJamReady || !this.state.get('panCompleted')) {
      throw new Error('All Pan Jam rounds must be complete before Milestone 5 can finish.');
    }
    this.stage = 'milestone-5-complete';
    return this.stage;
  }

  enterMokoJumbie(): EpisodeStage {
    if (this.stage !== 'milestone-5-complete' || !this.state.get('panCompleted')) {
      throw new Error('The Rhythm Star must be earned before the Moko Jumbie sequence.');
    }
    this.stage = 'moko-jumbie';
    return this.stage;
  }

  completeMilestone6(): EpisodeStage {
    if (!this.mokoJumbieReady || !this.state.get('angelMokoResponse')) {
      throw new Error('Angel must receive a response before Milestone 6 can finish.');
    }
    this.stage = 'milestone-6-complete';
    return this.stage;
  }
}
