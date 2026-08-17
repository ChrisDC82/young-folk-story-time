import Phaser from 'phaser';
import {
  costumeCardStartingOrder,
  costumeSlotLabels,
  costumeStepOrder,
  costumeSteps,
} from '../../episodes/carnival-choices/costume';
import type { CostumeStepId } from '../../types/minigames';
import { CostumeStepCard } from '../components/CostumeStepCard';
import { GameButton } from '../components/GameButton';
import { addMuteControl } from '../components/MuteControl';
import { CostumeSequenceGame } from '../minigames/costume/CostumeSequenceGame';
import { AudioManager } from '../systems/AudioManager';
import { GameStateManager } from '../systems/GameStateManager';

interface SlotDisplay {
  center: Phaser.Math.Vector2;
  background: Phaser.GameObjects.Graphics;
}

const SLOT_X = [170, 483, 797, 1110] as const;
const SLOT_Y = 315;

export class CostumeGameScene extends Phaser.Scene {
  private gameModel?: CostumeSequenceGame;
  private cards = new Map<CostumeStepId, CostumeStepCard>();
  private slots: SlotDisplay[] = [];
  private instruction?: Phaser.GameObjects.Text;
  private interactionLocked = false;

  constructor() {
    super('CostumeGameScene');
  }

  create(): void {
    AudioManager.shared.bind(this);
    this.gameModel = new CostumeSequenceGame(GameStateManager.shared, costumeStepOrder);

    this.add.image(640, 360, 'lexi-making-wings').setDisplaySize(1280, 720);
    this.add.rectangle(640, 360, 1280, 720, 0x25133d, 0.25);
    this.add.rectangle(640, 61, 1235, 103, 0x2b1648, 0.88).setStrokeStyle(4, 0xffd34e, 0.9);
    this.add
      .text(640, 37, 'Carnival Costume Challenge', {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '39px',
        fontStyle: 'bold',
        color: '#fff8dc',
        stroke: '#6d3f91',
        strokeThickness: 7,
      })
      .setOrigin(0.5);
    this.instruction = this.add
      .text(640, 86, 'Drag or tap the cards into order: First → Next → Then → Last', {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '22px',
        fontStyle: 'bold',
        color: '#fff0a5',
      })
      .setOrigin(0.5);

    this.createSlots();
    this.createCards();
    addMuteControl(this);
    this.cameras.main.fadeIn(650, 255, 211, 71);
    this.time.delayedCall(450, () => this.updateHint());
  }

  private createSlots(): void {
    this.slots = costumeSlotLabels.map((label, index) => {
      const center = new Phaser.Math.Vector2(SLOT_X[index], SLOT_Y);
      const background = this.add.graphics().setDepth(12);
      this.drawSlot(background, center.x, center.y, false, false);
      this.add
        .text(center.x, center.y - 83, label, {
          fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
          fontSize: '28px',
          fontStyle: 'bold',
          color: '#fff8dc',
          stroke: '#44205f',
          strokeThickness: 6,
        })
        .setOrigin(0.5)
        .setDepth(14);
      return { center, background };
    });
  }

  private createCards(): void {
    const stepById = new Map(costumeSteps.map((step) => [step.id, step]));
    costumeCardStartingOrder.forEach((stepId, index) => {
      const step = stepById.get(stepId);
      if (!step) throw new Error(`Missing costume card data for "${stepId}".`);
      const card = new CostumeStepCard(
        this,
        SLOT_X[index],
        620,
        step,
        (droppedCard) => this.handleDrop(droppedCard),
        (tappedCard) => this.handleTap(tappedCard),
      );
      this.cards.set(stepId, card);
    });
  }

  private handleDrop(card: CostumeStepCard): void {
    if (this.interactionLocked) return;
    const slotIndex = this.closestSlot(card.x, card.y);
    if (slotIndex === null) {
      card.returnHome();
      return;
    }
    this.placeCard(card.step.id, slotIndex);
  }

  private handleTap(card: CostumeStepCard): void {
    if (this.interactionLocked || !this.gameModel) return;
    const slots = this.gameModel.snapshot.slots;
    const currentSlot = slots.indexOf(card.step.id);
    const emptySlot = slots.findIndex((stepId) => stepId === null);
    const targetSlot = currentSlot >= 0 ? (currentSlot + 1) % slots.length : emptySlot;
    if (targetSlot >= 0) this.placeCard(card.step.id, targetSlot);
  }

  private placeCard(stepId: CostumeStepId, slotIndex: number): void {
    if (!this.gameModel) return;
    const result = this.gameModel.place(stepId, slotIndex);
    this.syncCardPositions();

    if (result.status === 'incorrect') {
      this.interactionLocked = true;
      this.instruction?.setText('Good try! Let’s give the cards a gentle shuffle and look again.');
      let delay = 0;
      this.cards.forEach((card) => {
        card.setEnabled(false);
        card.wobbleAndReturn(delay);
        delay += 45;
      });
      this.time.delayedCall(820, () => {
        this.interactionLocked = false;
        this.cards.forEach((card) => card.setEnabled(true));
        this.instruction?.setText('Which step belongs First? The cards are ready for another try.');
        this.updateHint();
      });
      return;
    }

    if (result.status === 'completed') {
      this.interactionLocked = true;
      this.cards.forEach((card) => card.setEnabled(false).setHint(false));
      this.instruction?.setText('You made the wings step by step!');
      this.time.delayedCall(280, () => this.celebrate());
      return;
    }

    this.updateHint();
  }

