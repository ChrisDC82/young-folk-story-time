import Phaser from 'phaser';
import type { MilestoneChoice } from '../../types/dialogue';
import { addMuteControl } from '../components/MuteControl';
import { GameButton } from '../components/GameButton';
import { AudioManager } from '../systems/AudioManager';

interface CompletionData {
  choice?: MilestoneChoice;
}

export class CompletionScene extends Phaser.Scene {
  private choice?: MilestoneChoice;

  constructor() {
    super('CompletionScene');
  }

  init(data: CompletionData): void {
    this.choice = data.choice;
  }

  create(): void {
    AudioManager.shared.bind(this);
    this.add.image(640, 360, 'cc-club').setDisplaySize(1280, 720);
    this.add.rectangle(640, 360, 1280, 720, 0x2d1749, 0.82);

    this.add
      .text(640, 170, 'Milestone 1 complete!', {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '58px',
        fontStyle: 'bold',
        color: '#ffe36e',
        stroke: '#6d3f91',
        strokeThickness: 10,
      })
      .setOrigin(0.5);
    this.add
      .text(640, 282, this.choice?.response ?? 'The first story path is ready.', {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '31px',
        color: '#fff8dc',
        align: 'center',
        wordWrap: { width: 820 },
      })
      .setOrigin(0.5);
    this.add
      .text(640, 380, 'The CC Club foundation is ready for the next chapter.', {
        fontFamily: 'Trebuchet MS, sans-serif',
        fontSize: '25px',
        color: '#f6dfff',
      })
      .setOrigin(0.5);

    const restart = () => {
      this.input.enabled = false;
      this.cameras.main.fadeOut(350, 48, 23, 76);
      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => this.scene.start('TitleScene'));
    };
    new GameButton(this, 640, 500, 'Play again', restart, { width: 330, height: 86, fontSize: 34 });
    this.add
      .text(640, 570, 'Press Enter to return to the title', {
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
