import Phaser from 'phaser';
import { carnivalChoicesEpisode } from '../../episodes/carnival-choices/episode';
import type { EndingDefinition, StoryCardAchievement, StoryCardData } from '../../types/endings';
import { CharacterStage } from '../components/CharacterStage';
import { DialogueBox } from '../components/DialogueBox';
import { GameButton } from '../components/GameButton';
import { addMuteControl } from '../components/MuteControl';
import { AudioManager } from '../systems/AudioManager';
import { EndingResolver } from '../systems/EndingResolver';
import { GameStateManager } from '../systems/GameStateManager';
import { shouldReduceMotion } from '../systems/MotionPreference';
import { StoryCardBuilder } from '../systems/StoryCardBuilder';
import { StoryProgression } from '../systems/StoryProgression';

type EndingPhase = 'dialogue' | 'story-card' | 'transition';

export class EndingScene extends Phaser.Scene {
  private phase: EndingPhase = 'dialogue';
  private reducedMotion = false;
  private ending?: EndingDefinition;
  private storyCard?: StoryCardData;
  private characterStage?: CharacterStage;
  private dialogueBox?: DialogueBox;

  constructor() {
    super('EndingScene');
  }

  create(): void {
    if (!StoryProgression.shared.endingReady) {
      throw new Error('EndingScene requires the completed Carnival Crisis.');
    }

    AudioManager.shared.bind(this);
    this.phase = 'dialogue';
    this.reducedMotion = shouldReduceMotion();
    const state = GameStateManager.shared.snapshot;
    const endingId = EndingResolver.resolve(state);
    this.ending = carnivalChoicesEpisode.endings[endingId];
    this.storyCard = StoryCardBuilder.build(state, this.ending);

    const background = this.add.image(640, 360, 'carnival-background');
    const coverScale = Math.max(1280 / background.width, 720 / background.height);
    background.setScale(coverScale);
    this.add.rectangle(640, 360, 1280, 720, 0x24123d, 0.38).setDepth(2);
    this.add
      .text(640, 50, this.ending.title.toUpperCase(), {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '46px',
        fontStyle: 'bold',
        color: '#fff8dc',
        stroke: '#6d3f91',
        strokeThickness: 10,
      })
      .setOrigin(0.5)
      .setDepth(35);

    this.characterStage = new CharacterStage(this, carnivalChoicesEpisode.characters, {
      lexi: { x: 420, y: 475, width: 205, height: 285 },
      angel: { x: 660, y: 470, width: 225, height: 280 },
      junior: { x: 940, y: 475, width: 165, height: 275 },
    });
    this.characterStage.showLead('lexi');
    this.characterStage.revealAll(this.reducedMotion);
    this.dialogueBox = new DialogueBox(this);
    addMuteControl(this).setDepth(200);
    this.registerKeyboard();
    this.cameras.main.fadeIn(this.reducedMotion ? 80 : 520, 255, 211, 71);
    this.time.delayedCall(this.reducedMotion ? 80 : 420, () => this.playEndingDialogue());
  }

