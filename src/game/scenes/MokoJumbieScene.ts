import Phaser from 'phaser';
import { characterName } from '../../episodes/carnival-choices/characters';
import { carnivalChoicesEpisode } from '../../episodes/carnival-choices/episode';
import type { StoryChoice } from '../../types/narrative';
import type { AngelMokoResponse } from '../../types/gameState';
import { CharacterStage } from '../components/CharacterStage';
import { DialogueBox } from '../components/DialogueBox';
import { GameButton } from '../components/GameButton';
import { addMuteControl } from '../components/MuteControl';
import { AudioManager } from '../systems/AudioManager';
import { GameStateManager } from '../systems/GameStateManager';
import { shouldReduceMotion } from '../systems/MotionPreference';
import { NarrativeEngine } from '../systems/NarrativeEngine';
import { StoryProgression } from '../systems/StoryProgression';

type MokoPhase = 'reveal' | 'dialogue' | 'choices' | 'response' | 'complete';

const ENDPOINT_COPY: Record<AngelMokoResponse, string> = {
  defensive: 'Angel stays nearby, but she is not ready to talk about the feeling yet.',
  'staying-close': 'Angel stays beside Lexi and keeps watching from a comfortable distance.',
  'shared-height-fear': 'Angel names what worries her, and Lexi respects the distance she needs.',
  'withheld-fear': 'Angel keeps some distance. Lexi leaves room for the conversation to continue later.',
  'accepted-explanation': 'Angel understands more about the performers and chooses to keep watching nearby.',
};

export class MokoJumbieScene extends Phaser.Scene {
  private narrative?: NarrativeEngine;
  private dialogueBox?: DialogueBox;
  private characterStage?: CharacterStage;
  private phase: MokoPhase = 'reveal';
  private reducedMotion = false;
  private choices: StoryChoice[] = [];
  private choiceButtons: GameButton[] = [];
  private choicePanel?: Phaser.GameObjects.Container;
  private choiceMade = false;

  constructor() {
    super('MokoJumbieScene');
  }

  create(): void {
    if (!StoryProgression.shared.mokoJumbieReady) {
      throw new Error('MokoJumbieScene requires a completed Pan Jam.');
    }

    AudioManager.shared.bind(this);
    this.phase = 'reveal';
    this.choices = [];
    this.choiceButtons = [];
    this.choicePanel = undefined;
    this.choiceMade = false;
    this.reducedMotion = shouldReduceMotion();
    this.narrative = new NarrativeEngine(carnivalChoicesEpisode.mokoJumbieStory, GameStateManager.shared);

    const background = this.add.image(640, 360, 'moko-jumbie-background').setDisplaySize(1280, 720);
    if (!this.reducedMotion) {
      const targetScaleX = background.scaleX * 1.025;
      const targetScaleY = background.scaleY * 1.025;
      this.tweens.add({ targets: background, scaleX: targetScaleX, scaleY: targetScaleY, duration: 6800, ease: 'Sine.InOut' });
    }

    const veil = this.add.rectangle(640, 360, 1280, 720, 0x21143c, 0.58).setDepth(4);
    const spotlight = this.add.graphics().setDepth(5).setAlpha(0);
    spotlight.fillStyle(0xffd34e, 0.08);
    spotlight.lineStyle(7, 0xfff0a5, 0.9);
    spotlight.fillRoundedRect(470, 105, 395, 345, 70);
    spotlight.strokeRoundedRect(470, 105, 395, 345, 70);
    this.add
      .text(640, 50, 'MOKO JUMBIES IN THE PARADE', {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '42px',
        fontStyle: 'bold',
        color: '#fff8dc',
        stroke: '#6d3f91',
        strokeThickness: 9,
      })
      .setOrigin(0.5)
      .setDepth(30);

    this.characterStage = new CharacterStage(this, carnivalChoicesEpisode.characters, {
      lexi: { x: 390, y: 505, width: 175, height: 245 },
      angel: { x: 590, y: 510, width: 190, height: 235 },
      junior: { x: 1090, y: 510, width: 140, height: 235 },
    });
    this.characterStage.showLead('lexi');
    this.dialogueBox = new DialogueBox(this);
    addMuteControl(this);
    this.registerKeyboard();
    this.cameras.main.fadeIn(this.reducedMotion ? 80 : 500, 255, 211, 71);

    const revealDuration = this.reducedMotion ? 80 : 900;
    this.tweens.add({ targets: veil, alpha: 0.2, duration: revealDuration });
    this.tweens.add({ targets: spotlight, alpha: 1, duration: revealDuration });
    this.time.delayedCall(this.reducedMotion ? 100 : 920, () => {
      this.characterStage?.revealAll(this.reducedMotion);
      this.renderCurrentNode();
    });
  }

