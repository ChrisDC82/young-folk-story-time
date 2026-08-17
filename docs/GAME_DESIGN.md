Young Folk: Story Time

Episode 1 — Carnival Choices

Codex Production Specification v1.0

1\. Product Goal

Build a polished, browser-based 2D interactive children's game called:

Young Folk: Story Time — Carnival Choices

The game should feel like an interactive animated episode rather than a conventional website.

Target experience:

\- ages approximately 4–8 for the interactive game MVP  
\- 10–15 minute playthrough  
\- desktop, tablet and mobile browser support  
\- Caribbean cultural identity throughout  
\- branching narrative  
\- choices with delayed consequences  
\- visual interaction rather than text-heavy gameplay  
\- two principal mini-games  
\- several story outcomes  
\- no paywall  
\- no paid service required to play  
\- no account required  
\- no collection of children's personal information

The game must be designed as the first episode of a reusable Young Folk: Story Time game engine.

\---

2\. Technical Stack

Core

Use:

\- Phaser  
\- TypeScript  
\- Vite  
\- HTML/CSS for outer-shell accessibility/UI where useful  
\- Web Audio API / Phaser audio system  
\- local browser storage only if saving is implemented

Avoid unnecessary dependencies.

Do not use:

\- Unity  
\- Unreal Engine  
\- paid backend services  
\- authentication  
\- external databases  
\- paid analytics  
\- SMS  
\- advertising  
\- unnecessary trackers

The core game must run entirely client-side.

\---

3\. Architecture Principle

Separate game engine from episode content.

Do not hard-code the entire story inside individual Phaser scenes.

The architecture should allow future Young Folk episodes to replace:

\- dialogue  
\- backgrounds  
\- characters  
\- choices  
\- consequences  
\- mini-games  
\- sound  
\- endings

without rebuilding the fundamental narrative engine.

\---

4\. Repository Structure

Recommended structure:

young-folk-story-time/  
│  
├── public/  
│   ├── assets/  
│   │   ├── characters/  
│   │   │   ├── lexi/  
│   │   │   ├── angel/  
│   │   │   └── junior/  
│   │   │  
│   │   ├── backgrounds/  
│   │   │   ├── cc-club/  
│   │   │   └── carnival/  
│   │   │  
│   │   ├── objects/  
│   │   │   ├── steelpan/  
│   │   │   ├── costumes/  
│   │   │   ├── magical-pot/  
│   │   │   └── ui/  
│   │   │  
│   │   ├── audio/  
│   │   │   ├── music/  
│   │   │   ├── steelpan/  
│   │   │   ├── ambience/  
│   │   │   ├── sfx/  
│   │   │   └── voices/  
│   │   │  
│   │   └── video/  
│   │  
│   └── favicon/  
│  
├── src/  
│   ├── game/  
│   │   ├── Game.ts  
│   │   ├── config.ts  
│   │   │  
│   │   ├── scenes/  
│   │   │   ├── BootScene.ts  
│   │   │   ├── PreloadScene.ts  
│   │   │   ├── MainMenuScene.ts  
│   │   │   ├── ClubScene.ts  
│   │   │   ├── CostumeGameScene.ts  
│   │   │   ├── StoryTimeScene.ts  
│   │   │   ├── CarnivalScene.ts  
│   │   │   ├── PanGameScene.ts  
│   │   │   ├── MokoJumbieScene.ts  
│   │   │   ├── CarnivalCrisisScene.ts  
│   │   │   ├── EndingScene.ts  
│   │   │   └── StoryCardScene.ts  
│   │   │  
│   │   ├── systems/  
│   │   │   ├── NarrativeEngine.ts  
│   │   │   ├── ChoiceSystem.ts  
│   │   │   ├── GameStateManager.ts  
│   │   │   ├── DialogueSystem.ts  
│   │   │   ├── CharacterController.ts  
│   │   │   ├── AudioManager.ts  
│   │   │   ├── AccessibilityManager.ts  
│   │   │   └── SaveManager.ts  
│   │   │  
│   │   ├── components/  
│   │   │   ├── DialogueBox.ts  
│   │   │   ├── ChoiceButton.ts  
│   │   │   ├── CharacterPortrait.ts  
│   │   │   ├── InteractiveHotspot.ts  
│   │   │   ├── BadgePopup.ts  
│   │   │   └── Transition.ts  
│   │   │  
│   │   └── minigames/  
│   │       ├── costume/  
│   │       │   ├── CostumeGame.ts  
│   │       │   └── CostumeData.ts  
│   │       │  
│   │       └── steelpan/  
│   │           ├── SteelpanGame.ts  
│   │           ├── RhythmSequence.ts  
│   │           └── DifficultyManager.ts  
│   │  
│   ├── episodes/  
│   │   └── carnival-choices/  
│   │       ├── episode.ts  
│   │       ├── dialogue.ts  
│   │       ├── choices.ts  
│   │       ├── endings.ts  
│   │       └── badges.ts  
│   │  
│   ├── types/  
│   │   ├── narrative.ts  
│   │   ├── characters.ts  
│   │   ├── gameState.ts  
│   │   └── minigames.ts  
│   │  
│   ├── ui/  
│   └── main.ts  
│  
├── tests/  
│   ├── narrative/  
│   ├── state/  
│   └── minigames/  
│  
├── docs/  
│   ├── GAME\_DESIGN.md  
│   ├── ASSET\_MANIFEST.md  
│   ├── STORY\_FLOW.md  
│   └── HACKATHON\_NOTES.md  
│  
├── index.html  
├── package.json  
├── tsconfig.json  
├── vite.config.ts  
└── README.md

