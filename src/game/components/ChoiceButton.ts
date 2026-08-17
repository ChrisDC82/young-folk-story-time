import Phaser from 'phaser';
import { GameButton } from './GameButton';

export class ChoiceButton extends GameButton {
  readonly choiceId: string;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    choiceId: string,
    index: number,
    label: string,
    onSelect: (choiceId: string) => void,
  ) {
    super(scene, x, y, `${index}.  ${label}`, () => onSelect(choiceId), {
      width: 720,
      height: 76,
      fontSize: 28,
      fillColor: 0xfff5c4,
      hoverColor: 0xffe08a,
      textColor: '#2b1648',
    });
    this.choiceId = choiceId;
  }
}
