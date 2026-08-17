import Phaser from 'phaser';
import { carnivalChoicesEpisode } from '../../episodes/carnival-choices/episode';
import { panJamIntroDialogue } from '../../episodes/carnival-choices/panJam';
import { carnivalArrivalDialogue, carnivalHotspots } from '../../episodes/carnival-choices/transition';
import type { CarnivalHotspotId, CharacterDialogueLine } from '../../types/carnival';
import { CharacterStage } from '../components/CharacterStage';
import { DialogueBox } from '../components/DialogueBox';
import { GameButton } from '../components/GameButton';
import { addMuteControl } from '../components/MuteControl';
import { SceneHotspot } from '../components/SceneHotspot';
import { AudioManager } from '../systems/AudioManager';
import { CarnivalExperience } from '../systems/CarnivalExperience';
import { GameStateManager } from '../systems/GameStateManager';
import { shouldReduceMotion } from '../systems/MotionPreference';
import { StoryProgression } from '../systems/StoryProgression';

type CarnivalPhase = 'arrival' | 'explore' | 'reaction' | 'pan-intro' | 'transition';

export class CarnivalScene extends Phaser.Scene {
  private characterStage?: CharacterStage;
  private dialogueBox?: DialogueBox;
  private experience?: CarnivalExperience;
  private hotspots = new Map<CarnivalHotspotId, SceneHotspot>();
  private continueButton?: GameButton;
  private instruction?: Phaser.GameObjects.Text;
  private phase: CarnivalPhase = 'arrival';
  private reducedMotion = false;
  private canContinue = false;

  constructor() {
    super('CarnivalScene');
  }

  create(): void {
    if (!StoryProgression.shared.carnivalReady) throw new Error('CarnivalScene requires a completed Story Time transition.');
    AudioManager.shared.bind(this);
    this.hotspots.clear();
    this.continueButton = undefined;
    this.instruction = undefined;
    this.phase = 'arrival';
    this.canContinue = false;
    this.reducedMotion = shouldReduceMotion();
    this.experience = new CarnivalExperience(GameStateManager.shared, carnivalHotspots);

    const background = this.add.image(640, 360, 'carnival-background');
    const coverScale = Math.max(1280 / background.width, 720 / background.height);
    background.setScale(coverScale);
    if (!this.reducedMotion) {
      this.tweens.add({ targets: background, scale: coverScale * 1.025, duration: 6500, ease: 'Sine.InOut' });
    }
    this.addAmbientCarnivalMotion();

    this.add.rectangle(640, 49, 710, 78, 0x2b1648, 0.83).setStrokeStyle(4, 0xffd34e, 0.95).setDepth(28);
    this.add
      .text(640, 48, 'Welcome to Kiddies Carnival!', {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '37px',
        fontStyle: 'bold',
        color: '#fff8dc',
        stroke: '#6d3f91',
        strokeThickness: 7,
      })
      .setOrigin(0.5)
      .setDepth(29);

    this.characterStage = new CharacterStage(this, carnivalChoicesEpisode.characters, {
      lexi: { x: 610, y: 570, width: 165, height: 235 },
      angel: { x: 810, y: 570, width: 190, height: 245 },
      junior: { x: 990, y: 570, width: 140, height: 235 },
    });
    this.characterStage.showLead('lexi');
    this.characterStage.revealAll();
    this.dialogueBox = new DialogueBox(this);
    addMuteControl(this);
    this.registerKeyboard();
    this.cameras.main.fadeIn(this.reducedMotion ? 100 : 750, 255, 214, 77);
    this.time.delayedCall(this.reducedMotion ? 100 : 520, () => {
      this.playDialogue(carnivalArrivalDialogue, () => this.beginExploration());
    });
  }

