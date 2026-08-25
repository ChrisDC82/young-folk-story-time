# Devpost Submission Draft

> Draft for Chris's review. Do not submit automatically.

## Project Title

Young Folk Story Time

## Tagline

A child-friendly Caribbean story game where creativity, rhythm, empathy, and cooperation shape the Carnival journey.

## Inspiration

Young Folk Story Time was created to make Caribbean storytelling feel playable for children. The project brings together the warmth of a community cultural club, the creativity and colour of Kiddies Carnival, the sound and visual language of steelpan, and the emotional learning that can happen when friends listen to one another.

We wanted choices to matter without turning kindness into a score. A child can follow instructions, try a creative shortcut, or combine ideas; later scenes remember those decisions. Mistakes invite repair instead of punishment, and every ending recognizes something the player learned or contributed.

The Young Folk characters and original illustrations came from the project's creator and predate this game. The browser experience was built around that protected artwork rather than replacing it.

## What It Does

The game begins at the Community and Cultural Club with Lexi, Angel, and Junior. The player makes an opening choice that updates trust, cooperation, and shortcut state. That state remains active through the entire story.

Players then:

- arrange four illustrated steps to make Lexi's Carnival wings and earn a Creator Badge;
- wake the Story Pot and arrive at Kiddies Carnival;
- explore the Carnival scene;
- listen to and repeat visual steelpan patterns in Pan Jam to earn a Rhythm Star;
- respond to Angel during a Moko Jumbie parade encounter, with trust affecting how openly she speaks;
- face either Lexi's loose wing fastening or a nearby masquerader's costume problem, depending on the earlier shortcut choice;
- choose how to respond, complete a gentle three-step repair, and see an ending derived from the whole journey.

The four possible endings are **Together on the Road**, **One Little Step**, **We Fixed It**, and **CC Club Team**. A final Story Card summarizes meaningful moments and the badges earned. Play Again resets the story state while preserving the player's mute preference.

## How We Built It

Young Folk Story Time is a static browser game built with Phaser, TypeScript, and Vite. Phaser scenes handle visual presentation and input, while the story rules are plain typed TypeScript:

- episode data files own characters, dialogue, choices, conditions, and effects;
- a reusable narrative engine and choice system update an isolated typed state manager;
- Phaser-independent models implement costume sequencing, Pan Jam progression, Carnival repair, deterministic ending resolution, and Story Card generation;
- Vitest verifies state transitions and branch behavior without needing a browser;
- Pan Jam tones are synthesized locally with the browser Web Audio API, using a short strike and inharmonic partials rather than downloaded recordings;
- a shared motion preference supports the operating-system setting and an explicit `?motion=reduce` mode;
- responsive Phaser layouts support desktop and landscape-phone play with mouse, keyboard, and touch-style pointer input.

The release does not require a backend, account, API key, analytics service, or player-data transmission.

## Challenges

- Keeping a branching story deterministic while carrying trust, cooperation, shortcut, activity, and repair state across many Phaser scenes.
- Designing touch targets and readable dialogue for both a 1280×720 desktop and small landscape-phone viewports.
- Making choices meaningful without scores, shame, harsh failure feedback, or a single “correct” personality response.
- Giving Pan Jam a steelpan-like feel with generated browser audio while keeping all notes understandable through visual symbols, light, shape, and text.
- Respectfully integrating Carnival and Moko Jumbie context while keeping the experience concise and child-friendly.
- Supporting mouse, keyboard, touch-style input, mute, replay, and reduced motion without duplicating the underlying game rules.
- Testing ending priority and narrative-state preservation so overlapping valid choices always resolve predictably.

## Accomplishments That We're Proud Of

- A complete start-to-ending story with three opening approaches, trust-dependent dialogue, shortcut and non-shortcut crises, four endings, and replay.
- Two reusable child-friendly activities: Carnival wing sequencing and a visual steelpan rhythm game, plus a short costume-repair interaction.
- Positive assistance after repeated difficulty and outcomes that reward reflection rather than points.
- A personal Story Card that brings together the journey, Creator Badge, Rhythm Star, and ending badge.
- Responsive desktop and landscape-phone presentation with mouse, keyboard, touch-style pointer, persistent mute, and reduced-motion support.
- 95 deterministic automated tests covering narrative state, choices, conditions, activities, endings, replay/reset, audio state, motion preference, and canvas accessibility.
- A fully static release with no paid service, backend, account, analytics, downloaded music, or commercial asset dependency.

## What We Learned

The project showed that meaningful narrative choice does not require a large dialogue tree when later scenes carefully remember a few well-chosen state values. Keeping the narrative and mini-game rules independent from Phaser made branch behavior easier to test and presentation safer to improve.

We also learned that accessibility works best as a system rather than a final overlay: large targets, persistent text, redundant visual cues, reduced motion, mute, and multiple input methods influenced each scene from the start. Finally, a positive retry loop can still provide clear feedback and a satisfying sense of progress without using failure language.

## What's Next

The hackathon build is complete. Possible future work—clearly outside this release—includes additional Young Folk stories, richer character animation, more Carnival and cultural activities, optional voice performance, broader accessibility preferences, and new educational story modules. Any future content should preserve the current provenance safeguards and culturally grounded review process.

## Built With

- Phaser 3.90
- TypeScript 5.9
- Vite 7
- Vitest 4
- Browser Web Audio API
- HTML5 Canvas
- CSS
- pnpm

## Try It

**Playable URL:** [https://youngfolk.forwardeverfoundation.org](https://youngfolk.forwardeverfoundation.org)

## Source Code

**Repository URL:** [https://github.com/ChrisDC82/young-folk-story-time](https://github.com/ChrisDC82/young-folk-story-time)

## Credits and Cultural References

- Young Folk characters and source illustrations: creator-supplied protected original work; provenance and runtime processing are recorded in `docs/ASSET_MANIFEST.md`.
- Traditional mas context was reviewed against the [National Carnival Commission's Moko Jumbie reference](https://ncctt.org/traditional-mas-characters-moko-jumbie/) and the [NALIS Carnival guide](https://www.nalis.gov.tt/resources/tt-content-guide/carnival/).
