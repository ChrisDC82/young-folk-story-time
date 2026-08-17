# Asset Manifest

Inventory completed on 2026-08-17 and updated after Milestone 4. All supplied files are PNG images in RGB mode and therefore contain no alpha channel in their original form. The `assets-original/` directory is protected; no source file was modified, renamed, resized, overwritten, cropped, converted, or deleted.

## Ownership, licensing, and provenance

- The supplied **Young Folk** character and environment artwork came from the project's creator and predates the interactive browser-game implementation.
- No separate asset license file or third-party license terms were present in the project at inspection time. This manifest therefore does not assert any broader redistribution or reuse rights.
- Runtime derivatives retain the provenance and protected status of their supplied source artwork. Creating a technical derivative does not change the underlying ownership.
- No external asset service, paid tool, generated replacement, or downloaded character art was used for Milestones 1–4.
- The Phaser/TypeScript game implementation and interactive content are newly created work, separately documented in `docs/HACKATHON_NOTES.md`.

## Supplied source assets

| Original filename | Type and dimensions | Apparent content | Likely future game use | Transparent background preparation | Cropping or sprite extraction | Technical concerns | Milestone usage |
|---|---|---|---|---|---|---|---|
| `Angel Character Sheet.png` | PNG, 1536×1024 | Angel reference sheet: front, side, back, 3/4, happy, thinking, surprised, and excited views. The character has multiple arms. | Angel character sprites and expression portraits. | Yes, for isolated character sprites. | Yes; each labelled pose would need a separate derivative. | Solid white background, labels, and several poses in one image. Extraction must preserve the multiple-arm design and fine outlines. | Milestone 2: front, happy, thinking, and excited derivatives created. Milestone 4: those prepared derivatives reused for Story Time and Carnival arrival. |
| `Community Cultural Club Background.png` | PNG, 1672×940 | Detailed CC Club interior containing a Caribbean map, steelpan display, bookshelves, craft table, story pot, flags, and seating. | Main CC Club exploration environment and future environmental hotspots. | No; intended as a full-frame background. | No for background use. Individual objects would require separate artwork or careful derivative extraction. | Near-16:9 aspect ratio (about 1.779:1); embedded text and objects are part of the illustration. | Milestones 1–4: unchanged runtime copy used by the title, CC Club, completion, and Story Time scenes. |
| `Jungle background.png` | PNG, 1536×1024 | Bright tropical jungle path with stream, waterfall, flowers, butterflies, mushrooms, and trees. | Possible future story environment. | No; intended as a full-frame background. | No for background use. | 3:2 aspect ratio, so a future 16:9 presentation will require contain/cover decisions without stretching. | Not used through Milestone 4. |
| `Junior Character Sheet.png` | PNG, 1369×1149 | Junior reference sheet: front, side, back, 3/4, happy, thinking, surprised, and excited views. | Junior character sprites and expression portraits. | Yes, for isolated character sprites. | Yes; each labelled pose would need a separate derivative. | Solid white background, labels, and several poses in one image; narrow features and outlines need careful masking. | Milestone 2: front, happy, thinking, and surprised derivatives created. Milestone 4: prepared derivatives reused for Story Time and Carnival arrival. |
| `Kiddies Carnival Background.png` | PNG, 1536×1024 | Empty Carnival street/plaza with steelpan stage, banners, balloons, houses, and two distant Moko Jumbies. | Carnival arrival, lightweight exploration, and future mini-game environment. | No; intended as a full-frame background. | No source crop or derivative extraction. | 3:2 aspect ratio; Milestone 4 preserves it with proportional cover scaling and a reversible top/bottom presentation crop, never stretching the image. Source SHA-256: `34CE7DB71294697ED07D9FE32F751B51B6A0CB47A8D5EB7010270F435543917E`. | Milestone 4: unchanged runtime copy used prominently by `CarnivalScene`. |
| `Kiddies Carnival scene.png` | PNG, 1672×941 | Busy Carnival parade with children playing pans, dancers, crowd, confetti, flags, and Moko Jumbies. | Future cinematic/story scene or Carnival establishing image. | No; intended as a full-frame illustration. | Not for normal background use; embedded figures are not separate sprites. | Near-16:9; dense embedded characters make hotspot placement and object isolation difficult. | Not used through Milestone 4. |
| `kiddies carnival.png` | PNG, 1672×941 | Carnival street scene with pan players, dancers, crowd, banner, and Lexi centered in the foreground. | Future Carnival story/cinematic scene featuring Lexi. | No for full-frame use. | Cropping would be required only if attempting to isolate embedded characters, which is not recommended without manual preparation. | Near-16:9; Lexi and other figures are baked into the scene, limiting independent animation. | Not used through Milestone 4. |
| `Lexi Character Sheet.png` | PNG, 1369×1149 | Lexi reference sheet: front, side, back, 3/4, happy, thinking, surprised, and excited views. | Canonical Lexi sprites and expression portraits. | Yes, for isolated character sprites. | Yes; individual poses need reversible derivative extraction. | Solid white background, labels, and several poses in one image. White areas enclosed by outlines must not be removed during background extraction. | Milestone 1: front derivative. Milestone 2: happy and excited derivatives added. Milestone 4: prepared derivatives reused for Story Time and Carnival arrival. |
| `lexi making wings.png` | PNG, 1672×941, RGB | Original Young Folk illustration of Lexi making decorated butterfly Carnival wings at the CC Club craft table. | Primary visual backdrop for the Carnival Costume Challenge and a reference for the four illustrated sequencing steps. | No; intended as a full-frame scene. | No cropping or sprite extraction is required for Milestone 3. | Near-16:9 with Lexi, wings, craft materials, signage, and room details embedded in one illustration. Source SHA-256 recorded at integration: `2BF95F6438340AF77CF77BCCF33BF532E50FC3F22F3CC8FD8609660FAF48198B`. | Milestone 3: used prominently as the full-scene costume-making backdrop via an unchanged runtime copy. |
| `Outside the CC Club.png` | PNG, 1672×941 | Exterior of the Community and Cultural Club with tropical plants, parrots, butterflies, and an open door. | Future episode opening, exterior transition, or title material. | No; intended as a full-frame background. | No for background use. | Near-16:9; signs and wildlife are embedded in the illustration. | Not used through Milestone 4. |
| `pan kids.png` | PNG, 1672×941 | Four children playing steelpans beneath a Kiddies Carnival banner. | Future Pan Jam introduction, story card, or Carnival cinematic. | No for full-frame use. | Individual players or pans would require careful manual extraction. | Near-16:9; characters and instruments are baked into the image. | Not used through Milestone 4. |
| `Story pot.png` | PNG, 1672×941 | Close view of the glowing story pot in the CC Club with floating cultural symbols. | Story Time transition and magical travel cinematic. | No; intended as a full-frame illustration. | No for full-frame use; the pot and effects are embedded. | Near-16:9; background blur and glow are baked in, so it is not an isolated pot sprite. Source SHA-256: `7CDAC762CF66827CFABE99BAF7438D0C42DD8767CFDFC67D8799B7EBCECE47F0`. | Milestone 4: unchanged runtime copy used for the Story Time camera-push transition. |

