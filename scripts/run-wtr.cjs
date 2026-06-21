#!/usr/bin/env node

const {spawnSync} = require('node:child_process');

const mode = process.argv[2] || 'dev';
if (!['dev', 'prod'].includes(mode)) {
  console.error(`Usage: node scripts/run-wtr.cjs [dev|prod]`);
  process.exit(1);
}

const build = spawnSync('npm', ['run', 'build'], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

if (build.status !== 0) {
  process.exit(build.status ?? 1);
}

const wtrBin = process.platform === 'win32' ? 'wtr.cmd' : 'wtr';
const test = spawnSync(wtrBin, [], {
  env: {...process.env, MODE: mode},
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

process.exit(test.status ?? 1);