  private registerKeyboard(): void {
    const enter = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    const space = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    const numberKeys = [
      this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ONE),
      this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.TWO),
      this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.THREE),
    ];
    const advance = () => {
      if (this.phase === 'arrival' || this.phase === 'reaction' || this.phase === 'pan-intro') {
        this.dialogueBox?.handleKeyboardAdvance();
      } else if (this.phase === 'explore' && this.canContinue) {
        this.startPanJamIntro();
      }
    };
    enter?.on(Phaser.Input.Keyboard.Events.DOWN, advance);
    space?.on(Phaser.Input.Keyboard.Events.DOWN, advance);
    numberKeys.forEach((key, index) => {
      key?.on(Phaser.Input.Keyboard.Events.DOWN, () => {
        if (this.phase !== 'explore') return;
        const definition = carnivalHotspots[index];
        if (definition) this.hotspots.get(definition.id)?.activateFromKeyboard();
      });
    });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      enter?.destroy();
      space?.destroy();
      numberKeys.forEach((key) => key?.destroy());
    });
  }

  private playDialogue(
    lines: readonly CharacterDialogueLine[],
    onComplete: () => void,
    index = 0,
    phase: 'arrival' | 'pan-intro' = 'arrival',
  ): void {
    const line = lines[index];
    if (!line) {
      onComplete();
      return;
    }
    this.phase = phase;
    this.characterStage?.focus(line.characterId, line.expression);
    this.dialogueBox?.show({ speaker: line.speaker, text: line.text }, () => {
      this.playDialogue(lines, onComplete, index + 1, phase);
    });
  }

  private beginExploration(): void {
    this.phase = 'explore';
    this.characterStage?.startIdleMotion(this.reducedMotion);
    this.instruction = this.add
      .text(640, 665, 'Explore one sparkling spot • tap/click or use keys 1–3', {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '22px',
        fontStyle: 'bold',
        color: '#fff8dc',
        backgroundColor: '#2b1648e8',
        padding: { x: 18, y: 10 },
      })
      .setOrigin(0.5)
      .setDepth(27);

    carnivalHotspots.forEach((definition) => {
      const hotspot = new SceneHotspot(
        this,
        definition.x,
        definition.y,
        {
          label: definition.label,
          icon: definition.icon,
          color: definition.color,
          reducedMotion: this.reducedMotion,
        },
        () => this.activateHotspot(definition.id),
      );
      this.hotspots.set(definition.id, hotspot);
    });

    this.continueButton = new GameButton(this, 1080, 650, 'Play Pan Jam  ▶', () => this.startPanJamIntro(), {
      width: 285,
      height: 72,
      fontSize: 27,
    })
      .setDepth(30)
      .setEnabled(false);
  }

  private activateHotspot(hotspotId: CarnivalHotspotId): void {
    if (this.phase !== 'explore' || !this.experience) return;
    const hotspot = this.experience.visit(hotspotId);
    this.phase = 'reaction';
    this.characterStage?.focus(hotspot.reaction.characterId, hotspot.reaction.expression);
    this.dialogueBox?.show({ speaker: hotspot.reaction.speaker, text: hotspot.reaction.text }, () => {
      this.phase = 'explore';
      this.canContinue = true;
      this.continueButton?.setEnabled(true);
      this.instruction?.setText('Explore another sparkle, or play Pan Jam when you’re ready.');
    });
  }

  private addAmbientCarnivalMotion(): void {
    const colors = [0xffd34e, 0xf49ac2, 0x57c7e3, 0x79d18b, 0x9b6bd0];
    const confettiCount = this.reducedMotion ? 8 : 18;
    for (let index = 0; index < confettiCount; index += 1) {
      const confetti = this.add
        .rectangle(Phaser.Math.Between(25, 1255), Phaser.Math.Between(-80, 100), 7, 15, Phaser.Utils.Array.GetRandom(colors), 0.9)
        .setDepth(3)
        .setAngle(Phaser.Math.Between(-30, 30));
      if (!this.reducedMotion) {
        this.tweens.add({
          targets: confetti,
          y: 760,
          x: `+=${Phaser.Math.Between(-70, 70)}`,
          angle: Phaser.Math.Between(240, 560),
          duration: Phaser.Math.Between(5200, 7600),
          delay: index * 180,
          repeat: -1,
          ease: 'Sine.In',
        });
      }
    }

    ['♪', '♫', '♪'].forEach((note, index) => {
      const noteText = this.add
        .text(125 + index * 55, 380 - index * 22, note, {
          fontFamily: 'Trebuchet MS, sans-serif',
          fontSize: '35px',
          fontStyle: 'bold',
          color: index === 1 ? '#f49ac2' : '#fff0a5',
          stroke: '#5b2c73',
          strokeThickness: 5,
        })
        .setDepth(4)
        .setAlpha(0.82);
      if (!this.reducedMotion) {
        this.tweens.add({ targets: noteText, y: noteText.y - 22, angle: index % 2 ? 7 : -7, duration: 1400 + index * 170, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
      }
    });
  }

  private startPanJamIntro(): void {
    if (this.phase !== 'explore' || !this.canContinue) return;
    this.phase = 'pan-intro';
    this.hotspots.forEach((hotspot) => hotspot.disableInteractive().setVisible(false));
    this.continueButton?.setEnabled(false).setVisible(false);
    this.instruction?.setVisible(false);
    this.playDialogue(panJamIntroDialogue, () => {
      this.phase = 'transition';
      this.input.enabled = false;
      this.cameras.main.fadeOut(this.reducedMotion ? 100 : 520, 87, 199, 227);
      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
        StoryProgression.shared.enterPanJam();
        this.scene.start('PanGameScene');
      });
    }, 0, 'pan-intro');
  }
}
