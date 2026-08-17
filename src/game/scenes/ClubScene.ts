import Phaser from 'phaser';
import { carnivalChoicesEpisode } from '../../episodes/carnival-choices/episode';
import type { MilestoneChoice } from '../../types/dialogue';
import { ChoiceButton } from '../components/ChoiceButton';
import { DialogueBox } from '../components/DialogueBox';
import { GameButton } from '../components/GameButton';
import { InteractiveHotspot } from '../components/InteractiveHotspot';
import { addMuteControl } from '../components/MuteControl';
import { AudioManager } from '../systems/AudioManager';

export class ClubScene extends Phaser.Scene {
  private hotspot?: InteractiveHotspot;
  private dialogueBox?: DialogueBox;
  private selectedChoice?: MilestoneChoice;
  private choiceButtons: ChoiceButton[] = [];
  private instructionText?: Phaser.GameObjects.Text;
  private choicePanel?: Phaser.GameObjects.Container;
  private keyboardStage: 'explore' | 'dialogue' | 'choices' | 'selected' = 'explore';

  constructor() {
    super('ClubScene');
  }

  create(): void {
    AudioManager.shared.bind(this);
    this.add.image(640, 360, 'cc-club').setDisplaySize(1280, 720);

    const lexi = this.add.image(1080, 420, 'lexi-front').setOrigin(0.5, 1).setDisplaySize(270, 386).setDepth(10);
    lexi.setAlpha(0).setX(1160);
    this.tweens.add({ targets: lexi, alpha: 1, x: 1080, duration: 650, ease: 'Back.Out' });
    this.tweens.add({
      targets: lexi,
      y: 426,
      scaleX: lexi.scaleX * 1.015,
      scaleY: lexi.scaleY * 0.995,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.InOut',
      delay: 650,
    });

    this.instructionText = this.add
      .text(640, 666, 'Find the glowing steelpan  •  Press H to explore', {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '25px',
        fontStyle: 'bold',
        color: '#fffbe0',
        backgroundColor: '#2b1648e8',
        padding: { x: 22, y: 12 },
      })
      .setOrigin(0.5)
      .setDepth(20);

    this.dialogueBox = new DialogueBox(this);
    this.hotspot = new InteractiveHotspot(this, 217, 205, () => this.onHotspotActivated());
    addMuteControl(this);

    const hotspotKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.H);
    const enterKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    const spaceKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    const numberKeys = [
      this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ONE),
      this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.TWO),
      this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.THREE),
    ];

    hotspotKey?.on(Phaser.Input.Keyboard.Events.DOWN, () => this.hotspot?.activateFromKeyboard());
    const advance = () => {
      if (this.keyboardStage === 'dialogue') this.dialogueBox?.handleKeyboardAdvance();
      else if (this.keyboardStage === 'selected') this.proceedToCompletion();
    };
    enterKey?.on(Phaser.Input.Keyboard.Events.DOWN, advance);
    spaceKey?.on(Phaser.Input.Keyboard.Events.DOWN, advance);
    numberKeys.forEach((key, index) => {
      key?.on(Phaser.Input.Keyboard.Events.DOWN, () => {
        if (this.keyboardStage === 'choices') this.selectChoice(carnivalChoicesEpisode.choices[index].id);
      });
    });

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      hotspotKey?.destroy();
      enterKey?.destroy();
      spaceKey?.destroy();
      numberKeys.forEach((key) => key?.destroy());
    });
    this.cameras.main.fadeIn(420, 48, 23, 76);
  }

  private onHotspotActivated(): void {
    this.keyboardStage = 'dialogue';
    this.instructionText?.setVisible(false);
    this.cameras.main.shake(140, 0.003);
    this.add.circle(217, 205, 20, 0xffdf4d, 0.7).setDepth(14);
    const note = this.add
      .text(217, 205, '♫', {
        fontFamily: 'Trebuchet MS, sans-serif',
        fontSize: '48px',
        fontStyle: 'bold',
        color: '#fff6a8',
        stroke: '#5e2a7d',
        strokeThickness: 6,
      })
      .setOrigin(0.5)
      .setDepth(18);
    this.tweens.add({ targets: note, y: 95, alpha: 0, angle: 14, duration: 850, onComplete: () => note.destroy() });
    this.dialogueBox?.show(carnivalChoicesEpisode.hotspotDialogue, () => this.showChoices());
  }

  private showChoices(): void {
    this.keyboardStage = 'choices';
    const panel = this.add.container(640, 370).setDepth(60).setAlpha(0);
    const shade = this.add.rectangle(0, -10, 1280, 740, 0x21143c, 0.9);
    const heading = this.add
      .text(0, -240, 'What would you like to do?', {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '44px',
        fontStyle: 'bold',
        color: '#fff8dc',
        stroke: '#6d3f91',
        strokeThickness: 7,
      })
      .setOrigin(0.5);
    const hint = this.add
      .text(0, 212, 'Choose with a tap, click, or keys 1–3', {
        fontFamily: 'Trebuchet MS, sans-serif',
        fontSize: '22px',
        color: '#fff8dc',
      })
      .setOrigin(0.5);

    panel.add([shade, heading, hint]);
    this.choiceButtons = carnivalChoicesEpisode.choices.map((choice, index) => {
      const button = new ChoiceButton(this, 0, -130 + index * 92, choice.id, index + 1, choice.label, (id) =>
        this.selectChoice(id),
      );
      this.children.remove(button);
      panel.add(button);
      return button;
    });
    this.choicePanel = panel;
    this.tweens.add({ targets: panel, alpha: 1, duration: 280 });
  }

  private selectChoice(choiceId: string): void {
    const choice = carnivalChoicesEpisode.choices.find((item) => item.id === choiceId);
    if (!choice || this.keyboardStage !== 'choices') return;
    this.selectedChoice = choice;
    this.keyboardStage = 'selected';
    this.choiceButtons.forEach((button) => {
      const isSelected = button.choiceId === choiceId;
      button.setSelected(isSelected).setEnabled(false);
      button.setVisible(isSelected);
      if (isSelected) button.setY(-130);
    });

    const response = this.add
      .text(0, 32, choice.response, {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '29px',
        fontStyle: 'bold',
        color: '#fff8dc',
        align: 'center',
        wordWrap: { width: 760 },
      })
      .setOrigin(0.5);
    const continueButton = new GameButton(this, 0, 154, 'Continue  ▶', () => this.proceedToCompletion(), {
      width: 320,
      height: 78,
      fontSize: 30,
    });
    this.children.remove(continueButton);
    this.choicePanel?.add([response, continueButton]);
  }

  private proceedToCompletion(): void {
    if (!this.selectedChoice || this.keyboardStage !== 'selected') return;
    this.keyboardStage = 'explore';
    this.input.enabled = false;
    this.cameras.main.fadeOut(650, 255, 211, 71);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.start('CompletionScene', { choice: this.selectedChoice });
    });
  }
}
