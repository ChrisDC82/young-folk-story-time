import Phaser from 'phaser';
import type { DialogueLine } from '../../types/dialogue';
import { shouldReduceMotion } from '../systems/MotionPreference';
import { GameButton } from './GameButton';

export class DialogueBox extends Phaser.GameObjects.Container {
  private readonly speakerText: Phaser.GameObjects.Text;
  private readonly bodyText: Phaser.GameObjects.Text;
  private readonly continueButton: GameButton;
  private advanceHandler?: () => void;

  constructor(scene: Phaser.Scene) {
    super(scene, 640, 570);
    scene.add.existing(this);

    const shadow = scene.add.graphics();
    shadow.fillStyle(0x160c2b, 0.45);
    shadow.fillRoundedRect(-574, -126, 1156, 234, 32);

    const panel = scene.add.graphics();
    panel.fillStyle(0xfffbdf, 0.98);
    panel.lineStyle(6, 0x6d3f91, 1);
    panel.fillRoundedRect(-584, -138, 1156, 234, 32);
    panel.strokeRoundedRect(-584, -138, 1156, 234, 32);

    this.speakerText = scene.add.text(-540, -108, '', {
      fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
      fontSize: '30px',
      fontStyle: 'bold',
      color: '#8d2f73',
    });

    this.bodyText = scene.add.text(-540, -62, '', {
      fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
      fontSize: '30px',
      color: '#27163d',
      lineSpacing: 8,
      wordWrap: { width: 790 },
    });

    this.continueButton = new GameButton(scene, 410, 33, 'Continue  ▶', () => this.advance(), {
      width: 260,
      height: 72,
      fontSize: 28,
    });
    this.continueButton.removeFromDisplayList();
    this.add([shadow, panel, this.speakerText, this.bodyText, this.continueButton]);
    this.setDepth(50).setVisible(false);
  }

  show(line: DialogueLine, onAdvance: () => void): void {
    this.speakerText.setText(line.speaker);
    this.bodyText.setText(line.text);
    this.advanceHandler = onAdvance;
    this.scene.tweens.killTweensOf(this);
    if (shouldReduceMotion()) {
      this.setVisible(true).setAlpha(1).setY(552);
    } else {
      this.setVisible(true).setAlpha(0);
      this.scene.tweens.add({ targets: this, alpha: 1, y: 552, duration: 260, ease: 'Back.Out' });
    }
  }

  handleKeyboardAdvance(): void {
    if (this.visible) this.advance();
  }

  private advance(): void {
    if (!this.visible || !this.advanceHandler) return;
    const callback = this.advanceHandler;
    this.advanceHandler = undefined;
    if (shouldReduceMotion()) {
      this.setVisible(false).setAlpha(0).setY(570);
      callback();
      return;
    }
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      y: 570,
      duration: 160,
      onComplete: () => {
        this.setVisible(false);
        callback();
      },
    });
  }
}
