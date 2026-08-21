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

The current typed run state through Milestone 8 contains:

- Angel trust
- Junior trust
- cooperation
- shortcut used
- instructions followed
- ideas combined
- selected opening choice
- costume attempts
- costume completion
- Pan Jam rounds completed
- Pan Jam mistakes
- Pan Jam completion / Rhythm Star availability
- offer to stay with Angel
- whether Lexi asked what was wrong
- whether Lexi asked Junior for help
- whether Angel’s fear was dismissed
- Angel’s typed Moko Jumbie response outcome
- whether the Carnival Crisis has triggered
- whether Lexi’s wing fastening came loose or a nearby costume problem occurred
- whether the response blamed someone, repaired together, or asked for crisis help
- whether Angel admitted the earlier shortcut and which crisis choice was selected
- repair attempts and crisis resolution

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

## Milestone 4 Story Time and Carnival flow

```text
CompletionScene (Creator Badge)
        ↓ StoryProgression.enterStoryTime()
StoryTimeScene → episode transition dialogue/data
        ↓ StoryProgression.arriveAtCarnival()
CarnivalScene → CarnivalExperience → episode hotspot data
        ↓
Milestone 4 completion (no narrative state mutation)
```

- `StoryProgression` owns only ephemeral scene-stage guards. It resets the existing `GameStateManager` when a new full story begins but does not add scene progress to `CarnivalGameState`.
- `CarnivalExperience` validates costume completion, initializes episode-owned hotspot definitions, and tracks scene-local visits without changing narrative state.
- Story Time and Carnival dialogue plus hotspot definitions live in `src/episodes/carnival-choices/transition.ts`; Phaser scenes remain presentation/orchestration layers.
- Scene instances explicitly reset local UI/interaction fields in `create()` because Phaser may reuse an instance during repeated playthroughs.
- Both new scenes read `prefers-reduced-motion` and remove nonessential repeating/camera movement while retaining the same dialogue, highlights, state, and continuation controls.

## Milestone 5 Pan Jam

```text
CarnivalScene exploration
        ↓ episode-owned Lexi/Junior/Angel handoff
PanGameScene → SteelpanGame → RhythmSequence
      ↓               ↓
 PanZone UI      typed state effects
      ↓
SteelpanSynth (Web Audio + global mute)
      ↓
 Rhythm Star / Milestone 5 handoff
```

- `src/episodes/carnival-choices/panJam.ts` owns the character handoff, four zone identities/frequencies, tutorial patterns, and generated round plan.
- `RhythmSequence` produces deterministic episode sequences with no immediate repeated zone. `SteelpanGame` owns incremental comparison, round progression, mistakes, timing assistance, guided-note completion, strong-performance pacing, and Pan-only restart without importing Phaser.
- `PanGameScene` schedules visual/audio playback and maps mouse, touch-style pointer, and keyboard input into the model. `PanZone` provides large controls distinguished by symbol, text, number, position, outline, colour, and illumination.
- `SteelpanSynth` generates short steelpan-like tones at runtime with a brief high-frequency strike plus five inharmonic body partials, independent decay envelopes, separate strike/body filtering, and a fast master attack. It never downloads audio and checks global mute before creating or sounding Web Audio.
- `MotionPreference` centralizes the OS media preference plus a `?motion=reduce` fallback. Reduced motion changes presentation only and never alters game rules or state.
- Only `panRoundsCompleted`, `panMistakes`, and `panCompleted` change. All Milestones 1–4 state remains in the same shared `GameStateManager`; `panCompleted` is the later Story Card’s Rhythm Star signal.

## Milestone 6 Moko Jumbie emotional sequence

```text
Rhythm Star / Milestone 5 complete
        ↓ StoryProgression.enterMokoJumbie()
MokoJumbieScene → mokoJumbieStory → NarrativeEngine
        ↓                 ↓                 ↓
character behavior   conditional choices   ChoiceSystem
        ↓                                   ↓
temporary pre-crisis endpoint ← typed GameStateManager effects
```

- `src/episodes/carnival-choices/mokoJumbie.ts` owns the reveal conversation, four player-facing response labels, two conditionally exclusive versions of the same “What is making you uncomfortable?” choice, effects, and response nodes.
- The existing `NarrativeEngine` exposes exactly four available choices: trust ≥ 1 selects the more honest “They too tall.” branch; lower trust selects the guarded branch. No engine fork or scene-owned dialogue rules are needed.
- `MokoJumbieScene` owns only presentation and input orchestration: unchanged parade artwork, reveal lighting, large 2×2 choices, pointer/touch and keyboard input, expressions, Angel’s movement behind Lexi, mute access, reduced motion, and the temporary endpoint.
- `StoryProgression` guards entry on `panCompleted` and guards Milestone 6 completion on a non-null `angelMokoResponse`.
- Only the selected choice’s intended trust/cooperation effect and the five Milestone 6 fields can change. All prior branch, shortcut, costume, Creator Badge, Pan Jam, and Rhythm Star state remains in the shared manager.
- The Junior explanation is concise episode content based on National Carnival Commission and NALIS descriptions of the Moko Jumbie as a traditional masquerader balancing and dancing on tall stilts.

