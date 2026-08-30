# End-to-end workflow

## Contents

1. Intake
2. Scenario design
3. Test data
4. Product gate
5. Recording
6. Editing
7. Voice and captions
8. Deployment validation
9. Review handoff
10. Delivery

## 1. Intake

Collect or discover:

- service URL and repository;
- deployment target;
- viewer role and technical comfort;
- actor roles such as public applicant, trainee, instructor, partner, staff, and administrator;
- exact business outcome each role must produce;
- required language, narration, captions, aspect ratio, and duration;
- mandatory outputs such as PDF, Excel, certificate, email, account, or approval result;
- privacy restrictions;
- available capture surfaces, screen-recording permissions, and whether a signed-in browser or native app is required;
- existing videos and reusable visual assets.

Prefer discovery from the repository and deployed UI over asking the user for implementation details that are locally observable.

## 2. Scenario design

Create a scenario matrix before recording.

| Phase | Actor | Entry point | Required action | Expected state | Evidence |
|---|---|---|---|---|---|
| Setup | Admin | Shared login | Create configuration | Active record | UI + database assertion |
| Apply | Public user | Public form | Submit minimum data | Receipt/token | Confirmation screen |
| Select | Admin | Admin menu | Review and approve | Role/account created | Account and assignment |
| Operate | Instructor | Shared login | Record session activity | Admin aggregate updated | Both role views |
| Complete | Admin | Result screen | Decide eligibility | Pass and fail | Badges and rationale |
| Deliver | Eligible user/admin | Result screen | Download artifact | Valid file | Parsed artifact |

Cover at least one positive and one negative case when the service makes a decision. Show both the eligible control and the ineligible absence of the control.

Keep narration aligned with the actual feature. Do not describe a future or intended workflow as current behavior.

## 3. Test data

Use a run identifier in every synthetic name to make reruns traceable. Create deterministic positive and negative cases.

Store secrets only in runtime environment variables or test fixtures excluded from output. Redact:

- passwords;
- one-time tokens;
- private contact details;
- real names;
- session identifiers;
- internal URLs when they grant access.

Dummy names and values may be visible when they are clearly synthetic and approved for training use.

## 4. Product gate

Before editing a chapter, assert every required business state. On a critical failure:

1. write a reproduction test;
2. fix the product in the smallest relevant scope;
3. run related tests;
4. verify through the real UI;
5. discard affected recordings;
6. rerecord the chapter.

Do not keep a recording made before the fix, even when the visual difference looks small.

## 5. Recording

Record chapters independently. A chapter should be replaceable without rerendering unrelated source capture.

Choose the capture surface per chapter. Prefer browser automation for repeatable web flows, Codex Browser for requested or existing browser state, Computer Use for native UI, and an OS recorder only when continuous cross-app motion matters. Read [screen-capture-surfaces.md](screen-capture-surfaces.md) before using screen-control capture.

For automated browser video, use one fixed-size browser context per chapter and close it before accepting the media path. For Browser or Computer Use screenshots, keep fresh before/after state reads with the same manifest contract. A screenshot-only surface must not be reported as continuous video.

For every action:

1. wait for the document and required data;
2. wait for visible loaders and busy states to end;
3. confirm the DOM or screenshot remains stable;
4. capture the before frame;
5. measure the target;
6. display the direction for at least one second;
7. perform the action;
8. wait for the expected result;
9. capture the after frame;
10. write the step to the manifest.

For top-level navigation, show the menu opening and menu item click. Direct routes are acceptable only for entry points or pages without the product navigation control.

## 6. Editing

Use a manifest-driven EDL. Prefer verified stills for UI explanation and use motion only when it communicates an action or state change.

Remove:

- initial loading;
- skeletons and blank containers;
- network waits;
- duplicate idle frames;
- stale overlays after navigation;
- previous-page masks on the next page.

Preserve:

- the context needed to recognize the page;
- target discovery time;
- one-second pre-action recognition;
- post-action confirmation;
- narration completion.

## 7. Voice and captions

Create narration sentence by sentence. Generate captions from the narration source text and measured audio duration rather than paying for ASR on generated narration.

Keep captions clear of:

- target controls;
- arrows;
- fixed browser navigation;
- PDFs or result badges being demonstrated.

Use silence only where it supports comprehension. Do not use music by default in an operator guide.

## 8. Deployment validation

Validate deployment-sensitive behavior against the deployed environment:

- authentication and redirects;
- role access;
- storage and refresh persistence;
- generated file URLs;
- downloads and browser permissions;
- server or cloud functions;
- production-only configuration.

Do not use “local-only” wording in a guide intended for deployed users unless that is the actual deployed behavior.

## 9. Review handoff

For ChatCut:

- import chapter assets or original editable layers according to the promised editability;
- preserve exact frame durations;
- mark chapter boundaries;
- verify the current timeline structure with a fresh read;
- render exact boundary frames after replacement.

If ChatCut holds flattened chapter renders, describe it as a chapter-level review timeline. Do not imply that internal Remotion overlays are independently editable there.

## 10. Delivery

Deliver:

- master MP4;
- chapter MP4s;
- source composition;
- guide manifests;
- capture inventory and publish-safety decisions;
- narration and captions;
- validation report;
- issue log;
- editable review project link when requested.

Report remaining minor issues so the client can decide whether to revise them during operations.