\---

5\. Existing Asset Manifest

Preserve original files untouched in an "/originals" working directory outside the final optimized build if necessary.

Initial source material includes:

Character References

Lexi

Existing character sheet includes:

\- front  
\- side  
\- back  
\- 3/4  
\- happy  
\- thinking  
\- surprised  
\- excited

Canonical design should come from the supplied Lexi character sheet.

Angel

Existing sheet includes:

\- front  
\- side  
\- back  
\- 3/4  
\- happy  
\- thinking  
\- surprised  
\- excited

Angel has multiple arms. Preserve this accurately.

Junior

Existing sheet includes:

\- front  
\- side  
\- back  
\- 3/4  
\- happy  
\- thinking  
\- surprised  
\- excited

Preserve his faun/scout appearance.

\---

6\. Existing Environment/Cinematic Assets

Available imagery includes:

\- Community and Cultural Club interior  
\- CC Club with Lexi  
\- Lexi making Carnival wings  
\- Junior making Carnival mask  
\- steelpan scenes  
\- Kiddies Carnival streets  
\- parade scenes  
\- Moko Jumbies  
\- Lexi, Junior and Angel celebrating  
\- empty Carnival environment suitable for gameplay  
\- existing unfinished animated Young Folk Episode 1

Use these as the visual foundation.

Do not regenerate replacements unless absolutely necessary.

\---

7\. Asset Processing

Character sheets may need to be converted into individual sprites.

Create a preprocessing utility where appropriate.

For each character create files similar to:

lexi-front.png  
lexi-three-quarter.png  
lexi-happy.png  
lexi-thinking.png  
lexi-surprised.png  
lexi-excited.png

Equivalent sprites should exist for Angel and Junior.

Where transparent backgrounds cannot be extracted reliably automatically, flag the asset for manual preparation rather than damaging the original artwork.

Optimize web copies while retaining high-quality originals.

\---

8\. Visual Presentation

The game should resemble an animated children's programme.

Avoid:

\- conventional website cards  
\- dashboard layouts  
\- excessive text  
\- generic Bootstrap-like UI  
\- tiny buttons  
\- visual-novel walls of dialogue

Instead use:

