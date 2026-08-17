# Narrative Architecture

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

These values are internal narrative variables and are never shown numerically to children.

## Conditions and effects

Conditions support equality/inequality for every state field and numeric comparisons for numeric state. Effects support typed `set` operations for every field and `add` operations only for numeric fields. This prevents invalid state changes at compile time.

## Deferred boundaries

The engine can represent later branches, but Milestone 2 does not implement delayed consequences, mini-games, saving, ending resolution, or the later Carnival story. Those systems should consume the same state and narrative contracts in subsequent milestones.
