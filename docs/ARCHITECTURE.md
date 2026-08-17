# Narrative and Mini-Game Architecture

## Milestone 2 boundaries

The existing Phaser/Vite scene architecture remains the presentation layer. Narrative rules are plain TypeScript and do not import Phaser.

```text
Episode data
  characters.ts + dialogue.ts + choices.ts
                  ↓
NarrativeEngine → ChoiceSystem → GameStateManager
                  ↓
Phaser scene + reusable UI/character components
```

### Reusable types

- `src/types/characters.ts`: character IDs, expressions, texture mappings, and stage layout.
- `src/types/gameState.ts`: typed Carnival state and state-effect unions.
- `src/types/narrative.ts`: nodes, choices, conditions, actions, and story definitions.

### Reusable systems

- `GameStateManager` owns an isolated typed state object, applies `set` and numeric `add` effects, returns read-only snapshots, and resets a playthrough on request.
- `ChoiceSystem` evaluates all choice conditions, exposes only available choices, revalidates selection, and applies effects.
- `NarrativeEngine` progresses nodes, blocks progression when a choice is required, enters branch nodes, evaluates node conditions, and applies node actions once on entry.

### Episode content

`src/episodes/carnival-choices/` owns character definitions, asset paths, dialogue copy, opening choices, effects, branch reactions, and story-node connections. A future episode can provide another `StoryDefinition` and character record without replacing the reusable systems.

## State lifetime

The shared `GameStateManager` instance is reset when a new story starts from the title screen. It is not reset during Phaser scene transitions, so the Completion scene can resolve the selected branch. Tests can construct non-shared managers for complete isolation.

Milestone 2 state contains:

- Angel trust
- Junior trust
- cooperation
- shortcut used
- instructions followed
- ideas combined
- selected opening choice
- costume attempts
- costume completion

These values are internal narrative variables and are never shown numerically to children.

## Conditions and effects

Conditions support equality/inequality for every state field and numeric comparisons for numeric state. Effects support typed `set` operations for every field and `add` operations only for numeric fields. This prevents invalid state changes at compile time.

## Milestone 3 costume challenge

```text
ClubScene reaction
      ↓ (shared state is retained)
CostumeGameScene → CostumeSequenceGame → GameStateManager
      ↓                    ↓
Phaser cards/UI      typed sequence rules
      ↓
CompletionScene (Creator Badge + preserved opening branch)
```

- `src/game/minigames/costume/CostumeSequenceGame.ts` contains the reusable sequence rules and imports no Phaser code.
- `src/episodes/carnival-choices/costume.ts` owns the episode-specific four-step order, display labels, colors, and starting shuffle.
- `CostumeGameScene` translates mouse/touch pointer placement into model moves and owns only presentation behavior: large slots, illustrated cards, wobble/return tweens, subtle hint highlighting, confetti, and badge animation.
- The model changes only `costumeAttempts` and `costumeCompleted`. Costume board reset retains all game state; costume restart resets only those two fields. A new story from the title still resets the complete episode state.
- The completion scene reads the retained `openingChoice` to demonstrate scene-to-scene continuity. `usedShortcut` is intentionally preserved and has no Milestone 3 consequence.

## Deferred boundaries

The engine can represent later branches, but the project does not yet implement the delayed shortcut consequence, Story Time, Carnival exploration, the steelpan mini-game, saving, ending resolution, or later Carnival scenes. Those systems should consume the same state and narrative contracts in subsequent milestones.
