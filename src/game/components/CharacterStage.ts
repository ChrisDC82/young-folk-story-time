import Phaser from 'phaser';
import type { CharacterDefinition, CharacterExpression, CharacterId } from '../../types/characters';

interface CharacterActor {
  definition: CharacterDefinition;
  container: Phaser.GameObjects.Container;
  glow: Phaser.GameObjects.Ellipse;
  sprite: Phaser.GameObjects.Image;
  label: Phaser.GameObjects.Text;
}

type CharacterStageOverrides = Partial<Record<CharacterId, Partial<CharacterDefinition['stage']>>>;

export class CharacterStage {
  private readonly actors = new Map<CharacterId, CharacterActor>();

  constructor(
    private readonly scene: Phaser.Scene,
    definitions: Record<CharacterId, CharacterDefinition>,
    stageOverrides: CharacterStageOverrides = {},
  ) {
    Object.values(definitions).forEach((definition) => {
      this.createActor({
        ...definition,
        stage: { ...definition.stage, ...stageOverrides[definition.id] },
      });
    });
  }

  showLead(characterId: CharacterId): void {
    this.actors.forEach((actor, id) => {
      actor.container.setVisible(id === characterId).setAlpha(id === characterId ? 1 : 0);
    });
  }

  revealAll(reducedMotion = false): void {
    this.actors.forEach((actor, id) => {
      if (reducedMotion) {
        actor.container.setVisible(true).setAlpha(1).setX(actor.definition.stage.x);
        return;
      }
      const delay = id === 'lexi' ? 0 : id === 'angel' ? 100 : 200;
      actor.container.setVisible(true).setAlpha(id === 'lexi' ? 1 : 0).setX(actor.definition.stage.x + 55);
      this.scene.tweens.add({
        targets: actor.container,
        x: actor.definition.stage.x,
        alpha: 1,
        duration: 430,
        delay,
        ease: 'Back.Out',
      });
    });
  }

  focus(characterId: CharacterId, expression: CharacterExpression = 'neutral', reducedMotion = false): void {
    this.actors.forEach((actor, id) => {
      const focused = id === characterId;
      actor.container.setAlpha(focused ? 1 : 0.7);
      actor.glow.setVisible(focused);
      actor.label.setBackgroundColor(focused ? `#${actor.definition.accentColor.toString(16).padStart(6, '0')}ee` : '#2b1648cc');
      if (focused) {
        this.setExpression(id, expression);
        this.scene.tweens.killTweensOf(actor.container);
        actor.container.setY(actor.definition.stage.y);
        if (reducedMotion) return;
        this.scene.tweens.add({
          targets: actor.container,
          y: actor.definition.stage.y - 12,
          duration: 180,
          yoyo: true,
          ease: 'Sine.Out',
        });
      }
    });
  }

  setExpression(characterId: CharacterId, expression: CharacterExpression): void {
    const actor = this.actors.get(characterId);
    if (!actor) return;
    const texture = actor.definition.textures[expression] ?? actor.definition.textures.neutral;
    actor.sprite.setTexture(texture).setDisplaySize(actor.definition.stage.width, actor.definition.stage.height);
  }

  setDepth(characterId: CharacterId, depth: number): void {
    this.actors.get(characterId)?.container.setDepth(depth);
  }

  moveTo(characterId: CharacterId, x: number, y: number, reducedMotion = false): void {
    const actor = this.actors.get(characterId);
    if (!actor) return;
    this.scene.tweens.killTweensOf(actor.container);
    if (reducedMotion) {
      actor.container.setPosition(x, y);
      return;
    }
    this.scene.tweens.add({
      targets: actor.container,
      x,
      y,
      duration: 460,
      ease: 'Sine.InOut',
    });
  }

  startIdleMotion(reducedMotion = false): void {
    if (reducedMotion) return;
    this.actors.forEach((actor, id) => {
      this.scene.tweens.add({
        targets: actor.container,
        y: actor.definition.stage.y - (id === 'angel' ? 7 : 5),
        duration: id === 'junior' ? 1700 : 1450,
        delay: id === 'lexi' ? 0 : id === 'angel' ? 180 : 340,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.InOut',
      });
    });
  }

  private createActor(definition: CharacterDefinition): void {
    const container = this.scene.add.container(definition.stage.x, definition.stage.y).setDepth(10);
    const glow = this.scene.add
      .ellipse(0, -definition.stage.height * 0.48, definition.stage.width * 1.12, definition.stage.height * 0.92, definition.accentColor, 0.2)
      .setStrokeStyle(5, 0xfff4c2, 0.8)
      .setVisible(false);
    const sprite = this.scene.add
      .image(0, 0, definition.textures.neutral)
      .setOrigin(0.5, 1)
      .setDisplaySize(definition.stage.width, definition.stage.height);
    const label = this.scene.add
      .text(0, 9, definition.displayName, {
        fontFamily: 'Trebuchet MS, Arial Rounded MT Bold, sans-serif',
        fontSize: '20px',
        fontStyle: 'bold',
        color: '#fffbe0',
        backgroundColor: '#2b1648cc',
        padding: { x: 12, y: 6 },
      })
      .setOrigin(0.5, 0);

    container.add([glow, sprite, label]);
    this.actors.set(definition.id, { definition, container, glow, sprite, label });
  }
}
