# Recording and manifest contract

## Contents

1. Stable UI gate
2. Navigation
3. Timing
4. Geometry
5. Manifest
6. Privacy
7. Failure evidence

## Stable UI gate

Wait for all applicable conditions:

- `document.readyState === "complete"`;
- target locator visible and enabled;
- no visible spinner, skeleton, progress bar, or `aria-busy="true"`;
- required API-backed rows or cards present;
- fonts and key images loaded;
- DOM signature or screenshot stable across two observations.

Never place a direction overlay on a page that has not passed the same stability gate used to capture its background frame.

## Navigation

Record:

- entry URL;
- visible menu path;
- clicked label;
- destination URL;
- destination page heading.

For a shared login page, capture:

- login entry route;
- account role;
- post-login redirect;
- access guard behavior.

This prevents misleading statements such as assuming an Instructor signs in at `/instructor` when credentials are actually entered at a shared `/admin` route.

## Timing

Recommended defaults:

- page-stable lead: 300–500 ms before overlays;
- direction-to-action hold: at least 1,000 ms;
- adjacent field gap: about 1,000 ms;
- after-input confirmation: at least 700–1,000 ms;
- after-button confirmation: at least 1,000 ms or until narration completes;
- unexplained idle cap: 2,000 ms;
- overview static hold: at least 5,000 ms.

Tune narration, not recognition time, when shortening a guide for non-technical viewers.

## Geometry

Store normalized rectangles:

```json
{
  "x": 0.25,
  "y": 0.42,
  "width": 0.18,
  "height": 0.05
}
```

Calculate from `locator.boundingBox()` and the recording viewport. Validate every value is between 0 and 1 and that `x + width <= 1`, `y + height <= 1`.

Do not hand-author target coordinates when the DOM target exists.

## Manifest

Use one file per chapter:

```json
{
  "chapterId": "03-operation",
  "viewport": { "width": 1920, "height": 1080 },
  "steps": [
    {
      "id": "03-operation-001",
      "kind": "action",
      "title": "Open attendance",
      "description": "Select the current session.",
      "route": "https://service.example/instructor/course/123",
      "menuPath": "Instructor Mode → Course → Attendance",
      "sourceStartMs": 1000,
      "directionStartMs": 1400,
      "actionAtMs": 2500,
      "sourceEndMs": 3700,
      "targetRect": { "x": 0.7, "y": 0.2, "width": 0.12, "height": 0.06 },
      "uiReady": true,
      "privacy": false,
      "beforeStill": "stills/03-operation-001-before.png",
      "afterStill": "stills/03-operation-001-after.png"
    }
  ]
}
```

Use `kind` values consistently, for example `action`, `navigation`, `preview`, and `dialog`.

## Privacy

Attach privacy to the exact field step when possible. Derive the mask from its measured target rectangle.

Avoid chapter-wide or timestamp-only rectangles. When a custom mask is unavoidable, store:

- reason;
- frame range;
- measured rectangle;
- expected frame before;
- expected frame during;
- expected frame after.

Inspect all three frames. A mask that remains after its field or page disappears is a defect.

## Failure evidence

On a critical assertion failure, stop recording and save:

- step id and chapter;
- timestamp;
- route;
- screenshot;
- console errors;
- network failures;
- expected and actual values;
- test data run id.

Do not continue into Remotion or ChatCut with a failed critical chapter.