  private closestSlot(x: number, y: number): number | null {
    let closestIndex: number | null = null;
    let closestDistance = Number.POSITIVE_INFINITY;
    for (let index = 0; index < this.slots.length; index += 1) {
      const slot = this.slots[index];
      const distance = Phaser.Math.Distance.Between(x, y, slot.center.x, slot.center.y);
      if (distance <= 145 && distance < closestDistance) {
        closestIndex = index;
        closestDistance = distance;
      }
    }
    return closestIndex;
  }

  private syncCardPositions(): void {
    if (!this.gameModel) return;
    const state = this.gameModel.snapshot;
    this.cards.forEach((card, stepId) => {
      const slotIndex = state.slots.indexOf(stepId);
      if (slotIndex >= 0) {
        const slot = this.slots[slotIndex];
        card.moveToSlot(slot.center.x, slot.center.y);
      } else if (Phaser.Math.Distance.Between(card.x, card.y, card.homeX, card.homeY) > 4) {
        card.returnHome();
      }
    });
  }

  private updateHint(): void {
    if (!this.gameModel) return;
    const snapshot = this.gameModel.snapshot;
    this.cards.forEach((card, stepId) => card.setHint(snapshot.hintActive && snapshot.hintStepId === stepId));
    this.slots.forEach((slot, index) => {
      this.drawSlot(
        slot.background,
        slot.center.x,
        slot.center.y,
        snapshot.hintActive && snapshot.hintSlotIndex === index,
        snapshot.slots[index] !== null,
      );
    });
  }

  private drawSlot(
    graphics: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    hinted: boolean,
    filled: boolean,
  ): void {
    graphics.clear();
    graphics.fillStyle(filled ? 0x492863 : 0x2b1648, filled ? 0.78 : 0.64);
    graphics.lineStyle(hinted ? 7 : 4, hinted ? 0xffed84 : 0xffe3a3, hinted ? 1 : 0.82);
    graphics.fillRoundedRect(x - 122, y - 68, 244, 136, 24);
    graphics.strokeRoundedRect(x - 122, y - 68, 244, 136, 24);
    if (!filled) {
      graphics.lineStyle(3, 0xfff4c2, 0.45);
      graphics.strokeRoundedRect(x - 102, y - 50, 204, 100, 18);
    }
  }

  private celebrate(): void {
    const colors = [0xffd34e, 0xf49ac2, 0x57c7e3, 0x79d18b, 0xa676d2];
    for (let index = 0; index < 48; index += 1) {
      const confetti = this.add
        .rectangle(
          Phaser.Math.Between(50, 1230),
          Phaser.Math.Between(-120, -10),
          Phaser.Math.Between(7, 14),
          Phaser.Math.Between(14, 26),
          Phaser.Utils.Array.GetRandom(colors),
        )
        .setDepth(90)
        .setAngle(Phaser.Math.Between(-30, 30));
      this.tweens.add({
        targets: confetti,
        y: Phaser.Math.Between(420, 760),
        x: `+=${Phaser.Math.Between(-80, 80)}`,
        angle: Phaser.Math.Between(240, 600),
        duration: Phaser.Math.Between(1500, 2600),
        delay: Phaser.Math.Between(0, 500),
        ease: 'Sine.In',
        onComplete: () => confetti.destroy(),
      });
    }

    this.tweens.add({
      targets: [...this.cards.values()],
      y: '-=10',
      duration: 360,
      yoyo: true,
      repeat: 2,
      ease: 'Sine.InOut',
    });

    const panel = this.add.container(640, 410).setDepth(100).setScale(0.15).setAlpha(0);
    const shade = this.add.rectangle(0, -50, 780, 400, 0x2b1648, 0.96).setStrokeStyle(7, 0xffd34e, 1);
    const badge = this.add.graphics();
    badge.fillStyle(0xffd34e, 1);
    badge.lineStyle(7, 0xfff4c2, 1);
    badge.fillCircle(0, -92, 82);
    badge.strokeCircle(0, -92, 82);
    badge.fillStyle(0xf49ac2, 1);
    badge.fillEllipse(-27, -100, 48, 63);
    badge.fillEllipse(27, -100, 48, 63);
    badge.fillStyle(0x6d3f91, 1);
    badge.fillRoundedRect(-7, -125, 14, 68, 7);
    const badgeTitle = this.add
      .text(0, 15, 'CREATOR BADGE', {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '45px',
        fontStyle: 'bold',
        color: '#fff8dc',
        stroke: '#6d3f91',
        strokeThickness: 7,
      })
      .setOrigin(0.5);
    const message = this.add
      .text(0, 72, 'Shape, colour, decorate, attach — brilliant creating!', {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '23px',
        color: '#fff0a5',
      })
      .setOrigin(0.5);
    const continueButton = new GameButton(this, 0, 137, 'Keep my badge  ★', () => {
      this.input.enabled = false;
      this.cameras.main.fadeOut(450, 255, 211, 71);
      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
        this.scene.start('CompletionScene');
      });
    }, { width: 350, height: 70, fontSize: 27 });
    this.children.remove(continueButton);
    panel.add([shade, badge, badgeTitle, message, continueButton]);
    this.tweens.add({ targets: panel, scale: 1, alpha: 1, duration: 560, ease: 'Back.Out' });
  }
}
