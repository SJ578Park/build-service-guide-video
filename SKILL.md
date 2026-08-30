---
name: build-service-guide-video
description: Create, revise, and validate deployment-based product walkthrough and operator-guide videos for web apps, SaaS products, and multi-role services. Use for browser- or computer-controlled screen capture, Remotion or HyperFrames guide production, ChatCut review handoff, DOM-anchored directions, privacy masking, role-based workflows, generated artifacts, or defect-gated recording.
---

# Build Service Guide Video

Produce a guide that teaches a first-time, non-technical viewer how the deployed service actually works. Treat the application behavior, recording evidence, edit manifest, and final renders as one testable system.

## Start with the outcome

1. Identify the audience, deployed URL, roles, language, resolution, target duration, capture surface, and required outputs.
2. Convert the requested flow into a scenario matrix covering setup, user input, role handoff, operation, decision, and final artifact.
3. Decide whether the deliverable is:
   - a factual operator guide;
   - a short product tour;
   - a mixed guide with an overview map plus role-based walkthroughs.
4. Default to a 1920×1080, 30 fps master, chapter renders, source composition, validation report, and editable review project unless the user specifies otherwise.

Read [references/workflow.md](references/workflow.md) before implementing a full guide. For a small revision, load only the references needed below.

## Apply the defect gate

Stop video work and repair the product when a required flow cannot complete, produces the wrong business result, loses or duplicates data, exposes unauthorized data, misroutes roles, or generates an invalid final artifact.

Continue while logging the issue when it is cosmetic, confusing but operable, or recoverable without changing the business result. Never hide a real product failure with an edit, overlay, or generated replacement screen.

Read [references/quality-gates.md](references/quality-gates.md) for severity rules and acceptance checks.

## Record stable evidence

Use browser automation for repeatable data and DOM measurements. Record the real menu path, URL, loaded-state screenshot, target bounding box, action time, post-action screenshot, privacy intent, and narration text for every guide step.

Require:

- a fully loaded and visually stable page before any direction appears;
- at least one second for viewers to see each input target or button before the action;
- about one second between adjacent form fields;
- a post-action hold for visible confirmation;
- no more than about two seconds of unexplained idle screen;
- actual menu navigation for top-level admin or role transitions;
- explicit capture of the shared login entry point and the role-specific redirect.

Never infer a login URL from a role name. Verify both the page where credentials are entered and the route reached after authorization.

Read [references/recording-contract.md](references/recording-contract.md) before writing Playwright or browser-recording code.

Read [references/screen-capture-surfaces.md](references/screen-capture-surfaces.md) when capture uses Playwright, Codex Browser, Computer Use, an existing signed-in session, native application UI, or an OS screen recorder. Do not claim continuous recording from a surface that only returned screenshots.

## Build the edit from the manifest

Use stable before/after frames as the visual source when raw recording contains loading, blank, or delayed UI. Keep animation and audio deterministic and frame-based.

Layer visuals in this order:

1. captured UI;
2. privacy masks;
3. dimming and spotlight;
4. explanation panel;
5. arrow;
6. click pulse;
7. captions.

Keep arrows and click pulses above every privacy mask. Scope each mask to the exact field and time window; prohibit free-floating hardcoded masks unless a frame-level test proves they are necessary.

Hold the overall process map for at least five seconds after its entrance animation. Show chapter cards once at meaningful boundaries. Render chapter cards directly when source-video time offsets could drift.

Read [references/editing-and-overlays.md](references/editing-and-overlays.md) before changing Remotion timing, masks, captions, or chapter boundaries.

Read [references/failure-patterns.md](references/failure-patterns.md) when reviewing an existing guide or diagnosing why a render feels unfinished.

Read [references/case-study.md](references/case-study.md) when adapting the workflow to a new service or deciding which rules address demonstrated production failures.

## Choose tools deliberately

- Use browser automation to execute and assert repeatable web flows, record chapter video, capture stills, and measure DOM targets.
- Use Codex Browser for requested or existing browser state that needs direct visual interaction and screenshots; follow its current documented capture capabilities.
- Use Computer Use for native or otherwise inaccessible UI. Pair screenshot-based control with a separate recorder when continuous desktop video is required.
- Use Remotion for deterministic UI footage assembly, overlays, captions, audio, chapters, and local master renders.
- Use HyperFrames for reusable process maps or short transition motion graphics when it materially improves comprehension.
- Use ChatCut as an editable review and handoff surface. Keep the master source of truth explicit.
- Use local TTS, deterministic subtitles, probing, frame extraction, and tests before paid generation.

Read [references/tooling-and-cost.md](references/tooling-and-cost.md) when selecting frameworks, model tiers, or ChatCut handoff depth.

## Validate before delivery

Validate the product result and the rendered pixels.

At minimum:

- replay every critical assertion;
- confirm every target rectangle overlaps its direction graphic;
- inspect exact frames around every navigation and action boundary;
- detect blank, loading, black, or clipped frames;
- inspect every privacy window and the frame immediately after it;
- verify required menu paths;
- verify role-specific routes and access;
- verify pass/fail, eligibility, downloads, PDFs, exports, or other final artifacts;
- scan logs and manifests for passwords, tokens, contact data, and real user information;
- scan raw screenshots, videos, filenames, metadata, and review proxies before any public release;
- probe codec, resolution, frame rate, audio, duration, and chapter boundaries;
- verify the live ChatCut timeline after replacing an asset.

Run `scripts/validate-guide-manifest.mjs` on generated manifests and use `scripts/extract-review-frames.mjs` for exact-frame review.

## Initialize a reusable production workspace

Run:

```bash
node scripts/init-guide-workspace.mjs --out /absolute/path/to/video-guide --name "Service Operator Guide"
```

The initializer copies generic configuration, scenario, and issue templates without importing application-specific data.

## Keep reports factual

Separate the final report into:

- critical product defects fixed;
- minor issues left for the client;
- chapters rerecorded or rerendered;
- deployment verification;
- render and visual QA results;
- editable handoff location.

Do not claim that a browser, editor, deployment, or PDF was verified without current evidence.