  private registerKeyboard(): void {
    const enter = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    const space = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    const numberKeys = [
      this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ONE),
      this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.TWO),
      this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.THREE),
      this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR),
    ];
    const advance = () => {
      if (this.phase === 'dialogue' || this.phase === 'response') this.dialogueBox?.handleKeyboardAdvance();
      else if (this.phase === 'complete') this.scene.start('TitleScene');
    };
    enter?.on(Phaser.Input.Keyboard.Events.DOWN, advance);
    space?.on(Phaser.Input.Keyboard.Events.DOWN, advance);
    numberKeys.forEach((key, index) => {
      key?.on(Phaser.Input.Keyboard.Events.DOWN, () => {
        const choice = this.choices[index];
        if (this.phase === 'choices' && choice) this.selectChoice(choice.id);
      });
    });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      enter?.destroy();
      space?.destroy();
      numberKeys.forEach((key) => key?.destroy());
    });
  }

  private renderCurrentNode(): void {
    const node = this.narrative?.currentNode;
    if (!node?.speaker || !node.text) {
      throw new Error(`Moko Jumbie node "${node?.id ?? 'unknown'}" cannot be displayed.`);
    }

    this.phase = this.choiceMade ? 'response' : 'dialogue';
    this.characterStage?.focus(node.speaker, node.expression, this.reducedMotion);
    if (node.id === 'angel-steps-back') this.moveAngelBehindLexi();
    this.dialogueBox?.show({ speaker: characterName(node.speaker), text: node.text }, () => {
      if (node.choices?.length) {
        this.showChoices();
      } else if (node.end) {
        this.showEndpoint();
      } else {
        this.narrative?.advance();
        this.renderCurrentNode();
      }
    });
  }

  private moveAngelBehindLexi(): void {
    this.characterStage?.setDepth('angel', 9);
    this.characterStage?.setDepth('lexi', 11);
    this.characterStage?.moveTo('angel', 320, 512, this.reducedMotion);
  }

  private showChoices(): void {
    this.choices = this.narrative?.availableChoices ?? [];
    if (this.choices.length !== 4) throw new Error('The Moko Jumbie moment requires four available choices.');
    this.phase = 'choices';

    const panel = this.add.container(640, 360).setDepth(80).setAlpha(this.reducedMotion ? 1 : 0);
    const shade = this.add.rectangle(0, 0, 1280, 720, 0x21143c, 0.93);
    const heading = this.add
      .text(0, -252, 'How should Lexi respond to Angel?', {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '39px',
        fontStyle: 'bold',
        color: '#fff8dc',
        stroke: '#6d3f91',
        strokeThickness: 7,
      })
      .setOrigin(0.5);
    const hint = this.add
      .text(0, 245, 'There is no score here • tap/click or use keys 1–4', {
        fontFamily: 'Trebuchet MS, sans-serif',
        fontSize: '22px',
        color: '#fff0a5',
      })
      .setOrigin(0.5);
    panel.add([shade, heading, hint]);

    const positions = [
      { x: -300, y: -105 },
      { x: 300, y: -105 },
      { x: -300, y: 55 },
      { x: 300, y: 55 },
    ];
    this.choiceButtons = this.choices.map((choice, index) => {
      const position = positions[index];
      const button = new GameButton(this, position.x, position.y, `${index + 1}. ${choice.label}`, () => this.selectChoice(choice.id), {
        width: 535,
        height: 125,
        fontSize: 24,
        fillColor: index % 2 === 0 ? 0xfff2bd : 0xd8c2ef,
        hoverColor: 0xffdf81,
        textColor: '#2b1648',
      });
      this.children.remove(button);
      panel.add(button);
      return button;
    });
    this.choicePanel = panel;
    if (!this.reducedMotion) this.tweens.add({ targets: panel, alpha: 1, duration: 260 });
  }

  private selectChoice(choiceId: string): void {
    if (this.phase !== 'choices' || !this.narrative) return;
    this.choiceButtons.forEach((button) => button.setEnabled(false));
    this.narrative.choose(choiceId);
    this.choiceMade = true;
    this.choicePanel?.destroy(true);
    this.choicePanel = undefined;
    this.choiceButtons = [];
    this.choices = [];
    this.renderCurrentNode();
  }

  private showEndpoint(): void {
    if (this.phase === 'complete') return;
    this.phase = 'complete';
    StoryProgression.shared.completeMilestone6();
    const response = GameStateManager.shared.get('angelMokoResponse');
    if (!response) throw new Error('Milestone 6 completed without an Angel response.');

    const panel = this.add.container(640, 365).setDepth(110).setAlpha(this.reducedMotion ? 1 : 0).setScale(this.reducedMotion ? 1 : 0.85);
    const shade = this.add.rectangle(0, 0, 900, 430, 0x2b1648, 0.97).setStrokeStyle(8, 0xffd34e, 1);
    const title = this.add
      .text(0, -145, 'A MOMENT TO LISTEN', {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '47px',
        fontStyle: 'bold',
        color: '#fff8dc',
        stroke: '#8d2f73',
        strokeThickness: 8,
      })
      .setOrigin(0.5);
    const message = this.add
      .text(0, -52, ENDPOINT_COPY[response], {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '27px',
        color: '#fff0a5',
        align: 'center',
        wordWrap: { width: 760 },
      })
      .setOrigin(0.5);
    const endpoint = this.add
      .text(0, 45, 'The Carnival story pauses here. Angel’s feelings can keep unfolding later.', {
        fontFamily: 'Trebuchet MS, sans-serif',
        fontSize: '22px',
        color: '#fff8dc',
        align: 'center',
        wordWrap: { width: 760 },
      })
      .setOrigin(0.5);
    const titleButton = new GameButton(this, 0, 135, 'Return to title', () => this.scene.start('TitleScene'), {
      width: 330,
      height: 78,
      fontSize: 28,
    });
    this.children.remove(titleButton);
    panel.add([shade, title, message, endpoint, titleButton]);
    if (!this.reducedMotion) this.tweens.add({ targets: panel, alpha: 1, scale: 1, duration: 440, ease: 'Back.Out' });
  }
}
