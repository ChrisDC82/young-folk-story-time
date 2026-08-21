import Phaser from 'phaser';
import { carnivalChoicesEpisode } from '../../episodes/carnival-choices/episode';
import {
  storyTimeIntroDialogue,
  storyTimeMagicDialogue,
} from '../../episodes/carnival-choices/transition';
import type { CharacterDialogueLine } from '../../types/carnival';
import { CharacterStage } from '../components/CharacterStage';
import { DialogueBox } from '../components/DialogueBox';
import { GameButton } from '../components/GameButton';
import { addMuteControl } from '../components/MuteControl';
import { AudioManager } from '../systems/AudioManager';
import { shouldReduceMotion } from '../systems/MotionPreference';
import { StoryProgression } from '../systems/StoryProgression';

type StoryTimePhase = 'dialogue' | 'ready' | 'magic' | 'journey';

export class StoryTimeScene extends Phaser.Scene {
  private dialogueBox?: DialogueBox;
  private characterStage?: CharacterStage;
  private wakeButton?: GameButton;
  private wakeHint?: Phaser.GameObjects.Text;
  private phase: StoryTimePhase = 'dialogue';
  private reducedMotion = false;

  constructor() {
    super('StoryTimeScene');
  }

  create(): void {
    if (StoryProgression.shared.currentStage !== 'story-time') {
      throw new Error('StoryTimeScene requires the Story Time progression stage.');
    }

    AudioManager.shared.bind(this);
    this.phase = 'dialogue';
    this.wakeButton = undefined;
    this.wakeHint = undefined;
    this.reducedMotion = shouldReduceMotion();
    this.add.image(640, 360, 'cc-club').setDisplaySize(1280, 720);
    this.add
      .text(640, 48, 'The Story Pot Is Waking…', {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '39px',
        fontStyle: 'bold',
        color: '#fff8dc',
        stroke: '#5b2c73',
        strokeThickness: 8,
      })
      .setOrigin(0.5)
      .setDepth(35);

    this.characterStage = new CharacterStage(this, carnivalChoicesEpisode.characters, {
      lexi: { x: 170, y: 450, width: 165, height: 235 },
      angel: { x: 360, y: 450, width: 190, height: 245 },
      junior: { x: 535, y: 450, width: 135, height: 235 },
    });
    this.characterStage.showLead('lexi');
    this.characterStage.revealAll(this.reducedMotion);
    this.dialogueBox = new DialogueBox(this);
    addMuteControl(this);
    this.registerKeyboard();
    this.cameras.main.fadeIn(this.reducedMotion ? 80 : 520, 48, 23, 76);
    this.time.delayedCall(this.reducedMotion ? 80 : 420, () => {
      this.playDialogue(storyTimeIntroDialogue, () => this.showWakeButton());
    });
  }

