# Editing and overlay rules

## Contents

1. Stable visual source
2. Frame schedule
3. Overlay layers
4. Mask lifecycle
5. Panel placement
6. Chapters
7. Audio and captions

## Stable visual source

Use captured before/after stills for form entry and menu explanation when raw browser video contains variable network latency. Swap to the after still at the recorded action time.

Use raw video only for motion that matters:

- menu opening;
- scrolling that establishes location;
- drag, animation, or progress state;
- document opening;
- transitions whose behavior is instructional.

Clamp the background frame to the verified segment. Do not let a long narration advance into the next page's loading period.

## Frame schedule

Create one edit segment per guide step. Calculate its duration as the maximum of:

- recorded action window adjusted for playback rate;
- narration duration plus a short breathing margin;
- minimum recognition and confirmation holds.

Do not merge across navigation boundaries.

## Overlay layers

Use explicit z-index groups:

| Layer | Example z-index |
|---|---:|
| UI | 0 |
| Privacy masks | 30 |
| Spotlight | 40 |
| Explanation panel | 60 |
| Arrow | 62 |
| Click pulse | 64 |
| Caption | 70 when it does not cover the target |

Keep arrow SVG and click pulse above masks. Test a frame where the arrow crosses a masked field.

## Mask lifecycle

Prefer data-driven masks from privacy-tagged guide steps.

For credentials, extend the email and password masks through the login click and remove them immediately on the destination page.

Reject:

- a mask without an active sensitive field;
- a mask located over a synthetic, intentionally visible training value;
- a mask that persists on a stable next step;
- a mask that covers an arrow or click pulse;
- a mask hardcoded only by chapter time without a documented reason.

Sample at least one frame before, during, and after every nontrivial mask.

## Panel placement

Choose the explanation panel position from the target rectangle. Avoid:

- covering the target;
- crossing the bottom caption safe area;
- covering a primary result badge;
- placing the arrow across unrelated sensitive content.

Keep the panel within title-safe margins and clamp long text.

## Chapters

Show:

- one overall map at the beginning;
- one chapter card per chapter;
- no repeated checkpoint card unless it resolves real orientation loss.

Hold the completed overview for at least five seconds. Generate chapter cards directly in the composition when a shared motion-graphic source can create trim-offset errors.

Render and inspect the first frame of every chapter. Confirm card number, title, and description match the chapter body.

## Audio and captions

Normalize narration consistently. Generate captions from narration text and audio duration.

Keep captions visible long enough for the audience and avoid rapid one-line changes during form entry. Let narration finish on a stable UI frame.

