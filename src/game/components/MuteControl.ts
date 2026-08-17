import Phaser from 'phaser';
import { AudioManager } from '../systems/AudioManager';

export function addMuteControl(scene: Phaser.Scene): Phaser.GameObjects.Container {
  const container = scene.add.container(1212, 54).setDepth(100);
  const background = scene.add.circle(0, 0, 34, 0x251339, 0.88).setStrokeStyle(3, 0xfff4c2, 1);
  const label = scene.add
    .text(0, 0, '', {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '24px',
      fontStyle: 'bold',
      color: '#fff8dc',
    })
    .setOrigin(0.5);

  const refresh = () => label.setText(AudioManager.shared.isMuted() ? '🔇' : '🔊');
  const toggle = () => {
    AudioManager.shared.toggle(scene);
    refresh();
  };

  container.add([background, label]);
  container.setSize(68, 68).setInteractive({ useHandCursor: true });
  container.on(Phaser.Input.Events.POINTER_UP, toggle);
  refresh();

  const muteKey = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.M);
  muteKey?.on(Phaser.Input.Keyboard.Events.DOWN, toggle);
  scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => muteKey?.destroy());

  return container;
}
