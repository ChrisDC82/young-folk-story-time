import Phaser from 'phaser';
import { buildGameConfig } from './config';

export function createGame(parent: string): Phaser.Game {
  return new Phaser.Game(buildGameConfig(parent));
}