## Runtime assets created for Milestone 1

| Runtime file | Source | Preparation | Result and use |
|---|---|---|---|
| `public/assets/backgrounds/cc-club/cc-club-interior.png` | `Community Cultural Club Background.png` | Byte-for-byte file copy; no transformation. | 1672×940 RGB PNG used by the title, club, completion, and Story Time scenes through Milestone 4. |
| `public/assets/characters/lexi/lexi-front.png` | `Lexi Character Sheet.png` | Cropped from the front-pose area on a derivative, then only near-white pixels connected to the crop boundary were made transparent. No resampling or character redesign. | 344×458 RGBA PNG used for Lexi's static/lightly animated CC Club presentation. |

## Runtime character derivatives created through Milestone 2

| Original source | Runtime derivative | Type and dimensions | Milestone and narrative use |
|---|---|---:|---|
| `Lexi Character Sheet.png` | `public/assets/characters/lexi/lexi-front.png` | RGBA PNG, 344×458 | Milestones 1–2 and 4: neutral Lexi presentation. |
| `Lexi Character Sheet.png` | `public/assets/characters/lexi/lexi-happy.png` | RGBA PNG, 315×431 | Milestone 2: opening-decision expression. |
| `Lexi Character Sheet.png` | `public/assets/characters/lexi/lexi-excited.png` | RGBA PNG, 320×433 | Milestone 2: opening and teamwork reaction. |
| `Angel Character Sheet.png` | `public/assets/characters/angel/angel-front.png` | RGBA PNG, 361×412 | Milestones 2 and 4: neutral Angel presentation. |
| `Angel Character Sheet.png` | `public/assets/characters/angel/angel-happy.png` | RGBA PNG, 341×371 | Milestone 2: prepared for episode dialogue reuse. |
| `Angel Character Sheet.png` | `public/assets/characters/angel/angel-thinking.png` | RGBA PNG, 249×366 | Milestone 2: Angel's reply during the opening conversation. |
| `Angel Character Sheet.png` | `public/assets/characters/angel/angel-excited.png` | RGBA PNG, 340×370 | Milestone 2: shortcut proposal and branch reaction. |
| `Junior Character Sheet.png` | `public/assets/characters/junior/junior-front.png` | RGBA PNG, 270×440 | Milestones 2 and 4: neutral Junior presentation. |
| `Junior Character Sheet.png` | `public/assets/characters/junior/junior-happy.png` | RGBA PNG, 264×434 | Milestone 2: Follow-Junior branch reaction. |
| `Junior Character Sheet.png` | `public/assets/characters/junior/junior-thinking.png` | RGBA PNG, 260×432 | Milestone 2: instruction and shortcut-warning dialogue. |
| `Junior Character Sheet.png` | `public/assets/characters/junior/junior-surprised.png` | RGBA PNG, 266×432 | Milestone 2: prepared for episode dialogue reuse. |