\- full-screen illustrated environments  
\- character sprites  
\- large expressive portraits  
\- oversized rounded choice buttons  
\- animated icons  
\- environmental hotspots  
\- gentle camera movement  
\- parallax where useful  
\- particles  
\- confetti  
\- sparkles  
\- character bounce  
\- blinking  
\- expression swaps  
\- object movement  
\- music-reactive effects where possible

Animation should be economical but convincing.

\---

9\. Responsive Design

Primary aspect ratio:

16:9 landscape

Support:

\- desktop  
\- laptop  
\- landscape tablet  
\- landscape phone

Portrait devices may display:

“Turn your device sideways to play.”

Do not distort artwork.

Use responsive scaling and safe zones.

\---

10\. Game State

Create a typed state object.

Example:

interface CarnivalGameState {  
  angelTrust: number;  
  juniorTrust: number;  
  cooperation: number;

  usedShortcut: boolean;  
  followedInstructions: boolean;

  listenedToAngel: boolean;  
  askedAngelWhatWasWrong: boolean;  
  offeredToStayWithAngel: boolean;

  askedForHelp: boolean;  
  blamedSomeone: boolean;  
  repairedMistakeTogether: boolean;

  costumeAttempts: number;  
  costumeCompleted: boolean;

  panRoundsCompleted: number;  
  panMistakes: number;

  badges: BadgeId\[\];

  endingType?: EndingType;  
}

Do not expose these numbers to young players.

They are narrative variables only.

\---

11\. Narrative Engine

The narrative system should support:

interface StoryNode {  
  id: string;  
  speaker?: CharacterId;  
  text?: string;

  expression?: CharacterExpression;

  conditions?: StoryCondition\[\];

  choices?: StoryChoice\[\];

  next?: string;

  actions?: StoryAction\[\];  
}

Choices should support state changes:

interface StoryChoice {  
  id: string;  
  label: string;  
  next: string;  
  effects?: StateEffect\[\];  
  conditions?: StoryCondition\[\];  
}

Example:

{  
  id: "stay-with-angel",  
  label: "Want me to stay with you?",  
  next: "angel-softens",  
  effects: \[  
    { key: "angelTrust", operation: "add", value: 1 },  
    { key: "offeredToStayWithAngel", operation: "set", value: true }  
  \]  
}

\---

12\. Scene 1 — CC Club

Use the supplied CC Club environment.

The player should be able to explore visually without moving Lexi around with a joystick.

Create interactive hotspots.

Required hotspots:

Caribbean Map

Tap:

\- subtle zoom  
\- Trinidad & Tobago highlighted  
\- Lexi reacts

Steelpan

Tap:

\- pan animates slightly  
\- a real note plays  
\- Lexi responds

Bookshelf

Tap:

\- Anansi/Caribbean story material highlighted  
\- Angel-related visual cue may appear

Craft Table

Tap:

\- preview of costume-making

Magical Pot

Initially:

\- subtle sparkle  
\- unavailable

Later:

\- activates Story Time transition

\---

13\. Dialogue Presentation

Dialogue should appear in a large child-friendly box.

Include:

\- speaker name  
\- character portrait  
\- spoken line  
\- optional voice playback button if voice assets eventually exist  
\- tap/click to advance

Do not show more than approximately two short sentences at once.

Where practical, emphasize important words visually.

\---

14\. Choice Presentation

Choices should normally contain 2–4 options.

Each option should:

\- be large  
\- contain very little text  
\- optionally have an icon  
\- work by mouse and touch  
\- support keyboard focus

Avoid framing choices as:

GOOD / BAD

or

RIGHT / WRONG.

Consequences should teach instead.

\---

15\. Opening Story

Lexi and Junior are preparing for Kiddies Carnival.

Angel enters and believes they are moving too slowly.

Angel:

«“We taking too long\! I know a shortcut.”»

Junior:

«“A shortcut is often simply a longer route whose problems have not yet introduced themselves.”»

Angel:

«“Junior. Normal people does just say no.”»

