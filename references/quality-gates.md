# Defect and quality gates

## Contents

1. Critical product defects
2. Continue-and-log issues
3. Functional acceptance
4. Visual acceptance
5. Privacy acceptance
6. Delivery acceptance

## Critical product defects

Stop recording and editing when any of these occur:

- required scenario cannot complete;
- data is associated with the wrong tenant, round, course, project, or user;
- save, refresh, or rerun loses or duplicates data;
- authorization allows the wrong role or exposes another user's data;
- a calculation, eligibility decision, score, attendance value, status, or result is wrong;
- an ineligible user receives an artifact or eligible user cannot receive it;
- a required menu, page, or login repeatedly crashes;
- deployed behavior differs materially from the guide.

Use the sequence:

`reproduction test → minimal product fix → related tests → UI verification → discard affected capture → rerecord`.

## Continue-and-log issues

Continue while recording the issue when:

- text, translation, spacing, color, or animation is imperfect;
- a control name is unclear but the operation is correct;
- a modal lacks an explicit close button but a documented escape works;
- a card click replaces an expected manage button and routes correctly;
- a transient delay completes without data loss.

Do not describe these as ideal behavior.

## Functional acceptance

Check:

- every created entity persists after refresh;
- every relationship points to the expected entity;
- each role sees only the expected records;
- public submission creates the expected receipt or token;
- admin review and role conversion produce the correct account;
- operational input flows to the correct aggregate;
- positive and negative decisions are both demonstrated;
- final artifacts contain the expected variable values.

## Visual acceptance

Check:

- no direction before page stability;
- target and spotlight overlap within 1% of viewport;
- no cut-off UI;
- no blank, black, skeleton, or loading frames;
- no stale overlay after navigation;
- no repeated chapter card;
- action remains readable for at least one second;
- captions do not cover target controls;
- chapter boundary frames are correct.

## Privacy acceptance

Check:

- credentials are masked from first visible frame through login;
- real contact details and access tokens are absent;
- synthetic values are clearly synthetic;
- masks cover only their intended fields;
- arrows and click pulses remain visible above masks;
- no mask remains after the sensitive step;
- logs, manifests, subtitles, and PDF previews contain no secret.

## Delivery acceptance

Check:

- master and chapters use expected codec, resolution, fps, and audio;
- master duration is within the agreed range or explained;
- chapter durations and markers match;
- validation report has no failed critical check;
- issue log separates fixed and deferred items;
- deployed URL is verified;
- review editor points to the current assets;
- delivered source can reproduce the render.
