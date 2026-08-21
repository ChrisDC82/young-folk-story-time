# Hackathon Screenshot Plan

Capture the production build in a 1280×720 browser viewport unless a responsive comparison is the goal. Use an ordinary playthrough and retain the real interface, state, and artwork. Do not composite, regenerate, or retouch protected game art; a simple crop to the browser canvas is acceptable after capture.

## Recommended listing set

| Priority | Scene to capture | What should be visible | Why it is strong |
|---:|---|---|---|
| 1 | Title / opening | Full CC Club art, **Young Folk: Story Time**, **Carnival Choices**, and **Start the story** | Establishes the project's identity, setting, and polished first impression immediately. |
| 2 | Carnival Costume Challenge | Lexi making the butterfly wings, four illustrated cards, and First → Next → Then → Last slots | Shows creator-supplied art used prominently with a clear, child-friendly interactive activity. |
| 3 | Pan Jam | All four labelled pan zones while a symbol is illuminated, with the Carnival pan-kids backdrop | Communicates the strongest gameplay moment, Caribbean setting, visual rhythm cues, and large controls. |
| 4 | Moko Jumbie choice | Moko Jumbies visible in the parade artwork with Angel behind Lexi and the four response choices | Demonstrates cultural context, emotional storytelling, character staging, and meaningful choice. |
| 5 | Carnival Crisis choice or repair | Prefer the four-choice shortcut screen; optionally pair it with the safety-clip repair screen | Makes the delayed consequence and non-punitive problem-solving mechanic easy to understand. |
| 6 | Emotional ending | **We Fixed It** after Angel's honest disclosure, or **Together on the Road** for a friendship-focused listing | Shows that prior choices lead to a concise emotional payoff rather than a score screen. |
| 7 | Final Story Card | Ending title, four story moments, Creator Badge, Rhythm Star, ending badge, and Play Again | Proves the experience closes cleanly, remembers the run, and supports replay. |

## Optional responsive image

Capture the Story Card or Pan Jam at approximately 844×390 in a second image only if the listing supports enough screenshots. Keep the full landscape canvas visible; the purpose is to demonstrate usable phone-scale typography and controls, not to replace a stronger desktop image.

## Capture checklist

1. Run `pnpm build` and `pnpm preview` so every image represents the production build.
2. Use normal motion, sound on, and 1280×720 unless the shot explicitly demonstrates another mode.
3. Hide browser developer tools and unrelated desktop notifications, but do not hide game UI or defects.
4. Use a real route. For the shortcut crisis and **We Fixed It**, choose **Follow Angel**, ask what is making Angel uncomfortable, then ask Angel what happened during the crisis.
5. Wait for moving elements to settle enough for readable text; do not alter timing or story state in code.
6. Review the browser console before the capture set and confirm no errors.
7. Name final files descriptively, for example `01-title.png`, `02-costume-challenge.png`, and `07-story-card.png`.
8. If image optimization is needed, preserve the original capture separately and use a free lossless tool. Record any crop or compression performed.

No screenshot files were committed during Milestone 10. The release browser QA used real local production playthroughs; this document is the handoff for final presentation capture after Chris selects the submission route and hosting URL.
