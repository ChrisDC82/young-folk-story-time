import Phaser from 'phaser';
import type { OpeningChoiceId } from '../../types/gameState';
import { addMuteControl } from '../components/MuteControl';
import { GameButton } from '../components/GameButton';
import { AudioManager } from '../systems/AudioManager';
import { GameStateManager } from '../systems/GameStateManager';

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
    this.add.rectangle(640, 360, 1280, 720, 0x2d1749, 0.84);
    this.add
      .text(640, 145, 'Milestone 2 branch confirmed!', {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '54px',
        fontStyle: 'bold',
        color: '#fff8dc',
        stroke: '#6d3f91',
        strokeThickness: 10,
      })
      .setOrigin(0.5);
    this.add
      .text(640, 260, branch?.title ?? 'Opening choice pending', {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '46px',
        fontStyle: 'bold',
        color: branch?.color ?? '#ffe36e',
      })
      .setOrigin(0.5);
    this.add
      .text(640, 355, branch?.summary ?? 'Return to the title and begin the conversation.', {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '29px',
        color: '#fff8dc',
        align: 'center',
        wordWrap: { width: 850 },
      })
      .setOrigin(0.5);

    const restart = () => {
      this.input.enabled = false;
      this.cameras.main.fadeOut(350, 48, 23, 76);
      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => this.scene.start('TitleScene'));
    };
    new GameButton(this, 640, 505, 'Play another choice', restart, { width: 390, height: 86, fontSize: 31 });
    this.add
      .text(640, 575, 'Press Enter to return to the title', {
        fontFamily: 'Trebuchet MS, sans-serif',
        fontSize: '21px',
        color: '#fff8dc',
      })
      .setOrigin(0.5);

    addMuteControl(this);
    const enterKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    enterKey?.once(Phaser.Input.Keyboard.Events.DOWN, restart);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => enterKey?.destroy());
    this.cameras.main.fadeIn(600, 255, 211, 71);
  }
}