  private registerKeyboard(): void {
    const enter = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    const space = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    const advance = () => {
      if (this.phase === 'dialogue') this.dialogueBox?.handleKeyboardAdvance();
      else if (this.phase === 'ready') this.beginMagic();
    };
    enter?.on(Phaser.Input.Keyboard.Events.DOWN, advance);
    space?.on(Phaser.Input.Keyboard.Events.DOWN, advance);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      enter?.destroy();
      space?.destroy();
    });
  }

  private playDialogue(lines: readonly CharacterDialogueLine[], onComplete: () => void, index = 0): void {
    const line = lines[index];
    if (!line) {
      onComplete();
      return;
    }
    this.phase = 'dialogue';
    this.characterStage?.focus(line.characterId, line.expression, this.reducedMotion);
    this.dialogueBox?.show({ speaker: line.speaker, text: line.text }, () => {
      this.playDialogue(lines, onComplete, index + 1);
    });
  }

  private showWakeButton(): void {
    this.phase = 'ready';
    this.wakeButton = new GameButton(this, 845, 590, 'Wake the Story Pot  ✨', () => this.beginMagic(), {
      width: 420,
      height: 82,
      fontSize: 29,
      fillColor: 0xffd34e,
    }).setDepth(55);
    this.wakeHint = this.add
      .text(845, 650, 'Tap, click, or press Enter', {
        fontFamily: 'Trebuchet MS, sans-serif',
        fontSize: '20px',
        color: '#fff8dc',
        backgroundColor: '#2b1648cc',
        padding: { x: 13, y: 7 },
      })
      .setOrigin(0.5)
      .setDepth(54);
  }

  private beginMagic(): void {
    if (this.phase !== 'ready') return;
    this.phase = 'magic';
    this.wakeButton?.destroy(true);
    this.wakeButton = undefined;
    this.wakeHint?.destroy();
    this.wakeHint = undefined;

    const duration = this.reducedMotion ? 80 : 900;
    const dimmer = this.add.rectangle(640, 360, 1280, 720, 0x1b1236, 0).setDepth(16);
    this.tweens.add({ targets: dimmer, alpha: 0.38, duration });

    const mapGlow = this.add.graphics().setDepth(18).setAlpha(0);
    mapGlow.fillStyle(0x57c7e3, 0.11);
    mapGlow.lineStyle(7, 0xffed84, 0.95);
    mapGlow.fillRoundedRect(315, 96, 510, 385, 28);
    mapGlow.strokeRoundedRect(315, 96, 510, 385, 28);
    this.tweens.add({ targets: mapGlow, alpha: 1, duration });

    const trinidadGlow = this.add.circle(733, 409, 31, 0xffd34e, 0.22).setStrokeStyle(7, 0xfff4a8, 1).setDepth(19);
    const trinidadLabel = this.add
      .text(733, 363, 'Trinidad & Tobago', {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '20px',
        fontStyle: 'bold',
        color: '#32184f',
        backgroundColor: '#fff4a8ee',
        padding: { x: 12, y: 6 },
      })
      .setOrigin(0.5)
      .setDepth(20)
      .setAlpha(0);
    this.tweens.add({ targets: trinidadLabel, alpha: 1, duration, delay: this.reducedMotion ? 0 : 500 });

    const potGlow = this.add.circle(839, 504, 77, 0xffd34e, 0.2).setStrokeStyle(8, 0xfff1a0, 1).setDepth(20);
    if (!this.reducedMotion) {
      this.tweens.add({ targets: [potGlow, trinidadGlow], scale: 1.18, alpha: 0.75, duration: 760, yoyo: true, repeat: 1 });
    }
    this.addRisingSparkles();

    this.time.delayedCall(this.reducedMotion ? 160 : 1650, () => {
      this.playDialogue(storyTimeMagicDialogue, () => this.beginJourney());
    });
  }

  private addRisingSparkles(): void {
    const count = this.reducedMotion ? 6 : 18;
    for (let index = 0; index < count; index += 1) {
      const sparkle = this.add
        .circle(839 + Phaser.Math.Between(-55, 55), 520 + Phaser.Math.Between(-12, 24), Phaser.Math.Between(3, 7), 0xfff1a0, 0.9)
        .setDepth(21);
      if (!this.reducedMotion) {
        this.tweens.add({
          targets: sparkle,
          x: Phaser.Math.Between(570, 860),
          y: Phaser.Math.Between(120, 355),
          alpha: 0,
          scale: 0.35,
          duration: Phaser.Math.Between(1200, 2100),
          delay: index * 55,
          ease: 'Sine.Out',
        });
      }
    }
  }

  private beginJourney(): void {
    this.phase = 'journey';
    const duration = this.reducedMotion ? 100 : 750;
    const storyImage = this.add.image(640, 360, 'story-pot').setDisplaySize(1280, 720).setDepth(70).setAlpha(0);
    const targetScaleX = storyImage.scaleX * (this.reducedMotion ? 1 : 1.045);
    const targetScaleY = storyImage.scaleY * (this.reducedMotion ? 1 : 1.045);
    const title = this.add
      .text(640, 90, 'STORY TIME IS HERE!', {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '52px',
        fontStyle: 'bold',
        color: '#fff8dc',
        stroke: '#6d3f91',
        strokeThickness: 10,
      })
      .setOrigin(0.5)
      .setDepth(80)
      .setAlpha(0);
    this.tweens.add({ targets: [storyImage, title], alpha: 1, duration });
    if (!this.reducedMotion) {
      this.tweens.add({ targets: storyImage, scaleX: targetScaleX, scaleY: targetScaleY, duration: 1900, ease: 'Sine.InOut' });
    }

    this.time.delayedCall(this.reducedMotion ? 400 : 1900, () => {
      this.cameras.main.fadeOut(this.reducedMotion ? 100 : 650, 255, 214, 77);
      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
        StoryProgression.shared.arriveAtCarnival();
        this.scene.start('CarnivalScene');
      });
    });
  }
}
