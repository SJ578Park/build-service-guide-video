# Reusable failure patterns

## Contents

1. Overview disappears too quickly
2. Directions drift from controls
3. Directions appear before UI
4. Mask defects
5. Pacing swings
6. Repeated checkpoints
7. Role login confusion
8. Chapter offset drift
9. Local and deployed behavior diverge
10. Review project becomes stale

## Overview disappears too quickly

Symptom: the process map animates and cuts before a first-time viewer can read it.

Prevention: finish the entrance, then hold the completed map for at least five seconds. Treat animation time and reading time separately.

## Directions drift from controls

Symptom: arrows and spotlights point near, but not at, the current field or button.

Cause: hand-authored coordinates, viewport changes, or coordinates captured before layout stabilization.

Prevention: capture `locator.boundingBox()` after the stability gate, normalize against the recorded viewport, and validate overlap within 1%.

## Directions appear before UI

Symptom: a label and arrow float over a blank, skeleton, or partially loaded page.

Prevention: use the same `uiReady` gate for both the background frame and the overlay. Build the final edit from verified stills when load latency varies.

## Mask defects

Common failures:

- a privacy mask covers the arrow;
- a mask exposes the first credential frame;
- a mask remains after navigation;
- a hardcoded mask floats over a harmless synthetic value;
- a mask is attached to the wrong field after responsive layout changes.

Prevention: derive masks from measured privacy steps, keep arrow and pulse layers higher, and inspect frames before/during/after every custom mask.

## Pacing swings

Symptom: removing idle time makes form entry too fast for non-technical viewers.

Prevention: distinguish unexplained idle time from recognition time. Cap idle screens near two seconds, but preserve at least one second before each action, about one second between fields, and a visible result after actions.

## Repeated checkpoints

Symptom: the same three-step chapter summary appears repeatedly and interrupts the workflow.

Prevention: use one overall map and one chapter card per chapter. Add another checkpoint only when the user would otherwise lose orientation.

## Role login confusion

Symptom: narration says a role logs in at its dashboard route, but credentials are entered at a shared back-office login page.

Prevention: record the login entry route and the post-authentication role redirect separately. Name the UI exactly as deployed, even if the label is imperfect.

## Chapter offset drift

Symptom: chapter 2 begins with chapter 1's card, or chapter 1 begins with the process map.

Cause: trimming a shared motion-graphic source with stale offsets after adding a hold or transition.

Prevention: render chapter cards directly from chapter data, or calculate offsets from one authoritative schedule. Inspect the first visible frame of every chapter.

## Local and deployed behavior diverge

Symptom: a guide says an artifact is local-only even though production must support download, or a local mock hides a production failure.

Prevention: verify deployment-sensitive flows on the deployed environment and parse the actual artifact contents.

## Review project becomes stale

Symptom: the local master was rerendered but ChatCut still references the previous chapter asset.

Prevention: after every final rerender, replace only affected assets, preserve exact frame placement, read the current timeline again, and render proof frames around the changed moment.

