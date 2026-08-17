import type { CarnivalGameState } from '../../types/gameState';
import type { StoryChoice, StoryCondition } from '../../types/narrative';
import { GameStateManager } from './GameStateManager';

export class ChoiceSystem {
  static conditionsPass(conditions: readonly StoryCondition[] = [], state: Readonly<CarnivalGameState>): boolean {
    return conditions.every((condition) => ChoiceSystem.conditionPasses(condition, state));
  }

  static availableChoices(choices: readonly StoryChoice[], state: Readonly<CarnivalGameState>): StoryChoice[] {
    return choices.filter((choice) => ChoiceSystem.conditionsPass(choice.conditions, state));
  }

  static select(
    choiceId: string,
    choices: readonly StoryChoice[],
    stateManager: GameStateManager,
  ): StoryChoice {
    const available = ChoiceSystem.availableChoices(choices, stateManager.snapshot);
    const selected = available.find((choice) => choice.id === choiceId);
    if (!selected) {
      throw new Error(`Choice "${choiceId}" is missing or unavailable.`);
    }

    stateManager.applyEffects(selected.effects);
    return selected;
  }

  private static conditionPasses(condition: StoryCondition, state: Readonly<CarnivalGameState>): boolean {
    const current = state[condition.key];
    switch (condition.operator) {
      case 'equals':
        return current === condition.value;
      case 'not-equals':
        return current !== condition.value;
      case 'greater-than':
        return typeof current === 'number' && current > condition.value;
      case 'greater-than-or-equal':
        return typeof current === 'number' && current >= condition.value;
      case 'less-than':
        return typeof current === 'number' && current < condition.value;
      case 'less-than-or-equal':
        return typeof current === 'number' && current <= condition.value;
    }
  }
}
