import Phaser from 'phaser';
import { panJamPlan, panZones } from '../../episodes/carnival-choices/panJam';
import type { PanInputResult, PanZoneId } from '../../types/panJam';
import { GameButton } from '../components/GameButton';
import { addMuteControl } from '../components/MuteControl';
import { PanZone } from '../components/PanZone';
import { SteelpanGame } from '../minigames/steelpan/SteelpanGame';
import { AudioManager } from '../systems/AudioManager';
import { GameStateManager } from '../systems/GameStateManager';
import { shouldReduceMotion } from '../systems/MotionPreference';
import { SteelpanSynth } from '../systems/SteelpanSynth';
import { StoryProgression } from '../systems/StoryProgression';

const ZONE_X = [170, 483, 797, 1110] as const;

export class PanGameScene extends Phaser.Scene {
  private gameModel?: SteelpanGame;
  private synth?: SteelpanSynth;
  private zones = new Map<PanZoneId, PanZone>();
  private statusText?: Phaser.GameObjects.Text;
  private progressText?: Phaser.GameObjects.Text;
  private patternText?: Phaser.GameObjects.Text;
  private readyButton?: GameButton;
  private inputLocked = true;
  private reducedMotion = false;
  private playerSymbols: string[] = [];

  constructor() {
    super('PanGameScene');
  }

