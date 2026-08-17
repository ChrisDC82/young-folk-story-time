import Phaser from 'phaser';
import { AudioManager } from '../systems/AudioManager';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create(): void {
    AudioManager.shared.bind(this);
    this.scene.start('PreloadScene');
  }
}