Then display:

FOLLOW JUNIOR

“Let's follow the instructions.”

FOLLOW ANGEL

“Let's try Angel's shortcut\!”

WORK TOGETHER

“What if we check the instructions and use Angel's idea?”

Record the outcome.

\---

16\. Costume Mini-Game

Purpose

Teach:

\- sequencing  
\- observation  
\- persistence

without looking like a test.

Visual

Use Lexi's Carnival butterfly wings.

Four illustrated preparation stages:

1\. Shape  
2\. Colour  
3\. Decorate  
4\. Attach

The child drags them into order.

Touch interaction is mandatory.

\---

17\. Costume Failure Behaviour

Incorrect order:

\- no buzzer  
\- no red X  
\- no “WRONG”

Instead:

\- pieces wobble  
\- Angel or Junior reacts  
\- misplaced item returns gently

After repeated difficulty:

\- provide subtle visual hint  
\- highlight the next likely item

Success:

\- wings sparkle  
\- celebratory SFX  
\- Creator Badge appears

\---

18\. Shortcut Consequence

If the player chose Angel's shortcut:

Angel skips an attachment/fastening step.

Do not reveal the consequence immediately.

Record:

usedShortcut \= true

Later, during Carnival, the wing strap comes loose.

This demonstrates delayed consequences.

\---

19\. Story Time Transition

Return to the CC Club.

The pot glows.

Lexi says:

“Story time is here\!”

Transition sequence:

1\. room darkens slightly  
2\. magical pot glows  
3\. particles rise  
4\. Caribbean map brightens  
5\. Trinidad & Tobago becomes highlighted  
6\. camera pushes toward map/pot  
7\. transition into Carnival

The effect should feel magical even if technically simple.

\---

20\. Carnival Exploration Scene

Use the supplied Carnival street/environment artwork.

Animate:

\- confetti  
\- flags  
\- palm leaves  
\- balloons where available  
\- musical notes  
\- subtle crowd ambience

Allow several optional hotspots before advancing.

Possible hotspots:

\- steelpan  
\- costumes  
\- Moko Jumbie poster/figure  
\- Carnival banner

\---

21\. Steelpan Mini-Game

Working title:

PAN JAM

This is a central visual showcase.

Display a steelpan with four clearly marked playable regions.

Each region corresponds to one unique audio sample.

Example conceptual mapping:

1 \= low tone  
2 \= medium-low  
3 \= medium-high  
4 \= high

Do not require musical notation knowledge.

\---

22\. Pan Jam Mechanics

Tutorial

One note lights up.

The player taps it.

Then two.

Round 1

2-note sequence.

Round 2

3-note sequence.

Round 3

4-note sequence.

Potential bonus:

5-note sequence.

\---

23\. Adaptive Difficulty

Track mistakes invisibly.

If the player struggles:

\- slow playback  
\- replay sequence automatically  
\- briefly illuminate correct zones  
\- reduce sequence length where necessary

Do not tell the child the game became easier.

If the child performs strongly:

\- increase rhythm complexity slightly  
\- add celebratory animation

Success never blocks story progression.

\---

24\. Pan Jam Feedback

Junior:

«“Listen first. Then play.”»

Angel:

«“Again\! Again\!”»

Lexi:

«“You've got this\!”»

On completion:

RHYTHM STAR

badge animation.

\---

25\. Moko Jumbie Scene

This is the emotional centerpiece.

The Moko Jumbies appear.

Lexi is delighted.

Junior watches carefully.

Angel hides.

Lexi:

«“Angel?”»

Angel:

«“What?”»

Lexi:

«“You're hiding.”»

Angel:

«“I am strategically standing somewhere else.”»

Angel claims Carnival is boring and she does not want to continue.

\---

26\. Emotional Choice

Present four possible responses.

A

“There's nothing to be scared of.”

Effect:

angelTrust \- 1

Angel becomes defensive.

\---

B

“Want me to stay with you?”

