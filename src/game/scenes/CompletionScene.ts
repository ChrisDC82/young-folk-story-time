import Phaser from 'phaser';
import { costumeStepOrder } from '../../episodes/carnival-choices/costume';
import type { OpeningChoiceId } from '../../types/gameState';
import { addMuteControl } from '../components/MuteControl';
import { GameButton } from '../components/GameButton';
import { CostumeSequenceGame } from '../minigames/costume/CostumeSequenceGame';
import { AudioManager } from '../systems/AudioManager';
import { GameStateManager } from '../systems/GameStateManager';
import { StoryProgression } from '../systems/StoryProgression';

interface BranchPresentation {
  title: string;
  summary: string;
  color: string;
}

const BRANCH_PRESENTATIONS: Record<OpeningChoiceId, BranchPresentation> = {
  'follow-junior': {
    title: 'Junior’s Plan',
    summary: 'The friends will follow each instruction and fasten every piece carefully.',
    color: '#8fe0a7',
  },
  'follow-angel': {
    title: 'Angel’s Shortcut',
    summary: 'The friends will try Angel’s faster way. The shortcut is now part of the story state.',
    color: '#e2a6ff',
  },
  'work-together': {
    title: 'A Team Plan',
    summary: 'The friends will combine Angel’s bright idea with Junior’s careful instructions.',
    color: '#ffe36e',
  },
};

export class CompletionScene extends Phaser.Scene {
  constructor() {
    super('CompletionScene');
  }

  create(): void {
    AudioManager.shared.bind(this);
    const state = GameStateManager.shared.snapshot;
    const branch = state.openingChoice ? BRANCH_PRESENTATIONS[state.openingChoice] : undefined;

    this.add.image(640, 360, 'cc-club').setDisplaySize(1280, 720);
    this.add.rectangle(640, 360, 1280, 720, 0x2d1749, 0.88);
    this.add
      .text(640, 105, 'The Carnival wings are ready!', {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '50px',
        fontStyle: 'bold',
        color: '#fff8dc',
        stroke: '#6d3f91',
        strokeThickness: 10,
      })
      .setOrigin(0.5);
    this.add
      .text(640, 185, '★  CREATOR BADGE  ★', {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '43px',
        fontStyle: 'bold',
        color: '#ffe36e',
      })
      .setOrigin(0.5);
    this.add
      .text(640, 280, 'You shaped, coloured, decorated, and attached the straps in order.', {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '27px',
        color: '#fff8dc',
        align: 'center',
        wordWrap: { width: 850 },
      })
      .setOrigin(0.5);

    this.add
      .text(640, 370, branch ? `Your story plan stays with you: ${branch.title}` : 'Your story choice is safely remembered.', {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '28px',
        fontStyle: 'bold',
        color: branch?.color ?? '#fff8dc',
        align: 'center',
        wordWrap: { width: 900 },
      })
      .setOrigin(0.5);
    this.add
      .text(640, 420, branch?.summary ?? '', {
        fontFamily: 'Trebuchet MS, sans-serif',
        fontSize: '21px',
        color: '#fff8dc',
        align: 'center',
        wordWrap: { width: 900 },
      })
      .setOrigin(0.5);

    const storyTime = () => {
      StoryProgression.shared.enterStoryTime();
      this.input.enabled = false;
      this.cameras.main.fadeOut(450, 255, 214, 77);
      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => this.scene.start('StoryTimeScene'));
    };
    const replayCostume = () => {
      new CostumeSequenceGame(GameStateManager.shared, costumeStepOrder).restartChallenge();
      StoryProgression.shared.enterCostume();
      this.input.enabled = false;
      this.cameras.main.fadeOut(350, 48, 23, 76);
      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
        this.scene.start('CostumeGameScene');
      });
    };
    new GameButton(this, 385, 525, 'Try the costume again', replayCostume, { width: 365, height: 82, fontSize: 27 });
    new GameButton(this, 875, 525, 'STORY TIME!  ✨', storyTime, {
      width: 390,
      height: 88,
      fontSize: 32,
      fillColor: 0xffd34e,
    });
    this.add
      .text(640, 610, 'The magical story pot is ready • Press Enter for Story Time', {
        fontFamily: 'Trebuchet MS, sans-serif',
        fontSize: '22px',
        color: '#fff8dc',
      })
      .setOrigin(0.5);

    addMuteControl(this);
    const enterKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    enterKey?.once(Phaser.Input.Keyboard.Events.DOWN, storyTime);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => enterKey?.destroy());
    this.cameras.main.fadeIn(600, 255, 211, 71);
  }
}