  create(): void {
    if (!StoryProgression.shared.panJamReady) throw new Error('PanGameScene requires Carnival arrival.');
    AudioManager.shared.bind(this);
    this.zones.clear();
    this.readyButton = undefined;
    this.inputLocked = true;
    this.playerSymbols = [];
    this.reducedMotion = shouldReduceMotion();
    this.gameModel = new SteelpanGame(GameStateManager.shared, panJamPlan);
    this.synth = new SteelpanSynth(() => AudioManager.shared.isMuted());

    this.add.image(640, 360, 'pan-jam-background').setDisplaySize(1280, 720);
    this.add.rectangle(640, 360, 1280, 720, 0x24123d, 0.54);
    this.add.rectangle(640, 49, 740, 80, 0x2b1648, 0.9).setStrokeStyle(5, 0xffd34e, 1).setDepth(25);
    this.add
      .text(640, 45, 'PAN JAM', {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '51px',
        fontStyle: 'bold',
        color: '#fff8dc',
        stroke: '#6d3f91',
        strokeThickness: 9,
      })
      .setOrigin(0.5)
      .setDepth(26);

    this.progressText = this.add
      .text(640, 104, 'Warm-up', {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '25px',
        fontStyle: 'bold',
        color: '#fff0a5',
        backgroundColor: '#2b1648dd',
        padding: { x: 16, y: 7 },
      })
      .setOrigin(0.5)
      .setDepth(26);
    this.statusText = this.add
      .text(640, 164, 'Watch the symbol. Listen to its tone. Then play it back!', {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '27px',
        fontStyle: 'bold',
        color: '#fff8dc',
        align: 'center',
        wordWrap: { width: 1000 },
      })
      .setOrigin(0.5)
      .setDepth(27);
    this.patternText = this.add
      .text(640, 232, 'Every note has a sound, symbol, shape, and light.', {
        fontFamily: 'Trebuchet MS, sans-serif',
        fontSize: '24px',
        color: '#fff8dc',
        backgroundColor: '#32184fe8',
        padding: { x: 18, y: 9 },
      })
      .setOrigin(0.5)
      .setDepth(28);

    const panRim = this.add.graphics().setDepth(29);
    panRim.fillStyle(0xb9c9d2, 0.9);
    panRim.lineStyle(8, 0xfff8dc, 0.95);
    panRim.fillRoundedRect(30, 338, 1220, 272, 82);
    panRim.strokeRoundedRect(30, 338, 1220, 272, 82);
    panRim.lineStyle(4, 0x5b3a70, 0.55);
    panRim.strokeRoundedRect(50, 358, 1180, 232, 67);
    this.createZones();

    this.readyButton = new GameButton(this, 640, 300, 'Listen and play  ▶', () => this.startExperience(), {
      width: 390,
      height: 78,
      fontSize: 30,
      fillColor: 0xffd34e,
    }).setDepth(45);
    this.add
      .text(640, 665, 'Tap/click a pan zone or use keys 1–4 • M toggles sound', {
        fontFamily: 'Trebuchet MS, sans-serif',
        fontSize: '21px',
        color: '#fff8dc',
        backgroundColor: '#2b1648dd',
        padding: { x: 15, y: 8 },
      })
      .setOrigin(0.5)
      .setDepth(40);

    addMuteControl(this);
    this.registerKeyboard();
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.synth?.close());
    this.cameras.main.fadeIn(this.reducedMotion ? 100 : 600, 87, 199, 227);
  }

  private createZones(): void {
    panZones.forEach((definition, index) => {
      const zone = new PanZone(this, ZONE_X[index], 480, definition, (selected) => this.handlePlayerInput(selected));
      this.zones.set(definition.id, zone);
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
    const start = () => {
      if (this.gameModel?.snapshot.phase === 'ready' && this.readyButton) this.startExperience();
    };
    enter?.on(Phaser.Input.Keyboard.Events.DOWN, start);
    space?.on(Phaser.Input.Keyboard.Events.DOWN, start);
    numberKeys.forEach((key, index) => {
      key?.on(Phaser.Input.Keyboard.Events.DOWN, () => {
        const definition = panZones[index];
        if (definition) this.zones.get(definition.id)?.activateFromKeyboard();
      });
    });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      enter?.destroy();
      space?.destroy();
      numberKeys.forEach((key) => key?.destroy());
    });
  }

  private startExperience(): void {
    if (!this.gameModel || this.gameModel.snapshot.phase !== 'ready' || !this.readyButton) return;
    this.synth?.unlock();
    this.readyButton.destroy(true);
    this.readyButton = undefined;
    this.startCurrentPlayback();
  }

  private startCurrentPlayback(): void {
    if (!this.gameModel) return;
    const sequence = this.gameModel.beginPlayback();
    const snapshot = this.gameModel.snapshot;
    this.inputLocked = true;
    this.playerSymbols = [];
    this.setZonesEnabled(false);
    this.updateProgress();
    this.statusText?.setText(snapshot.inTutorial ? 'Junior: Watch and listen. Then play.' : 'Junior: Listen first. Then play.');
    this.patternText?.setText('Watch:');
    this.playSequenceNote(sequence, 0);
  }

  private playSequenceNote(sequence: readonly PanZoneId[], index: number): void {
    if (!this.gameModel) return;
    const zoneId = sequence[index];
    if (!zoneId) {
      this.gameModel.finishPlayback();
      this.inputLocked = false;
      this.setZonesEnabled(true);
      this.playerSymbols = [];
      this.patternText?.setText('Your turn — copy the lights and symbols!');
      this.statusText?.setText('Lexi: You’ve got this!');
      return;
    }

    const definition = panZones.find((zone) => zone.id === zoneId);
    const zone = this.zones.get(zoneId);
    if (!definition || !zone) throw new Error(`Missing Pan Jam zone "${zoneId}".`);
    const snapshot = this.gameModel.snapshot;
    zone.playCue(snapshot.cueDurationMs, this.reducedMotion);
    this.synth?.play(definition);
    const visiblePattern = sequence.slice(0, index + 1).map((id) => panZones.find((zoneData) => zoneData.id === id)?.symbol ?? '?');
    this.patternText?.setText(`Watch:  ${visiblePattern.join('   ')}`);
    this.time.delayedCall(snapshot.playbackIntervalMs, () => this.playSequenceNote(sequence, index + 1));
  }

  private handlePlayerInput(zone: PanZone): void {
    if (this.inputLocked || !this.gameModel || this.gameModel.snapshot.phase !== 'input') return;
    const before = this.gameModel.snapshot;
    zone.playCue(before.cueDurationMs, this.reducedMotion);
    this.synth?.play(zone.definition);
    const result = this.gameModel.submitInput(zone.definition.id);

    if (result.status === 'incorrect') {
      zone.gentlyReturn();
      this.inputLocked = true;
      this.setZonesEnabled(false);
      const assistLevel = this.gameModel.snapshot.assistLevel;
      this.statusText?.setText(
        assistLevel >= 2
          ? 'Lexi: You’ve got this! The lights will stay a little longer.'
          : 'Angel: Again! Again! Let’s watch the pattern once more.',
      );
      this.patternText?.setText('Good try — watch the friendly replay.');
      this.time.delayedCall(this.reducedMotion ? 220 : 620, () => this.startCurrentPlayback());
      return;
    }

    const acceptedDefinition = result.status === 'assisted'
      ? panZones.find((definition) => definition.id === result.expectedZoneId)
      : zone.definition;
    this.playerSymbols.push(acceptedDefinition?.symbol ?? zone.definition.symbol);
    this.patternText?.setText(`Your turn:  ${this.playerSymbols.join('   ')}`);
    if (result.status === 'assisted') {
      this.inputLocked = true;
      this.setZonesEnabled(false);
      this.statusText?.setText('Lexi: Let’s play that note together!');
      this.time.delayedCall(
        this.reducedMotion ? 80 : 260,
        () => this.playAssistedNote(result, before.inTutorial, before.currentRound),
      );
      return;
    }

    if (result.sequenceComplete) {
      this.finishSequence(result, before.inTutorial, before.currentRound);
    } else {
      this.statusText?.setText('Lexi: That’s it—keep the pattern going!');
    }
  }

  private playAssistedNote(result: PanInputResult, wasTutorial: boolean, completedRound: number): void {
    const definition = panZones.find((zone) => zone.id === result.expectedZoneId);
    const expectedZone = this.zones.get(result.expectedZoneId);
    if (definition && expectedZone) {
      expectedZone.playCue(760, this.reducedMotion);
      this.synth?.play(definition);
    }
    if (result.sequenceComplete) {
      this.time.delayedCall(
        this.reducedMotion ? 120 : 700,
        () => this.finishSequence(result, wasTutorial, completedRound),
      );
    } else {
      this.time.delayedCall(this.reducedMotion ? 120 : 700, () => {
        this.inputLocked = false;
        this.setZonesEnabled(true);
        this.statusText?.setText('Junior: Now try the next light.');
      });
    }
  }

  private finishSequence(result: PanInputResult, wasTutorial: boolean, completedRound: number): void {
    this.inputLocked = true;
    this.setZonesEnabled(false);
    if (result.gameComplete) {
      this.statusText?.setText('Lexi: We made the whole rhythm together!');
      this.time.delayedCall(this.reducedMotion ? 180 : 700, () => this.celebrate());
      return;
    }

    if (wasTutorial) {
      this.statusText?.setText(this.gameModel?.snapshot.inTutorial ? 'Angel: Again! This time, two notes!' : 'Lexi: Warm-up complete—Pan Jam begins!');
    } else {
      this.statusText?.setText(`Angel: Round ${completedRound} shining bright!`);
    }
    this.patternText?.setText('Beautiful pattern! The next one is coming.');
    this.time.delayedCall(this.reducedMotion ? 250 : 1050, () => this.startCurrentPlayback());
  }

  private updateProgress(): void {
    const snapshot = this.gameModel?.snapshot;
    if (!snapshot) return;
    this.progressText?.setText(
      snapshot.inTutorial
        ? `Warm-up ${snapshot.tutorialStep} of ${snapshot.tutorialSteps}`
        : `Round ${snapshot.currentRound} of ${snapshot.totalRounds}`,
    );
  }

  private setZonesEnabled(enabled: boolean): void {
    this.zones.forEach((zone) => zone.setEnabled(enabled));
  }

  private celebrate(): void {
    if (!this.gameModel) return;
    StoryProgression.shared.completeMilestone5();
    const snapshot = this.gameModel.snapshot;
    const celebrationCount = this.reducedMotion ? 10 : snapshot.strongPerformance ? 44 : 30;
    const colors = [0xffd34e, 0xf49ac2, 0x57c7e3, 0x79d18b, 0x9b6bd0];
    for (let index = 0; index < celebrationCount; index += 1) {
      const note = this.add
        .text(Phaser.Math.Between(35, 1245), this.reducedMotion ? Phaser.Math.Between(60, 640) : -30, index % 2 ? '♪' : '★', {
          fontFamily: 'Trebuchet MS, sans-serif',
          fontSize: `${Phaser.Math.Between(22, 36)}px`,
          fontStyle: 'bold',
          color: `#${Phaser.Utils.Array.GetRandom(colors).toString(16).padStart(6, '0')}`,
          stroke: '#4e2869',
          strokeThickness: 4,
        })
        .setDepth(90);
      if (!this.reducedMotion) {
        this.tweens.add({
          targets: note,
          y: Phaser.Math.Between(500, 760),
          x: `+=${Phaser.Math.Between(-70, 70)}`,
          angle: Phaser.Math.Between(-40, 40),
          duration: Phaser.Math.Between(1500, 2500),
          delay: Phaser.Math.Between(0, 450),
          ease: 'Sine.In',
        });
      }
    }

    const panel = this.add.container(640, 360).setDepth(110).setScale(this.reducedMotion ? 1 : 0.2).setAlpha(this.reducedMotion ? 1 : 0);
    const shade = this.add.rectangle(0, 0, 850, 500, 0x2b1648, 0.97).setStrokeStyle(8, 0xffd34e, 1);
    const badge = this.add.graphics();
    badge.fillStyle(0xffd34e, 1);
    badge.lineStyle(7, 0xfff8dc, 1);
    badge.fillCircle(0, -130, 82);
    badge.strokeCircle(0, -130, 82);
    badge.fillStyle(0x6d3f91, 1);
    badge.fillPoints([
      new Phaser.Geom.Point(0, -185),
      new Phaser.Geom.Point(17, -148),
      new Phaser.Geom.Point(58, -143),
      new Phaser.Geom.Point(27, -115),
      new Phaser.Geom.Point(36, -74),
      new Phaser.Geom.Point(0, -95),
      new Phaser.Geom.Point(-36, -74),
      new Phaser.Geom.Point(-27, -115),
      new Phaser.Geom.Point(-58, -143),
      new Phaser.Geom.Point(-17, -148),
    ], true);
    const title = this.add
      .text(0, -25, 'RHYTHM STAR', {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '55px',
        fontStyle: 'bold',
        color: '#fff8dc',
        stroke: '#8d2f73',
        strokeThickness: 9,
      })
      .setOrigin(0.5);
    const message = this.add
      .text(0, 43, 'You listened, remembered, and kept the Carnival rhythm moving!', {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '25px',
        color: '#fff0a5',
        align: 'center',
        wordWrap: { width: 710 },
      })
      .setOrigin(0.5);
    const endpoint = this.add
      .text(0, 91, 'The friends’ Carnival adventure continues in Milestone 6.', {
        fontFamily: 'Trebuchet MS, sans-serif',
        fontSize: '20px',
        color: '#fff8dc',
      })
      .setOrigin(0.5);
    const replay = new GameButton(this, -205, 165, 'Play Pan Jam again', () => {
      this.gameModel?.restart();
      StoryProgression.shared.replayPanJam();
      this.scene.restart();
    }, { width: 340, height: 72, fontSize: 25 });
    const titleButton = new GameButton(this, 205, 165, 'Return to title', () => this.scene.start('TitleScene'), {
      width: 300,
      height: 72,
      fontSize: 25,
    });
    this.children.remove(replay);
    this.children.remove(titleButton);
    panel.add([shade, badge, title, message, endpoint, replay, titleButton]);
    if (!this.reducedMotion) this.tweens.add({ targets: panel, scale: 1, alpha: 1, duration: 540, ease: 'Back.Out' });
  }
}
