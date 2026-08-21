import Phaser from 'phaser';
import type { CostumeStep } from '../../types/minigames';

type CardHandler = (card: CostumeStepCard) => void;

export class CostumeStepCard extends Phaser.GameObjects.Container {
  readonly step: CostumeStep;
  readonly homeX: number;
  readonly homeY: number;

  private readonly background: Phaser.GameObjects.Graphics;
  private readonly hintGlow: Phaser.GameObjects.Graphics;
  private readonly reducedMotion: boolean;
  private enabled = true;
  private didDrag = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    step: CostumeStep,
    onDrop: CardHandler,
    onTap: CardHandler,
    reducedMotion = false,
  ) {
    super(scene, x, y);
    scene.add.existing(this);
    this.step = step;
    this.homeX = x;
    this.homeY = y;
    this.reducedMotion = reducedMotion;

    this.hintGlow = scene.add.graphics().setAlpha(0);
    this.hintGlow.lineStyle(7, 0xfff09a, 0.95);
    this.hintGlow.strokeRoundedRect(-105, -60, 210, 120, 24);
    this.background = scene.add.graphics();
    this.drawBackground(false);
    const icon = this.createIcon(step.id);
    const label = scene.add
      .text(23, 0, step.label, {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '22px',
        fontStyle: 'bold',
        color: '#32184f',
        align: 'center',
        wordWrap: { width: 132 },
      })
      .setOrigin(0.5);

    this.add([this.background, this.hintGlow, icon, label]);
    this.setSize(210, 120).setDepth(30);
    this.setInteractive({ useHandCursor: true });
    scene.input.setDraggable(this);

    this.on(Phaser.Input.Events.POINTER_DOWN, () => {
      if (!this.enabled) return;
      this.didDrag = false;
      this.setDepth(70);
      this.drawBackground(true);
    });
    this.on(Phaser.Input.Events.DRAG, (_pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
      if (!this.enabled) return;
      this.didDrag = true;
      this.setPosition(dragX, dragY);
    });
    this.on(Phaser.Input.Events.DRAG_END, () => {
      if (!this.enabled) return;
      this.setDepth(30);
      this.drawBackground(false);
      onDrop(this);
    });
    this.on(Phaser.Input.Events.POINTER_UP, () => {
      if (!this.enabled || this.didDrag) return;
      this.setDepth(30);
      this.drawBackground(false);
      onTap(this);
    });
    this.on(Phaser.Input.Events.POINTER_OVER, () => {
      if (this.enabled) this.drawBackground(true);
    });
    this.on(Phaser.Input.Events.POINTER_OUT, () => {
      if (this.enabled && !this.didDrag) this.drawBackground(false);
    });
  }

  moveToSlot(x: number, y: number): void {
    this.scene.tweens.killTweensOf(this);
    if (this.reducedMotion) {
      this.setPosition(x, y).setScale(0.86);
      return;
    }
    this.scene.tweens.add({ targets: this, x, y, scale: 0.86, duration: 220, ease: 'Back.Out' });
  }

  returnHome(delay = 0): void {
    this.scene.tweens.killTweensOf(this);
    if (this.reducedMotion) {
      this.setPosition(this.homeX, this.homeY).setScale(1).setAngle(0);
      return;
    }
    this.scene.tweens.add({
      targets: this,
      x: this.homeX,
      y: this.homeY,
      scale: 1,
      angle: 0,
      duration: 420,
      delay,
      ease: 'Back.Out',
    });
  }

  wobbleAndReturn(delay = 0): void {
    this.scene.tweens.killTweensOf(this);
    if (this.reducedMotion) {
      this.returnHome(delay);
      return;
    }
    this.scene.tweens.add({
      targets: this,
      angle: { from: -4, to: 4 },
      duration: 75,
      yoyo: true,
      repeat: 2,
      delay,
      onComplete: () => this.returnHome(),
    });
  }

  setHint(active: boolean): void {
    this.scene.tweens.killTweensOf(this.hintGlow);
    if (!active) {
      this.hintGlow.setAlpha(0);
      return;
    }
    if (this.reducedMotion) {
      this.hintGlow.setAlpha(0.9);
      return;
    }
    this.hintGlow.setAlpha(0.35);
    this.scene.tweens.add({
      targets: this.hintGlow,
      alpha: 0.9,
      duration: 700,
      yoyo: true,
      repeat: -1,
    });
  }

  setEnabled(enabled: boolean): this {
    this.enabled = enabled;
    if (enabled) this.setInteractive({ useHandCursor: true, draggable: true });
    else this.disableInteractive();
    return this;
  }

  private drawBackground(raised: boolean): void {
    this.background.clear();
    this.background.fillStyle(raised ? 0xfff7d7 : 0xfff2bd, 0.98);
    this.background.lineStyle(raised ? 6 : 4, raised ? 0xffdc63 : 0x6d3f91, 1);
    this.background.fillRoundedRect(-105, -60, 210, 120, 22);
    this.background.strokeRoundedRect(-105, -60, 210, 120, 22);
  }

  private createIcon(id: CostumeStep['id']): Phaser.GameObjects.Graphics {
    const icon = this.scene.add.graphics().setPosition(-63, 0);
    icon.lineStyle(4, 0x5b2c73, 1);

    if (id === 'shape') {
      icon.fillStyle(0xf49ac2, 1);
      icon.fillEllipse(-13, -8, 34, 48);
      icon.fillEllipse(13, -8, 34, 48);
      icon.strokeEllipse(-13, -8, 34, 48);
      icon.strokeEllipse(13, -8, 34, 48);
      icon.fillStyle(0xffd34e, 1);
      icon.fillRoundedRect(-5, -25, 10, 50, 5);
    } else if (id === 'colour') {
      icon.fillStyle(0xf7d98a, 1);
      icon.fillCircle(0, 0, 30);
      icon.strokeCircle(0, 0, 30);
      [0xf49ac2, 0x57c7e3, 0x79d18b, 0x9b6bd0].forEach((color, index) => {
        const angle = index * Math.PI * 0.5;
        icon.fillStyle(color, 1);
        icon.fillCircle(Math.cos(angle) * 16, Math.sin(angle) * 16, 6);
      });
    } else if (id === 'decorate') {
      icon.fillStyle(0xffd34e, 1);
      icon.fillPoints(this.starPoints(0, 0, 29, 13, 5), true);
      icon.strokePoints(this.starPoints(0, 0, 29, 13, 5), true);
      icon.fillStyle(0xf49ac2, 1);
      icon.fillCircle(-28, 20, 6);
      icon.fillStyle(0x57c7e3, 1);
      icon.fillCircle(29, -18, 7);
    } else {
      icon.lineStyle(7, 0x79d18b, 1);
      icon.beginPath();
      icon.arc(-13, 0, 19, Math.PI * 0.55, Math.PI * 1.45);
      icon.strokePath();
      icon.beginPath();
      icon.arc(13, 0, 19, -Math.PI * 0.45, Math.PI * 0.45);
      icon.strokePath();
      icon.fillStyle(0xffd34e, 1);
      icon.fillRoundedRect(-10, -8, 20, 16, 5);
    }
    return icon;
  }

  private starPoints(cx: number, cy: number, outer: number, inner: number, points: number): Phaser.Geom.Point[] {
    return Array.from({ length: points * 2 }, (_, index) => {
      const radius = index % 2 === 0 ? outer : inner;
      const angle = -Math.PI / 2 + (index * Math.PI) / points;
      return new Phaser.Geom.Point(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
    });
  }
}