## Runtime scene asset created for Milestone 3

| Original source | Runtime file | Type and dimensions | Preparation and use |
|---|---|---:|---|
| `assets-original/lexi making wings.png` | `public/assets/backgrounds/cc-club/lexi-making-wings.png` | RGB PNG, 1672×941 | Byte-for-byte runtime copy made by `scripts/prepare-assets.py`; only the destination filename is normalized for the runtime asset tree. No crop, resize, resampling, recolouring, masking, compression change, generative processing, or artwork alteration was performed. Used as the full-frame Milestone 3 costume challenge backdrop. The source and runtime SHA-256 values both equal `2BF95F6438340AF77CF77BCCF33BF532E50FC3F22F3CC8FD8609660FAF48198B`. |

## Runtime scene assets created for Milestone 4

| Original source | Runtime file | Type and dimensions | Preparation and use |
|---|---|---:|---|
| `assets-original/Story pot.png` | `public/assets/backgrounds/cc-club/story-pot.png` | RGB PNG, 1672×941 | Byte-for-byte runtime copy made by `scripts/prepare-assets.py`. No image transformation was performed. Used as the full-frame magical journey close-up. Source and runtime SHA-256 values both equal `7CDAC762CF66827CFABE99BAF7438D0C42DD8767CFDFC67D8799B7EBCECE47F0`. |
| `assets-original/Kiddies Carnival Background.png` | `public/assets/backgrounds/carnival/kiddies-carnival-background.png` | RGB PNG, 1536×1024 | Byte-for-byte runtime copy made by `scripts/prepare-assets.py`. No image transformation was performed. `CarnivalScene` uses proportional cover scaling at runtime, producing a reversible presentation crop without changing or stretching the file. Source and runtime SHA-256 values both equal `34CE7DB71294697ED07D9FE32F751B51B6A0CB47A8D5EB7010270F435543917E`. |

## Derivative preparation method

The preparation procedure is reproducible in `scripts/prepare-assets.py` and writes only to `public/assets/`. Full-frame backgrounds are copied without transformation. For character extraction, it:

1. crops only the required pose area on a derivative image;
2. removes near-white pixels connected to the crop boundary;
3. preserves enclosed white details such as eyes;
4. saves an RGBA PNG without resampling or redesigning the character.

## Derivative technical notes

- Angel's bottom-row expression artwork is drawn as upper-body presentation rather than a full standing pose. The game preserves that supplied composition and normalizes only its display bounds in Phaser.
- Character sheets still contain other unused poses. They should be extracted only when a later milestone needs them.
- Current sprites use static expression swaps plus gentle movement; skeletal animation and automatic rigging remain intentionally deferred.
