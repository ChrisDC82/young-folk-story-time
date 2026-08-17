import Phaser from 'phaser';
import { characterName } from '../../episodes/carnival-choices/characters';
import { carnivalChoicesEpisode } from '../../episodes/carnival-choices/episode';
import type { StoryChoice } from '../../types/narrative';
import { CharacterStage } from '../components/CharacterStage';
import { ChoiceButton } from '../components/ChoiceButton';
import { DialogueBox } from '../components/DialogueBox';
import { GameButton } from '../components/GameButton';
import { InteractiveHotspot } from '../components/InteractiveHotspot';
import { addMuteControl } from '../components/MuteControl';
import { AudioManager } from '../systems/AudioManager';
import { GameStateManager } from '../systems/GameStateManager';
import { NarrativeEngine } from '../systems/NarrativeEngine';

type KeyboardStage = 'explore' | 'dialogue' | 'choices' | 'selected' | 'transition';

export class ClubScene extends Phaser.Scene {
  private hotspot?: InteractiveHotspot;
  private dialogueBox?: DialogueBox;
  private characterStage?: CharacterStage;
  private narrative?: NarrativeEngine;
  private selectedChoice?: StoryChoice;
  private availableChoices: StoryChoice[] = [];
  private choiceButtons: ChoiceButton[] = [];
  private instructionText?: Phaser.GameObjects.Text;
  private choicePanel?: Phaser.GameObjects.Container;
  private keyboardStage: KeyboardStage = 'explore';

  constructor() {
    super('ClubScene');
  }

  create(): void {
    AudioManager.shared.bind(this);
    this.add.image(640, 360, 'cc-club').setDisplaySize(1280, 720);

    this.characterStage = new CharacterStage(this, carnivalChoicesEpisode.characters);
    this.characterStage.showLead('lexi');
    this.narrative = new NarrativeEngine(carnivalChoicesEpisode.openingStory, GameStateManager.shared);

    this.instructionText = this.add
      .text(640, 666, 'Meet the group by the steelpan  •  Press H to join them', {
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
    this.registerKeyboardControls();
    this.cameras.main.fadeIn(420, 48, 23, 76);
  }

  private registerKeyboardControls(): void {
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
      else if (this.keyboardStage === 'selected') this.continueAfterChoice();
    };
    enterKey?.on(Phaser.Input.Keyboard.Events.DOWN, advance);
    spaceKey?.on(Phaser.Input.Keyboard.Events.DOWN, advance);
    numberKeys.forEach((key, index) => {
      key?.on(Phaser.Input.Keyboard.Events.DOWN, () => {
        const choice = this.availableChoices[index];
        if (this.keyboardStage === 'choices' && choice) this.selectChoice(choice.id);
      });
    });

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      hotspotKey?.destroy();
      enterKey?.destroy();
      spaceKey?.destroy();
      numberKeys.forEach((key) => key?.destroy());
    });
  }

  private onHotspotActivated(): void {
    this.instructionText?.setVisible(false);
    this.cameras.main.shake(140, 0.003);
    this.characterStage?.revealAll();

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
    this.renderCurrentNode();
  }

  private renderCurrentNode(): void {
    const node = this.narrative?.currentNode;
    if (!node?.speaker || !node.text) {
      throw new Error(`Narrative node "${node?.id ?? 'unknown'}" cannot be displayed as dialogue.`);
    }

    this.keyboardStage = 'dialogue';
    this.characterStage?.focus(node.speaker, node.expression);
    this.dialogueBox?.show({ speaker: characterName(node.speaker), text: node.text }, () => {
      if (node.choices?.length) {
        this.showChoices();
      } else if (node.end) {
        this.proceedToCompletion();
      } else {
        this.narrative?.advance();
        this.renderCurrentNode();
      }
    });
  }

  private showChoices(): void {
    this.availableChoices = this.narrative?.availableChoices ?? [];
    if (!this.availableChoices.length) throw new Error('The opening decision has no available choices.');
    this.keyboardStage = 'choices';

    const panel = this.add.container(640, 370).setDepth(60).setAlpha(0);
    const shade = this.add.rectangle(0, -10, 1280, 740, 0x21143c, 0.9);
    const heading = this.add
      .text(0, -254, 'How should the friends finish the wings?', {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '40px',
        fontStyle: 'bold',
        color: '#fff8dc',
        stroke: '#6d3f91',
        strokeThickness: 7,
      })
      .setOrigin(0.5);
    const hint = this.add
      .text(0, 230, 'Choose with a tap, click, or keys 1–3', {
        fontFamily: 'Trebuchet MS, sans-serif',
        fontSize: '22px',
        color: '#fff8dc',
      })
      .setOrigin(0.5);

    panel.add([shade, heading, hint]);
    this.choiceButtons = this.availableChoices.map((choice, index) => {
      const button = new ChoiceButton(
        this,
        0,
        -142 + index * 104,
        choice.id,
        index + 1,
        choice.label,
        choice.description,
        (id) => this.selectChoice(id),
      );
      this.children.remove(button);
      panel.add(button);
      return button;
    });
    this.choicePanel = panel;
    this.tweens.add({ targets: panel, alpha: 1, duration: 280 });
  }

  private selectChoice(choiceId: string): void {
    if (this.keyboardStage !== 'choices' || !this.narrative) return;
    const choice = this.narrative.choose(choiceId);
    this.selectedChoice = choice;
    this.keyboardStage = 'selected';
    this.choiceButtons.forEach((button) => {
      const isSelected = button.choiceId === choiceId;
      button.setSelected(isSelected).setEnabled(false).setVisible(isSelected);
      if (isSelected) button.setY(-140);
    });

    const response = this.add
      .text(0, 28, choice.confirmation, {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '30px',
        fontStyle: 'bold',
        color: '#fff8dc',
        align: 'center',
        wordWrap: { width: 780 },
      })
      .setOrigin(0.5);
    const continueButton = new GameButton(this, 0, 150, 'See their reaction  ▶', () => this.continueAfterChoice(), {
      width: 390,
      height: 78,
      fontSize: 27,
    });
    this.children.remove(continueButton);
    this.choicePanel?.add([response, continueButton]);
  }

  private continueAfterChoice(): void {
    if (!this.selectedChoice || this.keyboardStage !== 'selected') return;
    this.choicePanel?.destroy(true);
    this.choicePanel = undefined;
    this.choiceButtons = [];
    this.renderCurrentNode();
  }

  private proceedToCompletion(): void {
    if (this.keyboardStage === 'transition') return;
    this.keyboardStage = 'transition';
    this.input.enabled = false;
    this.cameras.main.fadeOut(650, 255, 211, 71);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.start('CompletionScene');
    });
  }
}
