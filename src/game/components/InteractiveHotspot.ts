import Phaser from 'phaser';

export class InteractiveHotspot extends Phaser.GameObjects.Container {
  private readonly ring: Phaser.GameObjects.Arc;
  private readonly label: Phaser.GameObjects.Text;
  private activated = false;

  constructor(scene: Phaser.Scene, x: number, y: number, onActivate: () => void) {
    super(scene, x, y);
    scene.add.existing(this);

    const glow = scene.add.circle(0, 0, 78, 0xffd43b, 0.16);
    this.ring = scene.add.circle(0, 0, 62, 0xffd43b, 0.08).setStrokeStyle(7, 0xffeb73, 1);
    const icon = scene.add
      .text(0, -2, '♪', {
        fontFamily: 'Trebuchet MS, sans-serif',
        fontSize: '58px',
        fontStyle: 'bold',
        color: '#fff8b5',
        stroke: '#5d2a7a',
        strokeThickness: 7,
      })
      .setOrigin(0.5);
    this.label = scene.add
      .text(0, 86, 'Explore the steelpan', {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '22px',
        fontStyle: 'bold',
        color: '#fffbe0',
        backgroundColor: '#492260dd',
        padding: { x: 15, y: 8 },
      })
      .setOrigin(0.5);

    this.add([glow, this.ring, icon, this.label]);
    this.setSize(190, 190).setDepth(15).setInteractive({ useHandCursor: true });
    this.on(Phaser.Input.Events.POINTER_UP, () => {
      if (this.activated) return;
      this.activated = true;
      this.disableInteractive();
      scene.tweens.add({
        targets: this,
        scale: 1.16,
        alpha: 0,
        duration: 260,
        onComplete: () => this.setVisible(false),
      });
      onActivate();
    });

    scene.tweens.add({
      targets: [this.ring, glow],
      scale: 1.16,
      alpha: { from: 0.9, to: 0.25 },
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.InOut',
    });
  }

  activateFromKeyboard(): void {
    if (!this.activated) this.emit(Phaser.Input.Events.POINTER_UP);
  }
}
