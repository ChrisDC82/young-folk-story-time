# Milestone 2 Asset Report

Prepared on 2026-08-17. This report supplements `docs/ASSET_MANIFEST.md`.

## Source protection

No file in `assets-original/` was modified, renamed, resized, overwritten, converted, or deleted. Runtime derivatives were created under `public/assets/characters/` by `scripts/prepare-assets.py`.

The deterministic process crops only the required pose area on a derivative image, removes near-white pixels connected to the crop boundary, preserves enclosed white details such as eyes, and saves an RGBA PNG without resampling or redesigning the character.

## Runtime derivatives used in Milestone 2

| Original source | Runtime derivative | Dimensions | Narrative use |
|---|---|---:|---|
| `Lexi Character Sheet.png` | `lexi/lexi-front.png` | 344×458 | Neutral Lexi presentation. |
| `Lexi Character Sheet.png` | `lexi/lexi-happy.png` | 315×431 | Opening-decision expression. |
| `Lexi Character Sheet.png` | `lexi/lexi-excited.png` | 320×433 | Opening and teamwork reaction. |
| `Angel Character Sheet.png` | `angel/angel-front.png` | 361×412 | Neutral Angel presentation. |
| `Angel Character Sheet.png` | `angel/angel-happy.png` | 341×371 | Prepared for episode dialogue reuse. |
| `Angel Character Sheet.png` | `angel/angel-thinking.png` | 249×366 | Angel’s reply during the opening conversation. |
| `Angel Character Sheet.png` | `angel/angel-excited.png` | 340×370 | Shortcut proposal and branch reaction. |
| `Junior Character Sheet.png` | `junior/junior-front.png` | 270×440 | Neutral Junior presentation. |
| `Junior Character Sheet.png` | `junior/junior-happy.png` | 264×434 | Follow-Junior branch reaction. |
| `Junior Character Sheet.png` | `junior/junior-thinking.png` | 260×432 | Instruction and shortcut-warning dialogue. |
| `Junior Character Sheet.png` | `junior/junior-surprised.png` | 266×432 | Prepared for episode dialogue reuse. |

## Technical notes

- Angel’s bottom-row expression artwork is drawn as upper-body presentation rather than a full standing pose. The game preserves that supplied composition and normalizes only its display bounds in Phaser.
- Character sheets still contain other unused poses. They should be extracted only when a later milestone needs them.
- The current sprites use static expression swaps plus gentle movement; skeletal animation and automatic rigging remain intentionally deferred.
- No external asset service, paid tool, generated replacement, or downloaded character art was used.
