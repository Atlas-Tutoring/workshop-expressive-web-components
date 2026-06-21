#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const sourceDir = path.join(root, 'src', 'foundation');
const targetDir = path.join(root, 'dist', 'foundation');

if (!fs.existsSync(sourceDir)) {
  throw new Error(`Foundation source directory not found: ${sourceDir}`);
}

fs.mkdirSync(targetDir, {recursive: true});

for (const entry of fs.readdirSync(sourceDir, {withFileTypes: true})) {
  if (!entry.isFile() || !entry.name.endsWith('.css')) {
    continue;
  }

  fs.copyFileSync(
    path.join(sourceDir, entry.name),
    path.join(targetDir, entry.name)
  );
}

console.log(
  `Copied foundation CSS from ${path.relative(
    root,
    sourceDir
  )} to ${path.relative(root, targetDir)}.`
);
