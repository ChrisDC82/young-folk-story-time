import Phaser from 'phaser';
import { characterName } from '../../episodes/carnival-choices/characters';
import {
  crisisRepairMaterials,
  crisisResolutionDialogue,
} from '../../episodes/carnival-choices/crisis';
import { carnivalChoicesEpisode } from '../../episodes/carnival-choices/episode';
import type { CharacterDialogueLine } from '../../types/carnival';
import type { RepairMaterialId } from '../../types/crisis';
import type { StoryChoice } from '../../types/narrative';
import { CharacterStage } from '../components/CharacterStage';
import { DialogueBox } from '../components/DialogueBox';
import { GameButton } from '../components/GameButton';
import { addMuteControl } from '../components/MuteControl';
import { CarnivalCrisisRepair } from '../minigames/crisis/CarnivalCrisisRepair';
import { AudioManager } from '../systems/AudioManager';
import { GameStateManager } from '../systems/GameStateManager';
import { shouldReduceMotion } from '../systems/MotionPreference';
import { NarrativeEngine } from '../systems/NarrativeEngine';
import { StoryProgression } from '../systems/StoryProgression';

type CrisisPhase =
  | 'dialogue'
  | 'choices'
  | 'repair-choose'
  | 'repair-secure'
  | 'resolution'
  | 'complete'
  | 'transition';

export class CarnivalCrisisScene extends Phaser.Scene {
  private narrative?: NarrativeEngine;
  private repair?: CarnivalCrisisRepair;
  private characterStage?: CharacterStage;
  private dialogueBox?: DialogueBox;
  private phase: CrisisPhase = 'dialogue';
  private reducedMotion = false;
  private choiceMade = false;
  private choices: StoryChoice[] = [];
  private choiceButtons: GameButton[] = [];
  private choicePanel?: Phaser.GameObjects.Container;
  private repairPanel?: Phaser.GameObjects.Container;
  private repairStatus?: Phaser.GameObjects.Text;
  private repairButtons = new Map<RepairMaterialId, GameButton>();
  private secureButton?: GameButton;
  private rightWing?: Phaser.GameObjects.Container;
  private looseStrap?: Phaser.GameObjects.Rectangle;
  private nearbyDecoration?: Phaser.GameObjects.Container;

  constructor() {
    super('CarnivalCrisisScene');
  }

  create(): void {
    if (!StoryProgression.shared.carnivalCrisisReady) {
      throw new Error('CarnivalCrisisScene requires the completed Moko Jumbie sequence.');
    }

    AudioManager.shared.bind(this);
    this.phase = 'dialogue';
    this.choiceMade = false;
    this.choices = [];
    this.choiceButtons = [];
    this.choicePanel = undefined;
    this.repairPanel = undefined;
    this.repairStatus = undefined;
    this.repairButtons.clear();
    this.secureButton = undefined;
    this.reducedMotion = shouldReduceMotion();
    const state = GameStateManager.shared;
    this.narrative = new NarrativeEngine(
      state.get('usedShortcut')
        ? carnivalChoicesEpisode.crisisStories.shortcut
        : carnivalChoicesEpisode.crisisStories.nonShortcut,
      state,
    );

    const background = this.add.image(640, 360, 'carnival-background');
    const coverScale = Math.max(1280 / background.width, 720 / background.height);
    background.setScale(coverScale);
    this.add.rectangle(640, 360, 1280, 720, 0x24123d, 0.28).setDepth(2);
    this.add
      .text(640, 47, 'CARNIVAL CRISIS', {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '43px',
        fontStyle: 'bold',
        color: '#fff8dc',
        stroke: '#6d3f91',
        strokeThickness: 9,
      })
      .setOrigin(0.5)
      .setDepth(35);

    this.createEarlierMemory();
    this.createCostumeVisual(state.get('usedShortcut'));
    this.characterStage = new CharacterStage(this, carnivalChoicesEpisode.characters, {
      lexi: { x: 440, y: 510, width: 175, height: 245 },
      angel: { x: 675, y: 510, width: 195, height: 240 },
      junior: { x: 1080, y: 510, width: 145, height: 240 },
    });
    this.characterStage.showLead('lexi');
    this.characterStage.revealAll(this.reducedMotion);
    this.dialogueBox = new DialogueBox(this);
    addMuteControl(this);
    this.registerKeyboard();
    this.cameras.main.fadeIn(this.reducedMotion ? 80 : 520, 255, 211, 71);
    this.time.delayedCall(this.reducedMotion ? 90 : 480, () => this.renderCurrentNode());
  }