Effect:

angelTrust \+ 1  
offeredToStayWithAngel \= true

\---

C

“What is making you uncomfortable?”

Effect:

askedAngelWhatWasWrong \= true

If Angel Trust is sufficient:

«“They too tall.”»

If trust is low:

«“Nothing.”»

\---

D

“Junior, can you help us?”

Effect:

cooperation \+ 1  
askedForHelp \= true

Junior explains the Moko Jumbies calmly.

\---

27\. Carnival Crisis

Trigger earlier consequence.

If:

usedShortcut \=== true

Lexi's Carnival wing comes loose.

Angel realizes why.

If:

usedShortcut \=== false

another Carnival participant has a costume problem.

This allows both branches to reach a repair decision without making them identical.

\---

28\. Crisis Choice

Options:

“Whose fault is this?”

Sets:

blamedSomeone \= true

“Let's fix it together.”

Sets:

repairedMistakeTogether \= true  
cooperation \+= 1

“Let's ask someone for help.”

Sets:

askedForHelp \= true

Shortcut-specific option

“Angel, tell me what happened.”

If trust is sufficient, Angel admits:

«“I skipped one of the steps.”»

Lexi:

«“Thanks for telling me.”»

\---

29\. Ending Resolver

Create deterministic ending logic.

Priority should avoid unpredictable results.

Example:

IF high cooperation  
AND repairedMistakeTogether  
THEN TEAM\_PLAYER

ELSE IF high Angel trust  
AND supportive Moko Jumbie response  
THEN TOGETHER\_ON\_THE\_ROAD

ELSE IF usedShortcut  
AND Angel admitted mistake  
THEN WE\_FIXED\_IT

ELSE  
ONE\_LITTLE\_STEP

Tune thresholds after playtesting.

\---

30\. Endings

Implement at least four narrative variants.

Together on the Road

Angel walks with Lexi and Junior.

Badge:

CARING FRIEND

\---

One Little Step

Angel isn't ready.

Lexi respects this.

Angel moves a little closer but isn't forced.

Badge:

COURAGE COUNTS

\---

We Fixed It

Angel acknowledges her shortcut caused the problem.

Everyone repairs it.

Badge:

PROBLEM SOLVER

\---

CC Club Team

All three characters' strengths contribute.

Badge:

TEAM PLAYER

\---

31\. Story Card

At the end display:

YOUR CARNIVAL STORY

Example:

“You listened when Angel needed help.”

“You solved a Carnival costume problem.”

“You learned a steelpan rhythm.”

Then show earned badge graphics.

Buttons:

PLAY AGAIN

CC CLUB

No numerical morality score.

\---

32\. Audio

Audio manager should provide independent channels:

\- background music  
\- ambience  
\- voice  
\- sound effects

Global mute button must always be accessible.

Music and SFX should never make dialogue difficult to understand.

\---

33\. Accessibility

Required:

\- large touch targets  
\- keyboard navigable choices  
\- visible focus indicators  
\- mute control  
\- reduced-motion option if practical  
\- captions for spoken dialogue  
\- no gameplay depending exclusively on colour  
\- no essential information conveyed exclusively through audio

For the steelpan game, visual cues must accompany sounds.

\---

34\. Performance

Optimize for ordinary phones and tablets.

Targets:

\- compressed web images  
\- lazy-loading where appropriate  
\- preload only scene-critical content  
\- avoid huge sprite sheets where unnecessary  
\- avoid excessive particle counts  
\- graceful fallback if audio fails

\---

35\. Save Behaviour

MVP does not need accounts.

Optional local save:

localStorage

Save only:

\- game progress  
\- settings  
\- badges

Never ask for:

\- name  
\- age  
\- email  
\- school  
\- location  
\- personal emotional information

\---

36\. AI Feature

Do not implement AI initially.

The game must first be completed and polished without AI.

Then optionally add:

CC Club Storyteller

Input is structured state only.

Example:

