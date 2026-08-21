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
  container.setSize(82, 82).setInteractive({ useHandCursor: true });
  container.on(Phaser.Input.Events.POINTER_OVER, () => background.setStrokeStyle(5, 0xffd34e, 1));
  container.on(Phaser.Input.Events.POINTER_OUT, () => {
    container.setScale(1);
    background.setStrokeStyle(3, 0xfff4c2, 1);
  });
  container.on(Phaser.Input.Events.POINTER_DOWN, () => container.setScale(0.94));
  container.on(Phaser.Input.Events.POINTER_UP, () => {
    container.setScale(1);
    toggle();
  });
  refresh();

  const muteKey = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.M);
  muteKey?.on(Phaser.Input.Keyboard.Events.DOWN, toggle);
  scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => muteKey?.destroy());

  return container;
}
