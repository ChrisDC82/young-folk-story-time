import Phaser from 'phaser';

interface GameButtonOptions {
  width?: number;
  height?: number;
  fontSize?: number;
  fillColor?: number;
  hoverColor?: number;
  textColor?: string;
}

export class GameButton extends Phaser.GameObjects.Container {
  private static readonly minimumTouchHeight = 82;
  private readonly background: Phaser.GameObjects.Graphics;
  private readonly label: Phaser.GameObjects.Text;
  private readonly buttonWidth: number;
  private readonly buttonHeight: number;
  private readonly fillColor: number;
  private readonly hoverColor: number;
  private enabled = true;
  private selected = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string,
    onActivate: () => void,
    options: GameButtonOptions = {},
  ) {
    super(scene, x, y);
    scene.add.existing(this);

    this.buttonWidth = options.width ?? 360;
    this.buttonHeight = options.height ?? 82;
    this.fillColor = options.fillColor ?? 0xf3a712;
    this.hoverColor = options.hoverColor ?? 0xffc94a;

    this.background = scene.add.graphics();
    this.label = scene.add
      .text(0, 0, text, {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: `${options.fontSize ?? 34}px`,
        fontStyle: 'bold',
        color: options.textColor ?? '#2b1648',
        align: 'center',
        wordWrap: { width: this.buttonWidth - 48 },
      })
      .setOrigin(0.5);

    this.add([this.background, this.label]);
    this.setSize(this.buttonWidth, Math.max(this.buttonHeight, GameButton.minimumTouchHeight));
    this.setInteractive({ useHandCursor: true });
    this.draw(this.fillColor, false);

    this.on(Phaser.Input.Events.POINTER_OVER, () => {
      if (this.enabled) this.draw(this.hoverColor, true);
    });
    this.on(Phaser.Input.Events.POINTER_OUT, () => {
      this.setScale(1);
      if (this.enabled) this.draw(this.selected ? 0x58d68d : this.fillColor, false);
    });
    this.on(Phaser.Input.Events.POINTER_DOWN, () => {
      if (this.enabled) this.setScale(0.97);
    });
    this.on(Phaser.Input.Events.POINTER_UP, () => {
      if (!this.enabled) return;
      this.setScale(1);
      this.draw(this.hoverColor, true);
      onActivate();
    });
  }

  setButtonText(text: string): this {
    this.label.setText(text);
    return this;
  }

  setEnabled(enabled: boolean): this {
    this.enabled = enabled;
    enabled ? this.setInteractive({ useHandCursor: true }) : this.disableInteractive();
    this.setAlpha(enabled || this.selected ? 1 : 0.55);
    return this;
  }

  setSelected(selected: boolean): this {
    this.selected = selected;
    this.draw(selected ? 0x58d68d : this.fillColor, selected);
    if (selected) this.setAlpha(1);
    return this;
  }

  private draw(color: number, focused: boolean): void {
    this.background.clear();
    if (focused) {
      this.background.lineStyle(7, 0xfff4c2, 1);
    } else {
      this.background.lineStyle(4, 0x4a286b, 1);
    }
    this.background.fillStyle(color, 1);
    this.background.fillRoundedRect(
      -this.buttonWidth / 2,
      -this.buttonHeight / 2,
      this.buttonWidth,
      this.buttonHeight,
      24,
    );
    this.background.strokeRoundedRect(
      -this.buttonWidth / 2,
      -this.buttonHeight / 2,
      this.buttonWidth,
      this.buttonHeight,
      24,
    );
  }
}
