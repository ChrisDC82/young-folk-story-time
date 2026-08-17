import Phaser from 'phaser';

export type AudioChannel = 'music' | 'ambience' | 'dialogue' | 'sfx';

export class AudioManager {
  private static instance?: AudioManager;
  private muted = false;
  private readonly channelVolumes: Record<AudioChannel, number> = {
    music: 0.55,
    ambience: 0.5,
    dialogue: 1,
    sfx: 0.8,
  };
  private readonly activeSounds = new Map<AudioChannel, Set<Phaser.Sound.BaseSound>>();

  static get shared(): AudioManager {
    AudioManager.instance ??= new AudioManager();
    return AudioManager.instance;
  }

  isMuted(): boolean {
    return this.muted;
  }

  toggle(scene: Phaser.Scene): boolean {
    return this.setMuted(scene, !this.muted);
  }

  setMuted(scene: Phaser.Scene, muted: boolean): boolean {
    this.muted = muted;
    scene.sound.mute = muted;
    return this.muted;
  }

  bind(scene: Phaser.Scene): void {
    scene.sound.mute = this.muted;
  }

  play(scene: Phaser.Scene, key: string, channel: AudioChannel, loop = false): Phaser.Sound.BaseSound | undefined {
    if (!scene.cache.audio.exists(key)) return undefined;
    const sound = scene.sound.add(key, { volume: this.channelVolumes[channel], loop });
    const channelSounds = this.activeSounds.get(channel) ?? new Set<Phaser.Sound.BaseSound>();
    channelSounds.add(sound);
    this.activeSounds.set(channel, channelSounds);
    sound.once(Phaser.Sound.Events.DESTROY, () => channelSounds.delete(sound));
    sound.play();
    return sound;
  }

  stopChannel(channel: AudioChannel): void {
    this.activeSounds.get(channel)?.forEach((sound) => sound.stop());
  }
}
