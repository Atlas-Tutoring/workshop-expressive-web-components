#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const targets = process.argv.slice(2);

if (targets.length === 0) {
  targets.push('dist');
}

for (const target of targets) {
  const fullPath = path.resolve(root, target);
  try {
    fs.rmSync(fullPath, {recursive: true, force: true});
  } catch (err) {
    console.error(`Failed to remove ${fullPath}:`, err);
  }
}