  private registerKeyboard(): void {
    const enter = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    const space = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    const replay = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    const title = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.T);
    const advance = () => {
      if (this.phase === 'dialogue') this.dialogueBox?.handleKeyboardAdvance();
      else if (this.phase === 'story-card') this.replayStory();
    };
    enter?.on(Phaser.Input.Keyboard.Events.DOWN, advance);
    space?.on(Phaser.Input.Keyboard.Events.DOWN, advance);
    replay?.on(Phaser.Input.Keyboard.Events.DOWN, () => this.replayStory());
    title?.on(Phaser.Input.Keyboard.Events.DOWN, () => this.returnToTitle());
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      enter?.destroy();
      space?.destroy();
      replay?.destroy();
      title?.destroy();
    });
  }

  private playEndingDialogue(index = 0): void {
    const line = this.ending?.dialogue[index];
    if (!line) {
      this.showStoryCard();
      return;
    }

    this.phase = 'dialogue';
    this.characterStage?.focus(line.characterId, line.expression, this.reducedMotion);
    this.dialogueBox?.show(
      { speaker: line.speaker, text: line.text },
      () => this.playEndingDialogue(index + 1),
    );
  }

  private showStoryCard(): void {
    if (!this.storyCard || this.phase === 'story-card') return;
    StoryProgression.shared.completeMilestone8();
    this.phase = 'story-card';

    const panel = this.add
      .container(640, 360)
      .setDepth(140)
      .setAlpha(this.reducedMotion ? 1 : 0)
      .setScale(this.reducedMotion ? 1 : 0.9);
    const shadow = this.add.rectangle(8, 10, 1180, 674, 0x160c2b, 0.5);
    const card = this.add.rectangle(0, 0, 1180, 674, 0xfffbdf, 0.99).setStrokeStyle(9, 0xffd34e, 1);
    const heading = this.add
      .text(0, -294, this.storyCard.heading, {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '31px',
        fontStyle: 'bold',
        color: '#8d2f73',
      })
      .setOrigin(0.5);
    const endingTitle = this.add
      .text(0, -248, this.storyCard.endingTitle, {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '44px',
        fontStyle: 'bold',
        color: '#2b1648',
      })
      .setOrigin(0.5);
    const reflection = this.add
      .text(0, -190, this.storyCard.reflection, {
        fontFamily: 'Trebuchet MS, sans-serif',
        fontSize: '23px',
        color: '#4e2869',
        align: 'center',
        wordWrap: { width: 1030 },
      })
      .setOrigin(0.5);
    const momentsTitle = this.add
      .text(-520, -125, 'MOMENTS FROM YOUR STORY', {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '24px',
        fontStyle: 'bold',
        color: '#8d2f73',
      });
    const moments = this.add.text(
      -520,
      -87,
      this.storyCard.accomplishments.map((item) => `• ${item}`).join('\n'),
      {
        fontFamily: 'Trebuchet MS, sans-serif',
        fontSize: '24px',
        color: '#2b1648',
        lineSpacing: 6,
        wordWrap: { width: 1010 },
      },
    );
    panel.add([shadow, card, heading, endingTitle, reflection, momentsTitle, moments]);

    const badgePositions = [-350, 0, 350];
    this.storyCard.achievements.forEach((achievement, index) => {
      const badge = this.createAchievementBadge(badgePositions[index], 102, achievement);
      this.children.remove(badge);
      panel.add(badge);
    });

    const replayButton = new GameButton(this, -235, 272, 'PLAY AGAIN  ↻', () => this.replayStory(), {
      width: 390,
      height: 82,
      fontSize: 29,
      fillColor: 0xffd34e,
    });
    const titleButton = new GameButton(this, 235, 272, 'TITLE', () => this.returnToTitle(), {
      width: 300,
      height: 82,
      fontSize: 29,
      fillColor: 0xd8c2ef,
    });
    this.children.remove(replayButton);
    this.children.remove(titleButton);
    panel.add([replayButton, titleButton]);
    this.add
      .text(640, 696, 'Enter / Space / R: Play Again   •   T: Title   •   M: Mute', {
        fontFamily: 'Trebuchet MS, sans-serif',
        fontSize: '19px',
        color: '#fff8dc',
        backgroundColor: '#2b1648dd',
        padding: { x: 12, y: 4 },
      })
      .setOrigin(0.5)
      .setDepth(145);

    if (!this.reducedMotion) {
      this.tweens.add({ targets: panel, alpha: 1, scale: 1, duration: 460, ease: 'Back.Out' });
      this.addCelebration();
    }
  }

  private createAchievementBadge(
    x: number,
    y: number,
    achievement: StoryCardAchievement,
  ): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);
    const backing = this.add.rectangle(0, 0, 300, 130, 0xf8e7b0, 1).setStrokeStyle(4, 0x6d3f91, 1);
    const seal = this.add.circle(-104, -4, 43, achievement.source === 'ending' ? 0xf49ac2 : 0xffd34e, 1)
      .setStrokeStyle(4, 0xfffbdf, 1);
    const symbol = this.add
      .text(-104, -4, achievement.symbol, {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '31px',
        fontStyle: 'bold',
        color: '#4e2869',
      })
      .setOrigin(0.5);
    const label = this.add
      .text(30, -23, achievement.label, {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '20px',
        fontStyle: 'bold',
        color: '#8d2f73',
        align: 'center',
        wordWrap: { width: 165 },
      })
      .setOrigin(0.5);
    const description = this.add
      .text(30, 24, achievement.description, {
        fontFamily: 'Trebuchet MS, sans-serif',
        fontSize: '18px',
        color: '#2b1648',
        align: 'center',
        wordWrap: { width: 165 },
      })
      .setOrigin(0.5);
    container.add([backing, seal, symbol, label, description]);
    return container;
  }

  private addCelebration(): void {
    for (let index = 0; index < 18; index += 1) {
      const sparkle = this.add
        .text(Phaser.Math.Between(35, 1245), Phaser.Math.Between(25, 690), index % 2 ? '★' : '✦', {
          fontFamily: 'Trebuchet MS, sans-serif',
          fontSize: `${Phaser.Math.Between(16, 27)}px`,
          color: index % 3 === 0 ? '#57c7e3' : index % 3 === 1 ? '#f49ac2' : '#ffd34e',
          stroke: '#4e2869',
          strokeThickness: 3,
        })
        .setDepth(150);
      this.tweens.add({
        targets: sparkle,
        y: sparkle.y - 45,
        alpha: 0.15,
        duration: 900,
        delay: index * 30,
        yoyo: true,
        repeat: 1,
      });
    }
  }

  private replayStory(): void {
    if (this.phase !== 'story-card') return;
    this.phase = 'transition';
    StoryProgression.shared.startNewStory();
    this.transitionTo('ClubScene');
  }

  private returnToTitle(): void {
    if (this.phase !== 'story-card') return;
    this.phase = 'transition';
    this.transitionTo('TitleScene');
  }

  private transitionTo(sceneKey: 'ClubScene' | 'TitleScene'): void {
    this.input.enabled = false;
    this.cameras.main.fadeOut(this.reducedMotion ? 80 : 420, 48, 23, 76);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => this.scene.start(sceneKey));
  }
}
