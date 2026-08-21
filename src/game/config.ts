import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { ClubScene } from './scenes/ClubScene';
import { CompletionScene } from './scenes/CompletionScene';
import { CostumeGameScene } from './scenes/CostumeGameScene';
import { CarnivalScene } from './scenes/CarnivalScene';
import { PreloadScene } from './scenes/PreloadScene';
import { PanGameScene } from './scenes/PanGameScene';
import { MokoJumbieScene } from './scenes/MokoJumbieScene';
import { CarnivalCrisisScene } from './scenes/CarnivalCrisisScene';
import { StoryTimeScene } from './scenes/StoryTimeScene';
import { TitleScene } from './scenes/TitleScene';

export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;

export function buildGameConfig(parent: string): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: '#21143c',
    scene: [
      BootScene,
      PreloadScene,
      TitleScene,
      ClubScene,
      CostumeGameScene,
      CompletionScene,
      StoryTimeScene,
      CarnivalScene,
      PanGameScene,
      MokoJumbieScene,
      CarnivalCrisisScene,
    ],
    render: {
      antialias: true,
      pixelArt: false,
      roundPixels: false,
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
    },
    input: {
      activePointers: 3,
    },
  };
}
