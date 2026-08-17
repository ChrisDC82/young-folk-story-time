import Phaser from 'phaser';
import { carnivalChoicesEpisode } from '../../episodes/carnival-choices/episode';
import { addMuteControl } from '../components/MuteControl';
import { GameButton } from '../components/GameButton';
import { AudioManager } from '../systems/AudioManager';
import { GameStateManager } from '../systems/GameStateManager';

export class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
  }

  create(): void {
    AudioManager.shared.bind(this);
    this.add.image(640, 360, 'cc-club').setDisplaySize(1280, 720);
    this.add.rectangle(640, 360, 1280, 720, 0x24123d, 0.62);

    this.add
      .text(640, 170, carnivalChoicesEpisode.title, {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '64px',
        fontStyle: 'bold',
        color: '#fff8dc',
        stroke: '#4e2869',
        strokeThickness: 12,
        align: 'center',
      })
      .setOrigin(0.5);

    this.add
      .text(640, 275, carnivalChoicesEpisode.subtitle, {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '54px',
        fontStyle: 'bold',
        color: '#ffd64f',
        stroke: '#8d2f73',
        strokeThickness: 9,
      })
      .setOrigin(0.5);

    const start = () => {
      GameStateManager.shared.reset();
      this.input.enabled = false;
      this.cameras.main.fadeOut(420, 48, 23, 76);
      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
        this.scene.start('ClubScene');
      });
    };

    new GameButton(this, 640, 470, 'Start the story', start, { width: 390, height: 92, fontSize: 36 });
    this.add
      .text(640, 548, 'Tap, click, or press Enter', {
        fontFamily: 'Trebuchet MS, sans-serif',
        fontSize: '22px',
        color: '#fff8dc',
      })
      .setOrigin(0.5);

    addMuteControl(this);
    const enterKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    enterKey?.once(Phaser.Input.Keyboard.Events.DOWN, start);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => enterKey?.destroy());
    this.cameras.main.fadeIn(350, 48, 23, 76);
  }
}