## Milestone 7 Carnival Crisis and repair

```text
Milestone 6 emotional endpoint (all prior state retained)
        ↓ StoryProgression.enterCarnivalCrisis()
CarnivalCrisisScene → shortcutCrisisStory / nonShortcutCrisisStory
        ↓                         ↓
four conditional choices    typed GameStateManager effects
        ↓
CarnivalCrisisRepair (Phaser-independent)
        ↓ choose fastener → three presses → crisisResolved
branch-specific exchange → temporary Milestone 8 continuation point
```

- `src/episodes/carnival-choices/crisis.ts` owns both crisis stories, the three shared choices, the shortcut-only trust-dependent Angel question, repair-material definitions, and post-repair dialogue. `usedShortcut` selects either Lexi’s loose wing fastening or the nearby masquerader’s costume problem; the careful branch never invents a failure of Lexi’s wings.
- Angel’s disclosure uses the existing typed narrative conditions. Trust of at least one permits the direct admission only when her earlier fear was not dismissed; low trust or a prior dismissal selects a hesitant response that still proceeds to repair.
- `src/game/minigames/crisis/CarnivalCrisisRepair.ts` imports no Phaser code. It validates crisis entry, counts material selections, activates assistance after two unsuccessful attempts, requires the safety clip, tracks three securing presses, sets only `crisisResolved` on completion, and supports local reset/restart without clearing branch or earlier-story state.
- `CarnivalCrisisScene` is the presentation/orchestration layer. It reuses existing artwork and character-expression mappings, draws the branch problem and repair interface in Phaser, maps pointer/touch and keyboard input to the model, and provides gentle wobble/hint feedback, mute, reduced motion, readable dialogue, responsive positioning, and non-audio completion cues.
- `StoryProgression` guards crisis entry after Milestone 6 and guards the temporary `milestone-7-complete` endpoint until a crisis choice exists and the repair is resolved. It does not implement an ending or Angel’s final decision.
- New typed state is limited to `crisisTriggered`, `wingStrapBroke`, `nearbyCostumeProblem`, `blamedSomeone`, `repairedMistakeTogether`, `askedForCrisisHelp`, `angelAdmittedShortcut`, `crisisChoice`, `crisisResolved`, and `repairAttempts`. The shared manager retains every valid opening, costume, badge, Pan Jam, and Moko Jumbie value across the scene.
- No new dependency, API, service, audio file, commercial asset, runtime image, or asset derivative was required.

## Milestone 8 endings, Story Card, and replay

```text
Milestone 7 crisis resolved
        ↓ StoryProgression.enterEnding()
EndingResolver (read-only state snapshot)
        ↓ deterministic EndingId
episode endings.ts → EndingScene dialogue
        ↓
StoryCardBuilder → reflection + existing badges + ending badge
        ↓
StoryProgression.completeMilestone8()
        ↓ Play Again
StoryProgression.startNewStory() → reset run state → ClubScene
                     AudioManager mute remains unchanged
```

- `src/game/systems/EndingResolver.ts` imports no Phaser code and applies the documented priority: CC Club Team for cooperation of at least two plus a shared repair; Together on the Road for Angel trust of at least two plus a supportive Moko response; We Fixed It for the shortcut plus Angel’s admission; otherwise One Little Step.
- `src/episodes/carnival-choices/endings.ts` owns the exact ending names, concise character dialogue, positive reflections, and ending-badge metadata. All four definitions reuse existing character IDs and expression mappings.
- `src/game/systems/StoryCardBuilder.ts` imports no Phaser code. It derives up to four accomplishments from the immutable run snapshot, includes Creator Badge only from `costumeCompleted`, includes Rhythm Star only from `panCompleted`, and appends the resolved ending badge.
- `src/types/endings.ts` contains typed ending IDs, badge IDs, ending definitions, achievements, and Story Card output. No ending ID or badge is copied into mutable `CarnivalGameState`; resolution and card generation remain deterministic read-only derivations.
- `EndingScene` owns presentation and input orchestration: existing Carnival/character art, ending dialogue, code-drawn Story Card/badges/sparkles, large buttons, pointer/touch, keyboard replay, Title, mute, reduced motion, and responsive desktop/landscape-phone rendering.
- `StoryProgression` guards entry after `milestone-7-complete`, marks the Story Card as `milestone-8-complete`, and reuses `startNewStory()` for replay. That method resets `GameStateManager` and the scene stage but does not reset the separate application-level `AudioManager` mute preference.
- No new dependency, API, service, audio file, commercial asset, runtime image, or asset derivative was required.

## Deferred boundaries

The playable narrative arc is complete through the four endings and Story Card. Deferred work is limited to Milestone 9 visual/audio polish, later release-candidate and hackathon-submission preparation, AI reflection, saving, backend services, authentication, database storage, analytics, deployment, and other explicitly later scope. Later work should preserve the completed resolver, Story Card, replay, and Milestones 1–8 state contracts.
