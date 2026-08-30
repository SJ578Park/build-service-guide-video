#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';

const args = process.argv.slice(2);
const value = (name) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
};

const targetArg = value('--manifest');
const minHoldMs = Number(value('--min-hold-ms') ?? 1000);

if (!targetArg) {
  console.error('Usage: node validate-guide-manifest.mjs --manifest file-or-directory [--min-hold-ms 1000]');
  process.exit(2);
}

const target = resolve(targetArg);
if (!existsSync(target)) {
  console.error(`Manifest path does not exist: ${target}`);
  process.exit(2);
}

const files = statSync(target).isDirectory()
  ? readdirSync(target).filter((name) => extname(name) === '.json').map((name) => join(target, name))
  : [target];

const failures = [];
const warnings = [];
let stepCount = 0;

const fail = (file, step, message) => failures.push({ file, step: step?.id, message });
const warn = (file, step, message) => warnings.push({ file, step: step?.id, message });

for (const file of files) {
  let manifest;
  try {
    manifest = JSON.parse(readFileSync(file, 'utf8'));
  } catch (error) {
    fail(file, undefined, `invalid JSON: ${error.message}`);
    continue;
  }

  if (!manifest.chapterId) fail(file, undefined, 'chapterId is required');
  if (!Array.isArray(manifest.steps) || manifest.steps.length === 0) {
    fail(file, undefined, 'steps must be a non-empty array');
    continue;
  }

  const ids = new Set();
  for (const step of manifest.steps) {
    stepCount += 1;
    if (!step.id) fail(file, step, 'id is required');
    else if (ids.has(step.id)) fail(file, step, 'duplicate id');
    else ids.add(step.id);

    if (!step.title) fail(file, step, 'title is required');
    if (!step.route) fail(file, step, 'route is required');
    if (step.uiReady !== true) fail(file, step, 'uiReady must be true for a final guide step');
    if (!step.beforeStill) fail(file, step, 'beforeStill is required');

    const times = ['sourceStartMs', 'directionStartMs', 'sourceEndMs'];
    for (const key of times) {
      if (!Number.isFinite(step[key])) fail(file, step, `${key} must be a finite number`);
    }
    if (Number.isFinite(step.sourceStartMs) && Number.isFinite(step.sourceEndMs) && step.sourceEndMs <= step.sourceStartMs) {
      fail(file, step, 'sourceEndMs must be greater than sourceStartMs');
    }

    if (Number.isFinite(step.actionAtMs)) {
      const preHold = step.actionAtMs - step.directionStartMs;
      const postHold = step.sourceEndMs - step.actionAtMs;
      if (preHold < minHoldMs) fail(file, step, `direction-to-action hold is ${preHold}ms; expected at least ${minHoldMs}ms`);
      if (step.kind !== 'navigation' && postHold < minHoldMs) {
        warn(file, step, `post-action hold is ${postHold}ms; consider at least ${minHoldMs}ms`);
      }
    }

    if (['action', 'navigation'].includes(step.kind)) {
      const rect = step.targetRect;
      if (!rect) {
        fail(file, step, 'targetRect is required for action and navigation steps');
      } else {
        for (const key of ['x', 'y', 'width', 'height']) {
          if (!Number.isFinite(rect[key])) fail(file, step, `targetRect.${key} must be a finite number`);
        }
        if (rect.x < 0 || rect.y < 0 || rect.width <= 0 || rect.height <= 0 || rect.x + rect.width > 1 || rect.y + rect.height > 1) {
          fail(file, step, 'targetRect must fit inside normalized viewport coordinates');
        }
      }
    }

    if (step.privacy === true && !step.targetRect) fail(file, step, 'privacy steps require a measured targetRect');
    if (step.kind === 'navigation' && !step.menuPath) warn(file, step, 'navigation step has no menuPath');
  }
}

const report = {
  status: failures.length === 0 ? 'pass' : 'fail',
  files: files.length,
  steps: stepCount,
  minHoldMs,
  failures,
  warnings,
};

console.log(JSON.stringify(report, null, 2));
process.exit(failures.length === 0 ? 0 : 1);
