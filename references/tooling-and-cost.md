# Tooling and cost control

## Framework choice

Use browser automation for interaction capture and business assertions.

Use Codex Browser when the task explicitly requires the in-app or connected browser, when an existing signed-in page matters, or when visual inspection and screenshots are the goal. Read the selected browser's current runtime documentation before interacting and do not assume it exposes continuous recording.

Use Computer Use for native application UI, system dialogs, or controls that have no purpose-built interface. Use fresh accessibility state after every navigation or mutation. Treat screenshots as moment evidence and add a separate recorder when continuous native-app video is required.

Use Remotion when the guide needs:

- deterministic frame timing;
- DOM-derived overlays;
- many chapter renders;
- programmatic masks and captions;
- reproducible local output.

Use HyperFrames for:

- an overall process map;
- short chapter transitions;
- reusable motion graphics.

Do not use a long generated motion video to imitate application UI.

Use ChatCut for:

- chapter ordering and pacing review;
- client-accessible timeline notes and markers;
- final audio checks;
- optional editorial adjustments.

State whether ChatCut contains original editable layers or flattened chapter renders.

Keep one declared master source of truth. In the default workflow it is Remotion; HyperFrames contributes bounded motion assets and ChatCut contributes review or optional editorial changes.

## Cost order

Prefer:

1. local browser automation and tests;
2. local frame extraction and probing;
3. local TTS and source-derived captions;
4. deterministic Remotion or HyperFrames rendering;
5. lightweight models for structured manifest work;
6. general coding models for implementation;
7. high-reasoning models only for security, data integrity, or ambiguous critical defects;
8. paid generation only when the user explicitly needs original media.

## Escalation

Escalate model capability only when the current tier cannot pass a concrete check. Record the failed check rather than escalating because the task “feels complex.”

Use high-reasoning analysis for:

- permission bypass;
- tenant or role data leakage;
- wrong eligibility or financial result;
- persistent data corruption;
- an unclear critical defect with multiple subsystems.

Use deterministic scripts for:

- manifest validation;
- timestamps;
- coordinate normalization;
- frame extraction;
- codec probing;
- subtitle timing;
- report aggregation.