  private createEarlierMemory(): void {
    const frame = this.add.container(177, 139).setDepth(6);
    const shadow = this.add.rectangle(7, 8, 296, 176, 0x160c2b, 0.48);
    const art = this.add.image(0, 0, 'lexi-making-wings').setDisplaySize(284, 160);
    const border = this.add.rectangle(0, 0, 296, 172, 0xffffff, 0).setStrokeStyle(5, 0xffd34e, 0.95);
    const label = this.add
      .text(0, 104, 'Earlier at the CC Club…', {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '18px',
        fontStyle: 'bold',
        color: '#2b1648',
        backgroundColor: '#fff4a8ee',
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5);
    frame.add([shadow, art, border, label]);
  }

  private createCostumeVisual(shortcut: boolean): void {
    const leftWing = this.createWing(385, 390, -1);
    this.rightWing = this.createWing(495, 390, 1);
    const center = this.add.graphics().setDepth(8);
    center.fillStyle(0xffd34e, 1);
    center.lineStyle(5, 0x6d3f91, 1);
    center.fillRoundedRect(425, 350, 30, 104, 15);
    center.strokeRoundedRect(425, 350, 30, 104, 15);
    const strap = this.add.rectangle(440, 455, 105, 12, 0x79d18b, 1).setStrokeStyle(3, 0xfff4c2).setDepth(8);
    leftWing.setDepth(8);
    this.rightWing.setDepth(8);

    if (!shortcut) {
      this.nearbyDecoration = this.add.container(880, 375).setDepth(8);
      const glow = this.add.circle(0, 0, 72, 0xffd34e, 0.17).setStrokeStyle(4, 0xfff4c2, 0.8);
      const feather = this.add.ellipse(0, -30, 34, 105, 0xf49ac2, 1).setStrokeStyle(4, 0x6d3f91, 1).setAngle(24);
      const rosette = this.add.circle(0, 25, 39, 0x57c7e3, 1).setStrokeStyle(5, 0xfff4c2, 1);
      const label = this.add
        .text(0, 92, 'Nearby costume', {
          fontFamily: 'Trebuchet MS, sans-serif',
          fontSize: '18px',
          fontStyle: 'bold',
          color: '#fff8dc',
          backgroundColor: '#2b1648dd',
          padding: { x: 9, y: 5 },
        })
        .setOrigin(0.5);
      this.nearbyDecoration.add([glow, feather, rosette, label]);
    }

    this.looseStrap = strap;
  }

  private createWing(x: number, y: number, direction: -1 | 1): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);
    const wing = this.add.graphics();
    wing.fillStyle(0xf49ac2, 0.98);
    wing.lineStyle(5, 0xffd34e, 1);
    wing.fillEllipse(direction * 20, -30, 95, 120);
    wing.strokeEllipse(direction * 20, -30, 95, 120);
    wing.fillStyle(0x57c7e3, 0.98);
    wing.fillEllipse(direction * 25, 45, 82, 92);
    wing.strokeEllipse(direction * 25, 45, 82, 92);
    wing.fillStyle(0xffd34e, 1);
    wing.fillCircle(direction * 20, -30, 12);
    wing.fillStyle(0x6d3f91, 1);
    wing.fillCircle(direction * 25, 45, 10);
    container.add(wing);
    return container;
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
      if (this.phase === 'dialogue' || this.phase === 'resolution') this.dialogueBox?.handleKeyboardAdvance();
      else if (this.phase === 'repair-secure') this.secureFastening();
      else if (this.phase === 'complete') this.beginEnding();
    };
    enter?.on(Phaser.Input.Keyboard.Events.DOWN, advance);
    space?.on(Phaser.Input.Keyboard.Events.DOWN, advance);
    numberKeys.forEach((key, index) => {
      key?.on(Phaser.Input.Keyboard.Events.DOWN, () => {
        if (this.phase === 'choices') {
          const choice = this.choices[index];
          if (choice) this.selectChoice(choice.id);
        } else if (this.phase === 'repair-choose') {
          const material = crisisRepairMaterials[index];
          if (material) this.selectMaterial(material.id);
        }
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
    if (!node?.speaker || !node.text) throw new Error(`Carnival Crisis node "${node?.id ?? 'unknown'}" cannot be displayed.`);

    this.phase = 'dialogue';
    this.characterStage?.focus(node.speaker, node.expression, this.reducedMotion);
    if (node.id === 'strap-comes-loose') this.showLooseFastening();
    if (node.id === 'nearby-costume-loose') this.showNearbyCostumeProblem();
    this.dialogueBox?.show({ speaker: characterName(node.speaker), text: node.text }, () => {
      if (node.choices?.length) this.showChoices();
      else if (node.end) this.beginRepair();
      else {
        this.narrative?.advance();
        this.renderCurrentNode();
      }
    });
  }

  private showLooseFastening(): void {
    if (!this.rightWing || !this.looseStrap) return;
    this.characterStage?.setExpression('lexi', 'excited');
    this.cameras.main.shake(this.reducedMotion ? 40 : 150, this.reducedMotion ? 0.001 : 0.0025);
    if (this.reducedMotion) {
      this.rightWing.setPosition(510, 425).setAngle(14);
      this.looseStrap.setAngle(24).setY(478);
      return;
    }
    this.tweens.add({ targets: this.rightWing, x: 510, y: 425, angle: 14, duration: 420, ease: 'Back.Out' });
    this.tweens.add({ targets: this.looseStrap, y: 478, angle: 24, duration: 420, ease: 'Back.Out' });
  }

  private showNearbyCostumeProblem(): void {
    if (!this.nearbyDecoration) return;
    if (this.reducedMotion) {
      this.nearbyDecoration.setAngle(10);
      return;
    }
    this.tweens.add({ targets: this.nearbyDecoration, angle: 10, y: 398, duration: 430, ease: 'Back.Out' });
  }

  private showChoices(): void {
    this.choices = this.narrative?.availableChoices ?? [];
    const expectedCount = GameStateManager.shared.get('usedShortcut') ? 4 : 3;
    if (this.choices.length !== expectedCount) throw new Error(`The Carnival Crisis requires ${expectedCount} available choices.`);
    this.phase = 'choices';

    const panel = this.add.container(640, 360).setDepth(90).setAlpha(this.reducedMotion ? 1 : 0);
    const shade = this.add.rectangle(0, 0, 1280, 720, 0x21143c, 0.94);
    const heading = this.add
      .text(0, -255, 'What should Lexi do?', {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '42px',
        fontStyle: 'bold',
        color: '#fff8dc',
        stroke: '#6d3f91',
        strokeThickness: 8,
      })
      .setOrigin(0.5);
    const hint = this.add
      .text(0, 245, 'Each choice keeps the story moving • tap/click or use keys 1–4', {
        fontFamily: 'Trebuchet MS, sans-serif',
        fontSize: '21px',
        color: '#fff0a5',
      })
      .setOrigin(0.5);
    panel.add([shade, heading, hint]);
    const positions = expectedCount === 4
      ? [{ x: -300, y: -105 }, { x: 300, y: -105 }, { x: -300, y: 60 }, { x: 300, y: 60 }]
      : [{ x: -300, y: -75 }, { x: 300, y: -75 }, { x: 0, y: 95 }];
    this.choiceButtons = this.choices.map((choice, index) => {
      const position = positions[index];
      const button = new GameButton(this, position.x, position.y, `${index + 1}. ${choice.label}`, () => this.selectChoice(choice.id), {
        width: 540,
        height: 128,
        fontSize: 24,
        fillColor: index % 2 === 0 ? 0xfff2bd : 0xd8c2ef,
        hoverColor: 0xffdf81,
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

  private beginRepair(): void {
    if (!this.choiceMade) throw new Error('The Carnival Crisis repair requires a selected response.');
    this.repair = new CarnivalCrisisRepair(GameStateManager.shared);
    this.phase = 'repair-choose';
    const panel = this.add.container(640, 355).setDepth(100).setAlpha(this.reducedMotion ? 1 : 0);
    const shade = this.add.rectangle(0, 0, 1180, 590, 0x2b1648, 0.97).setStrokeStyle(7, 0xffd34e, 1);
    const title = this.add
      .text(0, -245, 'QUICK COSTUME REPAIR', {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '44px',
        fontStyle: 'bold',
        color: '#fff8dc',
        stroke: '#8d2f73',
        strokeThickness: 8,
      })
      .setOrigin(0.5);
    this.repairStatus = this.add
      .text(0, -175, 'Choose the item that can hold the fastening safely.', {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '26px',
        fontStyle: 'bold',
        color: '#fff0a5',
        align: 'center',
        wordWrap: { width: 930 },
      })
      .setOrigin(0.5);
    const note = this.add
      .text(0, 240, 'Try as many times as you need • tap/click or use keys 1–3', {
        fontFamily: 'Trebuchet MS, sans-serif',
        fontSize: '21px',
        color: '#fff8dc',
      })
      .setOrigin(0.5);
    panel.add([shade, title, this.repairStatus, note]);
    crisisRepairMaterials.forEach((material, index) => {
      const button = new GameButton(
        this,
        -340 + index * 340,
        20,
        `${index + 1}.  ${material.symbol}\n${material.label}`,
        () => this.selectMaterial(material.id),
        {
          width: 290,
          height: 150,
          fontSize: 27,
          fillColor: material.color,
          hoverColor: 0xffed84,
        },
      );
      this.children.remove(button);
      panel.add(button);
      this.repairButtons.set(material.id, button);
    });
    this.repairPanel = panel;
    if (!this.reducedMotion) this.tweens.add({ targets: panel, alpha: 1, duration: 280 });
  }

  private selectMaterial(materialId: RepairMaterialId): void {
    if (this.phase !== 'repair-choose' || !this.repair) return;
    const result = this.repair.selectMaterial(materialId);
    const button = this.repairButtons.get(materialId);
    if (result.status === 'try-again') {
      this.repairStatus?.setText(
        this.repair.snapshot.assistanceActive
          ? 'That one can decorate, but the firm golden clip can hold the fastening.'
          : 'That could be useful later. Try another item for a firm fastening.',
      );
      if (button && !this.reducedMotion) {
        button.setEnabled(false);
        this.tweens.add({
          targets: button,
          angle: { from: -4, to: 4 },
          duration: 70,
          yoyo: true,
          repeat: 2,
          onComplete: () => button.setAngle(0).setEnabled(true),
        });
      }
      if (this.repair.snapshot.assistanceActive) this.repairButtons.get('safety-clip')?.setSelected(true);
      return;
    }

    if (result.status === 'ready-to-secure') this.showSecureStep();
  }

  private showSecureStep(): void {
    this.phase = 'repair-secure';
    this.repairButtons.forEach((button) => button.setVisible(false).setEnabled(false));
    this.repairStatus?.setText('Great choice! Press the safety clip three gentle times to secure it.');
    this.secureButton = new GameButton(this, 0, 35, '◇  PRESS THE CLIP  ◇\n0 of 3', () => this.secureFastening(), {
      width: 520,
      height: 180,
      fontSize: 30,
      fillColor: 0xffd34e,
      hoverColor: 0xffed84,
    });
    this.children.remove(this.secureButton);
    this.repairPanel?.add(this.secureButton);
  }

  private secureFastening(): void {
    if (this.phase !== 'repair-secure' || !this.repair) return;
    const result = this.repair.secureFastening();
    this.secureButton?.setButtonText(`◇  PRESS THE CLIP  ◇\n${result.presses} of ${result.pressesNeeded}`);
    if (!this.reducedMotion && this.secureButton) {
      this.tweens.add({ targets: this.secureButton, scale: 0.94, duration: 70, yoyo: true, ease: 'Sine.InOut' });
    }
    if (result.status === 'completed') {
      this.phase = 'resolution';
      this.secureButton?.setEnabled(false).setButtonText('★  FASTENING SECURE!  ★');
      this.repairStatus?.setText('The costume is safe and ready to move again!');
      this.restoreCostumeVisual();
      this.addRepairSparkles();
      this.time.delayedCall(this.reducedMotion ? 220 : 950, () => {
        this.repairPanel?.destroy(true);
        this.repairPanel = undefined;
        this.playResolutionDialogue(crisisResolutionDialogue(GameStateManager.shared.snapshot));
      });
    }
  }

  private restoreCostumeVisual(): void {
    if (GameStateManager.shared.get('wingStrapBroke') && this.rightWing && this.looseStrap) {
      if (this.reducedMotion) {
        this.rightWing.setPosition(495, 390).setAngle(0);
        this.looseStrap.setPosition(440, 455).setAngle(0);
      } else {
        this.tweens.add({ targets: this.rightWing, x: 495, y: 390, angle: 0, duration: 430, ease: 'Back.Out' });
        this.tweens.add({ targets: this.looseStrap, x: 440, y: 455, angle: 0, duration: 430, ease: 'Back.Out' });
      }
    } else if (this.nearbyDecoration) {
      if (this.reducedMotion) this.nearbyDecoration.setAngle(0).setY(375);
      else this.tweens.add({ targets: this.nearbyDecoration, y: 375, angle: 0, duration: 430, ease: 'Back.Out' });
    }
  }

  private addRepairSparkles(): void {
    const count = this.reducedMotion ? 8 : 24;
    for (let index = 0; index < count; index += 1) {
      const sparkle = this.add
        .text(Phaser.Math.Between(260, 1010), Phaser.Math.Between(130, 560), index % 2 ? '★' : '✦', {
          fontFamily: 'Trebuchet MS, sans-serif',
          fontSize: `${Phaser.Math.Between(18, 30)}px`,
          fontStyle: 'bold',
          color: index % 3 === 0 ? '#57c7e3' : index % 3 === 1 ? '#f49ac2' : '#ffd34e',
          stroke: '#4e2869',
          strokeThickness: 4,
        })
        .setDepth(120);
      if (!this.reducedMotion) {
        this.tweens.add({ targets: sparkle, y: sparkle.y - 65, alpha: 0, angle: 30, duration: 850, delay: index * 20 });
      }
    }
  }

  private playResolutionDialogue(lines: readonly CharacterDialogueLine[], index = 0): void {
    const line = lines[index];
    if (!line) {
      this.showEndpoint();
      return;
    }
    this.phase = 'resolution';
    this.characterStage?.focus(line.characterId, line.expression, this.reducedMotion);
    this.dialogueBox?.show({ speaker: line.speaker, text: line.text }, () => this.playResolutionDialogue(lines, index + 1));
  }

  private showEndpoint(): void {
    if (this.phase === 'complete') return;
    StoryProgression.shared.completeMilestone7();
    this.phase = 'complete';
    const state = GameStateManager.shared.snapshot;
    const panel = this.add.container(640, 360).setDepth(130).setAlpha(this.reducedMotion ? 1 : 0).setScale(this.reducedMotion ? 1 : 0.86);
    const shade = this.add.rectangle(0, 0, 900, 470, 0x2b1648, 0.98).setStrokeStyle(8, 0xffd34e, 1);
    const title = this.add
      .text(0, -155, 'CRISIS SOLVED', {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '51px',
        fontStyle: 'bold',
        color: '#fff8dc',
        stroke: '#8d2f73',
        strokeThickness: 9,
      })
      .setOrigin(0.5);
    const message = this.add
      .text(
        0,
        -48,
        state.wingStrapBroke
          ? 'Lexi’s butterfly wings are secure again, and the friends can rejoin the parade.'
          : 'The nearby masquerader’s costume is secure, and Lexi’s own wings stayed strong.',
        {
          fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
          fontSize: '27px',
          color: '#fff0a5',
          align: 'center',
          wordWrap: { width: 760 },
        },
      )
      .setOrigin(0.5);
    const next = this.add
      .text(0, 55, 'The immediate problem is solved. Now see where their choices lead.', {
        fontFamily: 'Trebuchet MS, sans-serif',
        fontSize: '22px',
        color: '#fff8dc',
        align: 'center',
        wordWrap: { width: 730 },
      })
      .setOrigin(0.5);
    const endingButton = new GameButton(this, 0, 145, 'See your story ending  ▶', () => this.beginEnding(), {
      width: 410,
      height: 78,
      fontSize: 26,
      fillColor: 0xffd34e,
    });
    this.children.remove(endingButton);
    panel.add([shade, title, message, next, endingButton]);
    if (!this.reducedMotion) this.tweens.add({ targets: panel, alpha: 1, scale: 1, duration: 430, ease: 'Back.Out' });
  }

  private beginEnding(): void {
    if (this.phase !== 'complete' || StoryProgression.shared.currentStage !== 'milestone-7-complete') return;
    this.phase = 'transition';
    StoryProgression.shared.enterEnding();
    this.input.enabled = false;
    this.cameras.main.fadeOut(this.reducedMotion ? 80 : 520, 255, 211, 71);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.start('EndingScene');
    });
  }
}
