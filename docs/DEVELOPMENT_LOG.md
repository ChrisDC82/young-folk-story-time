# Development Log

## 2026-08-17 — Milestone 1: Playable Skeleton

### Scope completed

- Boot and preload scene architecture with a visible loading indicator.
- Responsive 1280×720 Phaser canvas using 16:9 fit scaling, centered layout, touch support, and a portrait-orientation message.
- Title screen for **Young Folk: Story Time — Carnival Choices** with pointer and keyboard start controls.
- CC Club scene using the supplied club interior and a runtime-only Lexi front-pose derivative.
- Light Lexi entrance and idle motion without skeletal animation or character redesign.
- Reusable steelpan hotspot with visible pulse/activation feedback and pointer or `H` activation.
- Reusable dialogue box supporting speaker, short text, and continue interaction.
- Three-option choice display with pointer and number-key selection, selected-option feedback, and explicit continue control.
- Fade transition into a temporary completion scene.
- Reusable audio manager with music, ambience, dialogue, and sound-effect channels plus a global pointer/`M` mute control. No audio content was added.
- Large child-friendly controls and readable text with visible hover/selection feedback.

### Major files created

- Phaser/Vite bootstrap: `package.json`, `index.html`, `vite.config.ts`, `tsconfig.json`, `src/main.ts`, `src/style.css`.
- Reusable game foundation: `src/game/Game.ts`, `src/game/config.ts`, five Milestone 1 scenes, four reusable interface components, and `AudioManager`.
- Episode-specific content: `src/episodes/carnival-choices/episode.ts`.
- Shared types: `src/types/dialogue.ts`.
- Runtime asset preparation: `scripts/prepare-assets.py` and files under `public/assets/`.
- Documentation: `README.md`, `docs/ASSET_MANIFEST.md`, `docs/DEVELOPMENT_LOG.md`, and `docs/HACKATHON_NOTES.md`.

### Assets used

- `Community Cultural Club Background.png`: copied unchanged into the runtime asset tree.
- `Lexi Character Sheet.png`: used to produce a non-destructive front-pose derivative with transparent background.

### Technical decisions

- Reusable systems and components live under `src/game/`; Carnival Choices copy and asset references live under `src/episodes/carnival-choices/`.
- Only the two assets needed for this milestone are preloaded.
- The CC Club source image almost exactly matches 16:9, so it fills the game canvas without distortion.
- The steelpan already visible in the CC Club illustration was chosen as the hotspot; no extra object artwork was invented.
- No permanent narrative state, consequence engine, trust system, mini-game, or audio files were added.

### Unresolved issues and later asset work

- The current Lexi sprite is a safe static derivative. Other poses and the remaining character sheets still need careful manual/reviewed extraction before animation work.
- The Phaser production bundle is larger than Vite's default warning threshold because Phaser is the main runtime. This is acceptable for the skeleton; future episodes should consider scene-level asset loading and measured code-splitting only if it improves real device startup time.
- Audio channels are established, but licensed/original music, ambience, dialogue, and effects are intentionally absent.
- Portrait mode currently shows a rotate-device message rather than a portrait layout.
