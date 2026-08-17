import Phaser from 'phaser';

export interface SceneHotspotOptions {
  label: string;
  icon: string;
  color: number;
  reducedMotion?: boolean;
}

export class SceneHotspot extends Phaser.GameObjects.Container {
  private activated = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    options: SceneHotspotOptions,
    onActivate: () => void,
  ) {
    super(scene, x, y);
    scene.add.existing(this);

    const glow = scene.add.circle(0, 0, 65, options.color, 0.2);
    const ring = scene.add.circle(0, 0, 51, options.color, 0.12).setStrokeStyle(6, 0xfff4c2, 0.95);
    const icon = scene.add
      .text(0, -2, options.icon, {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '43px',
        fontStyle: 'bold',
        color: '#fff8dc',
        stroke: '#4e2869',
        strokeThickness: 7,
      })
      .setOrigin(0.5);
    const label = scene.add
      .text(0, 71, options.label, {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '19px',
        fontStyle: 'bold',
        color: '#fffbe0',
        backgroundColor: '#2b1648dd',
        padding: { x: 12, y: 7 },
      })
      .setOrigin(0.5);

    this.add([glow, ring, icon, label]);
    this.setSize(160, 160).setDepth(24).setInteractive({ useHandCursor: true });
    this.on(Phaser.Input.Events.POINTER_UP, () => {
      if (this.activated) return;
      this.activated = true;
      this.disableInteractive();
      scene.tweens.add({
        targets: this,
        scale: 1.12,
        alpha: 0,
        duration: options.reducedMotion ? 80 : 260,
        onComplete: () => this.setVisible(false),
      });
      onActivate();
    });

    if (!options.reducedMotion) {
      scene.tweens.add({
        targets: [glow, ring],
        scale: 1.12,
        alpha: { from: 0.86, to: 0.28 },
        duration: 1100,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.InOut',
      });
    }
  }

  activateFromKeyboard(): void {
    if (!this.activated) this.emit(Phaser.Input.Events.POINTER_UP);
  }
}
