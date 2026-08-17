import Phaser from 'phaser';
import type { PanZoneDefinition } from '../../types/panJam';

export class PanZone extends Phaser.GameObjects.Container {
  readonly definition: PanZoneDefinition;
  private readonly plate: Phaser.GameObjects.Graphics;
  private readonly glow: Phaser.GameObjects.Graphics;
  private enabled = false;
  private readonly activateHandler: (zone: PanZone) => void;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    definition: PanZoneDefinition,
    onActivate: (zone: PanZone) => void,
  ) {
    super(scene, x, y);
    scene.add.existing(this);
    this.definition = definition;
    this.activateHandler = onActivate;

    this.glow = scene.add.graphics().setAlpha(0);
    this.glow.fillStyle(0xfff4a8, 0.42);
    this.glow.fillEllipse(0, 0, 246, 174);
    this.plate = scene.add.graphics();
    this.drawPlate(false);
    const symbol = scene.add
      .text(0, -18, definition.symbol, {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '64px',
        fontStyle: 'bold',
        color: '#fffbe0',
        stroke: '#3d2159',
        strokeThickness: 7,
      })
      .setOrigin(0.5);
    const label = scene.add
      .text(0, 49, `${definition.keyboardKey} · ${definition.label}`, {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '23px',
        fontStyle: 'bold',
        color: '#2b1648',
        backgroundColor: '#fff8dccc',
        padding: { x: 12, y: 5 },
      })
      .setOrigin(0.5);

    this.add([this.glow, this.plate, symbol, label]);
    this.setSize(236, 166).setDepth(35).setInteractive({ useHandCursor: true });
    this.disableInteractive();
    this.on(Phaser.Input.Events.POINTER_DOWN, () => {
      if (this.enabled) this.drawPlate(true);
    });
    this.on(Phaser.Input.Events.POINTER_UP, () => {
      if (!this.enabled) return;
      this.drawPlate(false);
      this.activateHandler(this);
    });
    this.on(Phaser.Input.Events.POINTER_OUT, () => this.drawPlate(false));
  }

  setEnabled(enabled: boolean): this {
    this.enabled = enabled;
    if (enabled) this.setInteractive({ useHandCursor: true });
    else this.disableInteractive();
    this.setAlpha(enabled ? 1 : 0.78);
    return this;
  }

  activateFromKeyboard(): void {
    if (this.enabled) this.activateHandler(this);
  }

  playCue(duration: number, reducedMotion: boolean): void {
    this.scene.tweens.killTweensOf([this, this.glow]);
    this.glow.setAlpha(1);
    this.drawPlate(true);
    if (!reducedMotion) this.setScale(0.94);
    this.scene.tweens.add({
      targets: this,
      scale: 1,
      duration: reducedMotion ? 40 : 150,
      ease: 'Back.Out',
    });
    this.scene.tweens.add({
      targets: this.glow,
      alpha: 0,
      duration,
      onComplete: () => this.drawPlate(false),
    });
  }

  gentlyReturn(): void {
    this.scene.tweens.killTweensOf(this);
    this.scene.tweens.add({
      targets: this,
      x: this.x + 5,
      duration: 55,
      yoyo: true,
      repeat: 2,
      ease: 'Sine.InOut',
    });
  }

  private drawPlate(active: boolean): void {
    this.plate.clear();
    this.plate.fillStyle(active ? 0xfff4a8 : this.definition.color, active ? 1 : 0.94);
    this.plate.lineStyle(active ? 8 : 5, active ? this.definition.color : 0xfff8dc, 1);
    this.plate.fillEllipse(0, 0, active ? 220 : 230, active ? 146 : 156);
    this.plate.strokeEllipse(0, 0, active ? 220 : 230, active ? 146 : 156);
    this.plate.lineStyle(3, 0x5b3a70, 0.65);
    if (this.definition.shape === 'diamond') {
      this.plate.strokePoints([
        new Phaser.Geom.Point(0, -62),
        new Phaser.Geom.Point(91, 0),
        new Phaser.Geom.Point(0, 62),
        new Phaser.Geom.Point(-91, 0),
      ], true);
    } else if (this.definition.shape === 'sun') {
      this.plate.strokeCircle(0, 0, 60);
    } else if (this.definition.shape === 'moon') {
      this.plate.beginPath();
      this.plate.arc(-10, 0, 62, -1.25, 1.25);
      this.plate.strokePath();
    } else {
      this.plate.strokeRoundedRect(-78, -53, 156, 106, 42);
    }
  }
}
