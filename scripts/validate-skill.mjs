#!/usr/bin/env node

import { existsSync, lstatSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];

const required = [
  'SKILL.md',
  'README.md',
  'LICENSE',
  'agents/openai.yaml',
  'references/workflow.md',
  'references/screen-capture-surfaces.md',
  'references/case-study.md',
  'assets/guide-config.example.json',
  'assets/guide-manifest.example.json',
  'scripts/init-guide-workspace.mjs',
  'scripts/validate-guide-manifest.mjs',
  'scripts/extract-review-frames.mjs',
];

for (const relative of required) {
  if (!existsSync(join(root, relative))) failures.push(`missing required file: ${relative}`);
}

const skill = readFileSync(join(root, 'SKILL.md'), 'utf8');
const frontmatter = skill.match(/^---\n([\s\S]*?)\n---\n/);
if (!frontmatter) {
  failures.push('SKILL.md must start with YAML frontmatter');
} else {
  if (!/^name:\s*build-service-guide-video\s*$/m.test(frontmatter[1])) {
    failures.push('SKILL.md frontmatter name must be build-service-guide-video');
  }
  const description = frontmatter[1].match(/^description:\s*(.+)$/m)?.[1]?.trim();
  if (!description || description.length < 40) {
    failures.push('SKILL.md needs a discriminating description');
  }
}

const openaiYaml = readFileSync(join(root, 'agents/openai.yaml'), 'utf8');
if (!openaiYaml.includes('$build-service-guide-video')) {
  failures.push('agents/openai.yaml default_prompt must mention $build-service-guide-video');
}

const ignoredDirs = new Set(['.git', 'node_modules', 'output', 'review-frames']);
const files = [];
const walk = (directory) => {
  for (const name of readdirSync(directory)) {
    if (ignoredDirs.has(name)) continue;
    const path = join(directory, name);
    const stat = lstatSync(path);
    if (stat.isSymbolicLink()) continue;
    if (stat.isDirectory()) walk(path);
    else files.push(path);
  }
};
walk(root);

const markdownFiles = files.filter((path) => extname(path) === '.md');
for (const file of markdownFiles) {
  const text = readFileSync(file, 'utf8');
  const links = text.matchAll(/\[[^\]]+\]\(([^)]+)\)/g);
  for (const match of links) {
    const href = match[1].trim().replace(/^<|>$/g, '');
    if (/^(https?:|mailto:|#)/.test(href)) continue;
    const relative = href.split('#')[0];
    if (!relative) continue;
    if (!existsSync(resolve(dirname(file), relative))) {
      failures.push(`${file.slice(root.length + 1)} has broken link: ${href}`);
    }
  }
}

const privateTokens = [
  ['happy', 'return'].join('-'),
  ['trainee', 'portal'].join('-'),
  ['h', 'r', 'c', 'c'].join(''),
  ['Guide', 'Pass'].join(''),
];

for (const file of files) {
  if (extname(file) === '.png') continue;
  const text = readFileSync(file, 'utf8');
  if (/\/Users\/[^/\s]+\//.test(text)) {
    failures.push(`${file.slice(root.length + 1)} contains a local absolute user path`);
  }
  for (const token of privateTokens) {
    if (text.toLowerCase().includes(token.toLowerCase())) {
      failures.push(`${file.slice(root.length + 1)} contains a private case-study token`);
    }
  }
}

const report = {
  status: failures.length === 0 ? 'pass' : 'fail',
  checkedFiles: files.length,
  markdownFiles: markdownFiles.length,
  failures,
};

console.log(JSON.stringify(report, null, 2));
process.exit(failures.length === 0 ? 0 : 1);
