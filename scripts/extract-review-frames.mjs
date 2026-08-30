#!/usr/bin/env node

import { existsSync, mkdirSync } from 'node:fs';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
const value = (name) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
};

const inputArg = value('--input');
const timesArg = value('--times');
const outArg = value('--out') ?? './review-frames';
const ffmpeg = value('--ffmpeg') ?? 'ffmpeg';

if (!inputArg || !timesArg) {
  console.error('Usage: node extract-review-frames.mjs --input video.mp4 --times 108,109 --out ./review-frames [--ffmpeg /path/to/ffmpeg]');
  process.exit(2);
}

const input = resolve(inputArg);
const out = resolve(outArg);
if (!existsSync(input)) {
  console.error(`Input does not exist: ${input}`);
  process.exit(2);
}

const times = timesArg.split(',').map((item) => Number(item.trim()));
if (times.some((time) => !Number.isFinite(time) || time < 0)) {
  console.error('All --times values must be non-negative seconds.');
  process.exit(2);
}

mkdirSync(out, { recursive: true });
const stem = basename(input, extname(input));
const outputs = [];

for (const time of times) {
  const safe = String(time).replace('.', '_');
  const output = join(out, `${stem}-${safe}s.png`);
  const result = spawnSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-ss', String(time), '-i', input, '-frames:v', '1', '-y', output], {
    encoding: 'utf8',
    env: process.env,
  });
  if (result.status !== 0) {
    console.error(result.stderr || `ffmpeg failed for ${time}s`);
    process.exit(result.status ?? 1);
  }
  outputs.push(output);
}

console.log(JSON.stringify({ status: 'ok', input, times, outputs }, null, 2));
