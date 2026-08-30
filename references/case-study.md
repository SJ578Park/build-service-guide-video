# Case study: from raw recording to a tested guide

## Context

This skill grew out of a real multi-role training-service guide. The product connected public applicants, administrators, instructors, and trainees. The guide had to demonstrate setup, selection, training operations, pass/fail decisions, and a generated completion artifact in two languages.

The production artifacts and customer-specific data are not part of this repository. The reusable decisions are.

## First version

The first production used browser-recorded scenario videos and a Remotion edit. It added chapter cards, sped up idle navigation, slowed dense form entry, and placed callouts and privacy masks over the footage.

That produced a usable guide, but it exposed structural weaknesses:

- manual highlight coordinates drifted from controls;
- timing rules were embedded in the composition instead of the recording evidence;
- a final edit could look successful even when the underlying workflow had not been asserted deeply enough;
- privacy masks were hard to reason about across navigation;
- rerendering one chapter could affect offsets elsewhere;
- loading and network latency made raw footage pacing inconsistent.

## Second version

The next production treated capture, product verification, editing, and delivery as one system.

Each chapter received its own browser context and raw video. Each instructional step stored:

- route and visible menu path;
- stable before/after screenshots;
- action and result timestamps;
- normalized `locator.boundingBox()` geometry;
- privacy intent;
- narration text;
- functional assertions and failure evidence.

Remotion became the final source of truth. It built an edit decision list from the manifests, used verified stills where network latency was irrelevant, and used raw video only for motion that taught something. HyperFrames supplied the overall process map and short transition source. ChatCut held flattened chapter renders for ordering, pacing, markers, and client review.

## Failures that changed the workflow

### Privacy masks appeared too late

Credentials were visible for a few frames before the mask activated.

The fix was to treat the entire credential-entry sequence as one protected interval, beginning before the first visible value and ending only after the login action completed. The raw source, final render, and review timeline were all inspected.

Rule produced: privacy is a capture-and-timeline lifecycle, not a rectangle added near the end.

### Directions appeared over loading UI

The overlay schedule started before the destination UI was stable.

The fix was to use the same readiness gate for the background frame and the instruction overlay, then start the direction after a short stable lead.

Rule produced: an overlay may not claim a target exists before the evidence frame proves it.

### Navigation highlights lingered on the next page

A menu item's rectangle remained visible after navigation, so the same coordinates pointed at unrelated content on the destination screen.

The fix was to end navigation directions at the actual click boundary and start a new segment only after destination readiness.

Rule produced: do not merge edit segments across navigation boundaries.

### Shortening idle time made the guide unreadable

Removing waits improved pace but made adjacent form fields too fast for a first-time viewer.

The fix distinguished unexplained idle time from recognition time. Idle was capped, while each target retained about one second before action and a visible result afterward.

Rule produced: shorten waiting, not comprehension.

### A process map had animation time but no reading time

The overview animated correctly and then cut away before viewers could read it.

The fix extracted the completed frame and held it for five seconds.

Rule produced: entrance duration and reading duration are separate requirements.

### Shared motion-source offsets drifted

Adding the overview hold shifted chapter-card trims. Standalone chapters began with the wrong card.

The fix rendered chapter cards directly from chapter data in the final composition and inspected the first frame of every chapter.

Rule produced: derive chapter boundaries from one authoritative schedule; do not hand-maintain trim offsets.

### Slowed media revealed a blank tail

Playback-rate changes reached beyond the verified source segment before a generated-document preview appeared.

The fix held the actual completed result frame and transitioned directly to a rendered first page of the real document.

Rule produced: clamp media to verified frames and use real completed outputs for stable holds.

### Browser rendering produced intermittent black blocks

The default graphics path occasionally emitted corrupted frames.

The production fix used a software graphics path and single render concurrency, then scanned every frame for large black regions.

Rule produced: a successful encoder exit is not visual QA; inspect rendered pixels and use a deterministic path when hardware output varies.

### Local document preview did not behave like the product result

The browser repeatedly downloaded a local PDF instead of displaying it.

The fix preserved and parsed the actual PDF, rendered its first page to an image, and showed that image as the verified artifact preview.

Rule produced: validate the artifact independently, then choose a stable and truthful visual representation.

### Automation selectors caused false critical failures

Localized options, ambiguous pass labels, a custom dialog without the expected ARIA role, and an incorrect confirmation link selector blocked chapters even though some business operations had succeeded.

The fix distinguished product defects from recording-automation defects, repaired the selector or readiness logic, discarded the affected take, and rerecorded from a known state.

Rule produced: a critical capture failure still invalidates the take, even when its root cause is the recorder rather than the product.

## Final production shape

The reusable architecture was:

1. scenario matrix with positive and negative outcomes;
2. deterministic synthetic run data;
3. one browser-recorded chapter at a time;
4. critical business assertions and saved failure evidence;
5. per-step manifests and stable stills;
6. a limited HyperFrames overview;
7. a manifest-driven Remotion master and chapter renders;
8. narration-source captions and scoped privacy layers;
9. functional, geometry, frame, media, artifact, and deployment checks;
10. an optional ChatCut chapter-level review timeline.

The important change was not the editor. It was making every stage answerable to the same verified scenario.

## What was deliberately not published

- customer or organization names;
- production and private URLs;
- credentials, tokens, contacts, and generated identifiers;
- raw browser recordings and screenshots;
- application source code;
- client-specific narration or branded graphics;
- editor project identifiers.

Use this separation when publishing your own workflow: release the method, schemas, validators, and synthetic examples; keep real capture and operational data private.
