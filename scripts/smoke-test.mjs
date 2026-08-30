#!/usr/bin/env node

import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const tempRoot = mkdtempSync(join(tmpdir(), 'build-service-guide-video-'));
const workspace = join(tempRoot, 'workspace');

const run = (script, args) => {
  const result = spawnSync(process.execPath, [join(root, 'scripts', script), ...args], {
    cwd: root,
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    throw new Error(`${script} failed\n${result.stdout}\n${result.stderr}`);
  }
  return result.stdout;
};

try {
  run('init-guide-workspace.mjs', ['--out', workspace, '--name', 'Smoke Test Guide']);

  const expected = [
    'guide.config.json',
    'scenario-matrix.md',
    'video-production-issues.md',
    'manifests/guide-manifest.example.json',
    'recordings',
    'stills',
    'narration',
    'renders/chapters',
    'evidence',
    'reports',
  ];

  const missing = expected.filter((relative) => !existsSync(join(workspace, relative)));
  if (missing.length > 0) throw new Error(`initializer missed: ${missing.join(', ')}`);

  run('validate-guide-manifest.mjs', ['--manifest', join(workspace, 'manifests')]);
  console.log(JSON.stringify({ status: 'pass', initializedFiles: expected.length }, null, 2));
} finally {
  const safePrefix = `${resolve(tmpdir())}${sep}`;
  if (!resolve(tempRoot).startsWith(safePrefix)) {
    throw new Error(`refusing to remove unexpected temporary path: ${tempRoot}`);
  }
  rmSync(tempRoot, { recursive: true, force: true });
}
