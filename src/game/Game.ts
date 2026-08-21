import Phaser from 'phaser';
import { buildGameConfig } from './config';
import { configureCanvasAccessibility } from './systems/CanvasAccessibility';

export function createGame(parent: string): Phaser.Game {
  const game = new Phaser.Game(buildGameConfig(parent));
  configureCanvasAccessibility(game.canvas);
  return game;
}
