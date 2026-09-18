#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const docsDir = path.join(root, 'docs');

fs.mkdirSync(docsDir, {recursive: true});

// 1. Copy prism-okaidia.css
const prismCssSource = path.join(
  root,
  'node_modules',
  'prismjs',
  'themes',
  'prism-okaidia.css'
);
if (fs.existsSync(prismCssSource)) {
  fs.copyFileSync(prismCssSource, path.join(docsDir, 'prism-okaidia.css'));
}

// 2. Copy dist/foundation to docs/foundation
const foundationSource = path.join(root, 'dist', 'foundation');
const foundationTarget = path.join(docsDir, 'foundation');
if (fs.existsSync(foundationSource)) {
  fs.cpSync(foundationSource, foundationTarget, {recursive: true});
}

// 3. Copy remixicon fonts
const remixFontsSource = path.join(root, 'node_modules', 'remixicon', 'fonts');
const remixFontsTarget = path.join(docsDir, 'remixicon', 'fonts');
if (fs.existsSync(remixFontsSource)) {
  fs.mkdirSync(path.join(docsDir, 'remixicon'), {recursive: true});
  fs.cpSync(remixFontsSource, remixFontsTarget, {recursive: true});
} else {
  console.log(
    'Skipping Remix Icon asset copy; run npm install to fetch remixicon.'
  );
}

console.log('Copied docs assets successfully.');
