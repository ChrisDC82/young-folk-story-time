import {
  INITIAL_CARNIVAL_GAME_STATE,
  type CarnivalGameState,
  type CarnivalStateKey,
  type StateEffect,
} from '../../types/gameState';

export class GameStateManager {
  private static instance?: GameStateManager;
  private state: CarnivalGameState;

  constructor(initialState: CarnivalGameState = { ...INITIAL_CARNIVAL_GAME_STATE }) {
    this.state = { ...initialState };
  }

  static get shared(): GameStateManager {
    GameStateManager.instance ??= new GameStateManager();
    return GameStateManager.instance;
  }

  get snapshot(): Readonly<CarnivalGameState> {
    return Object.freeze({ ...this.state });
  }

  get<Key extends CarnivalStateKey>(key: Key): CarnivalGameState[Key] {
    return this.state[key];
  }

  reset(initialState: CarnivalGameState = { ...INITIAL_CARNIVAL_GAME_STATE }): void {
    this.state = { ...initialState };
  }

  applyEffects(effects: readonly StateEffect[] = []): Readonly<CarnivalGameState> {
    effects.forEach((effect) => this.applyEffect(effect));
    return this.snapshot;
  }

  private applyEffect(effect: StateEffect): void {
    if (effect.operation === 'add') {
      this.state[effect.key] += effect.value;
      return;
    }

    this.state = {
      ...this.state,
      [effect.key]: effect.value,
    };
  }
}
