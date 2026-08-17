import type { StoryChoice, StoryDefinition, StoryNode } from '../../types/narrative';
import { ChoiceSystem } from './ChoiceSystem';
import { GameStateManager } from './GameStateManager';

export class NarrativeEngine {
  private currentNodeId: string;

  constructor(
    private readonly story: StoryDefinition,
    private readonly stateManager: GameStateManager,
  ) {
    this.currentNodeId = story.startNodeId;
    this.enterNode(story.startNodeId);
  }

  get currentNode(): StoryNode {
    const node = this.story.nodes[this.currentNodeId];
    if (!node) throw new Error(`Story node "${this.currentNodeId}" does not exist.`);
    return node;
  }

  get availableChoices(): StoryChoice[] {
    return ChoiceSystem.availableChoices(this.currentNode.choices ?? [], this.stateManager.snapshot);
  }

  advance(): StoryNode {
    const node = this.currentNode;
    if (node.choices?.length) {
      throw new Error(`Story node "${node.id}" requires a choice before it can advance.`);
    }
    if (!node.next) {
      throw new Error(`Story node "${node.id}" has no next node.`);
    }
    return this.enterNode(node.next);
  }

  choose(choiceId: string): StoryChoice {
    const choices = this.currentNode.choices;
    if (!choices?.length) {
      throw new Error(`Story node "${this.currentNode.id}" has no choices.`);
    }

    const selected = ChoiceSystem.select(choiceId, choices, this.stateManager);
    this.enterNode(selected.next);
    return selected;
  }

  private enterNode(nodeId: string): StoryNode {
    const node = this.story.nodes[nodeId];
    if (!node) throw new Error(`Story node "${nodeId}" does not exist.`);
    if (!ChoiceSystem.conditionsPass(node.conditions, this.stateManager.snapshot)) {
      throw new Error(`Story node "${nodeId}" is not available for the current state.`);
    }

    this.currentNodeId = nodeId;
    this.stateManager.applyEffects(node.actions);
    return node;
  }
}
