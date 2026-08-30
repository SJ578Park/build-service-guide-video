#!/usr/bin/env node

import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const value = (name) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
};

const outArg = value('--out');
const projectName = value('--name') ?? 'Service Operator Guide';
const force = args.includes('--force');

if (!outArg) {
  console.error('Usage: node init-guide-workspace.mjs --out /absolute/path --name "Service Operator Guide" [--force]');
  process.exit(2);
}

const out = resolve(outArg);
if (existsSync(out) && !force) {
  console.error(`Destination already exists: ${out}. Pass --force to add missing files without deleting existing content.`);
  process.exit(2);
}

const skillRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const assetRoot = join(skillRoot, 'assets');
const dirs = [
  'manifests',
  'recordings',
  'stills',
  'narration',
  'renders/chapters',
  'evidence',
  'reports',
];

mkdirSync(out, { recursive: true });
for (const dir of dirs) mkdirSync(join(out, dir), { recursive: true });

const copyIfMissing = (source, destination) => {
  if (!existsSync(destination)) cpSync(source, destination);
};

copyIfMissing(join(assetRoot, 'scenario-matrix.template.md'), join(out, 'scenario-matrix.md'));
copyIfMissing(join(assetRoot, 'video-production-issues.template.md'), join(out, 'video-production-issues.md'));
copyIfMissing(join(assetRoot, 'guide-manifest.example.json'), join(out, 'manifests', 'guide-manifest.example.json'));

const configPath = join(out, 'guide.config.json');
if (!existsSync(configPath)) {
  const config = JSON.parse(readFileSync(join(assetRoot, 'guide-config.example.json'), 'utf8'));
  config.projectName = projectName;
  writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
}

console.log(JSON.stringify({ status: 'ok', workspace: out, projectName, directories: dirs }, null, 2));