{  
  "supportedAngel": true,  
  "askedForHelp": true,  
  "usedShortcut": false,  
  "panRoundsCompleted": 3  
}

Output:

one short child-safe personalized story reflection.

No free-text child input.

No personal information.

No AI-generated therapy or mental-health advice.

Provide a rules-based fallback so the feature works even with no external AI service.

\---

37\. Testing

Write automated tests for:

State

\- choice effects apply correctly  
\- trust cannot unexpectedly reset  
\- restart clears episode state  
\- saved preferences persist correctly

Branching

Test every major path.

Particularly:

Junior → supportive Angel → teamwork

Angel shortcut → supportive Angel → admission

Angel shortcut → dismissive response → repair

cooperative opening → ask Junior → team ending

Mini-games

\- correct costume order  
\- incorrect order  
\- hint behaviour  
\- pan sequence success  
\- pan sequence failure  
\- adaptive difficulty  
\- touch controls

\---

38\. Development Rules for Codex

Codex must:

1\. inspect existing files before changing architecture  
2\. work incrementally  
3\. keep the game runnable after each milestone  
4\. run tests before reporting completion  
5\. fix TypeScript errors before moving on  
6\. avoid replacing working systems unnecessarily  
7\. document major architecture decisions  
8\. avoid adding paid dependencies  
9\. avoid sending user information anywhere  
10\. preserve original artwork  
11\. keep new game content clearly separated from pre-existing Young Folk assets  
12\. use semantic Git commits where possible

\---

39\. Hackathon Documentation

Maintain:

"docs/HACKATHON\_NOTES.md"

Record:

\- date game development began  
\- newly written code  
\- new game-design systems  
\- newly created interactive content  
\- pre-existing Young Folk assets used  
\- asset ownership/attribution  
\- external libraries used  
\- any AI tools used during development

This is important because Young Folk predates the hackathon while the interactive game itself is new.

\---

40\. Milestone Plan

Milestone 1 — Playable Skeleton

Must contain:

\- title screen  
\- CC Club background  
\- Lexi visible  
\- one hotspot  
\- one dialogue  
\- one choice  
\- scene transition

Nothing else.

\---

Milestone 2 — Narrative Engine

Add:

\- dialogue data  
\- expressions  
\- multiple characters  
\- state management  
\- choices  
\- consequences  
\- branching

Test it before adding mini-games.

\---

Milestone 3 — Costume Game

Build the entire costume sequencing experience.

Make it touch-friendly.

\---

Milestone 4 — Story Time \+ Carnival

Build visual transition and Carnival environment.

\---

Milestone 5 — Pan Jam

Build complete steelpan mini-game with actual Web Audio.

\---

Milestone 6 — Moko Jumbie Branch

Implement emotional choice and Angel trust consequences.

\---

Milestone 7 — Carnival Crisis

Implement delayed consequence and repair decision.

\---

Milestone 8 — Endings

Implement all four endings and Story Card.

\---

Milestone 9 — Visual Polish

Add:

\- animation  
\- particles  
\- transitions  
\- improved typography  
\- responsive scaling  
\- audio  
\- accessibility

\---

Milestone 10 — Release Candidate

Complete:

\- mobile testing  
\- desktop testing  
\- bug fixing  
\- README  
\- credits  
\- hackathon documentation  
\- production build

\---

41\. Definition of Success

The project succeeds when a child can:

1\. open a link  
2\. meet Lexi, Angel and Junior  
3\. interact with the CC Club  
4\. make a meaningful choice  
5\. complete a costume activity  
6\. enter the Caribbean Carnival world  
7\. play the steelpan  
8\. notice Angel becoming uncomfortable  
9\. decide how Lexi responds  
10\. experience a consequence from an earlier decision  
11\. help resolve a problem  
12\. reach an ending shaped by their choices  
13\. immediately replay to discover another outcome

The player should remember:

the characters, Carnival, music and choices.

The educational and emotional learning should emerge naturally from those experiences.