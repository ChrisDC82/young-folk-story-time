import Phaser from 'phaser';
import { carnivalChoicesEpisode } from '../../episodes/carnival-choices/episode';
import type { CharacterExpression } from '../../types/characters';
import { AudioManager } from '../systems/AudioManager';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload(): void {
    AudioManager.shared.bind(this);
    this.cameras.main.setBackgroundColor('#2f1951');

    const title = this.add
      .text(640, 280, 'Gathering our story…', {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '38px',
        fontStyle: 'bold',
        color: '#fff8dc',
      })
      .setOrigin(0.5);
    const track = this.add.rectangle(640, 360, 520, 32, 0x160c2b, 0.85).setStrokeStyle(3, 0xffe68c);
    const fill = this.add.rectangle(386, 360, 0, 22, 0xf3a712).setOrigin(0, 0.5);
    const percent = this.add
      .text(640, 414, '0%', {
        fontFamily: 'Trebuchet MS, sans-serif',
        fontSize: '26px',
        color: '#fff8dc',
      })
      .setOrigin(0.5);

    this.load.on(Phaser.Loader.Events.PROGRESS, (value: number) => {
      fill.width = 508 * value;
      percent.setText(`${Math.round(value * 100)}%`);
    });
    this.load.once(Phaser.Loader.Events.COMPLETE, () => {
      title.setText('Story ready!');
      track.setStrokeStyle(3, 0x72d69c);
    });

    this.load.image('cc-club', carnivalChoicesEpisode.assets.clubBackground);
    this.load.image('lexi-making-wings', carnivalChoicesEpisode.assets.lexiMakingWings);
    this.load.image('story-pot', carnivalChoicesEpisode.assets.storyPot);
    this.load.image('carnival-background', carnivalChoicesEpisode.assets.carnivalBackground);
    this.load.image('pan-jam-background', carnivalChoicesEpisode.assets.panJamBackground);
    Object.values(carnivalChoicesEpisode.characters).forEach((character) => {
      (Object.keys(character.assets) as CharacterExpression[]).forEach((expression) => {
        const assetPath = character.assets[expression];
        const textureKey = character.textures[expression];
        if (assetPath && textureKey && !this.textures.exists(textureKey)) {
          this.load.image(textureKey, assetPath);
        }
      });
    });
  }

  create(): void {
    this.time.delayedCall(250, () => this.scene.start('TitleScene'));
  }
}
