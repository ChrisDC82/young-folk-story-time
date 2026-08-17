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
    description: string | undefined,
    onSelect: (choiceId: string) => void,
  ) {
    const buttonText = description ? `${index}.  ${label}\n${description}` : `${index}.  ${label}`;
    super(scene, x, y, buttonText, () => onSelect(choiceId), {
      width: 720,
      height: 90,
      fontSize: 24,
      fillColor: 0xfff5c4,
      hoverColor: 0xffe08a,
      textColor: '#2b1648',
    });
    this.choiceId = choiceId;
  }
}
