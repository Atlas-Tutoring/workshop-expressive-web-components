#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const read = (filePath) => {
  const fullPath = path.join(root, filePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(
      `${filePath} does not exist. Run npm run docs before npm run docs:verify.`
    );
  }

  return fs.readFileSync(fullPath, 'utf8');
};

const checks = [];
const addCheck = (filePath, description, pattern) => {
  const content = read(filePath);
  const passed =
    pattern instanceof RegExp
      ? pattern.test(content)
      : content.includes(pattern);
  checks.push({filePath, description, passed});
};

const requiredCssSelectors = [
  ':root[data-ws-theme',
  'body',
  '.docs-content code:not([class])',
  ".docs-content pre[class*='language-']",
  '.demo-panel',
  '.button-row',
  '.token-grid',
  '.shape-swatch',
  '.color-swatch',
  'table',
  '.site-nav',
  '.site-logo',
  '.home-title',
  '.theme-switch',
  '.examples',
  '.collection',
  '.example-content',
  '.example-toc',
  '.card-grid',
  '.component-demo',
  '.tabs-demo-grid',
  '.lit-link',
  '--ws-color-code-background',
  '@media (max-width: 760px)',
];

for (const selector of requiredCssSelectors) {
  addCheck('docs-src/docs.css', `docs CSS contains ${selector}`, selector);
}

const requiredHomeSource = [
  '<h1 class="home-title">',
  '<span class="home-title-shop">Shop</span>',
  '<span class="home-title-components">Web Components</span>',
  '<div class="demo-panel intro-panel">',
  '## What is included',
  '> **Configuration:** Import the foundation theme stylesheet',
  '## Local documentation workflow',
  '```bash',
  '```ts',
];

for (const snippet of requiredHomeSource) {
  addCheck('docs-src/index.md', `home source contains ${snippet}`, snippet);
}

const requiredPageTemplate = [
  '<ws-docs-shell>',
  '<ws-page>',
  '<div class="docs-content">',
  'data-theme-toggle',
  "localStorage.getItem('ws-docs-theme')",
  "localStorage.setItem('ws-docs-theme'",
  'footer(data)',
];

for (const snippet of requiredPageTemplate) {
  addCheck(
    'docs-src/_includes/page.11ty.cjs',
    `page template contains ${snippet}`,
    snippet
  );
}

const requiredNavTemplate = [
  '<ws-app-bar class="site-nav"',
  '<ws-tabs class="site-tabs"',
  '<a class="site-logo" slot="leading"',
  '<ws-brand-mark mark-only size="40px"',
  '<ws-switch slot="trailing" class="theme-switch"',
  'https://mihaicristiancondrea.github.io/workshop-expressive-web-components/',
  "{url: siteUrl, route: '/', label: 'Home'",
  "url: new URL('examples/', siteUrl).href",
];

for (const snippet of requiredNavTemplate) {
  addCheck(
    'docs-src/_includes/nav.11ty.cjs',
    `nav template contains ${snippet}`,
    snippet
  );
}

const requiredExampleTemplate = [
  'const deploymentUrl = (route)',
  '<section class="examples">',
  '<nav class="collection"',
  '<div class="example-content">',
  '<aside class="example-toc"',
  'Table of contents',
  'IntersectionObserver',
];

for (const snippet of requiredExampleTemplate) {
  addCheck(
    'docs-src/_includes/example.11ty.cjs',
    `example template contains ${snippet}`,
    snippet
  );
}

addCheck(
  'docs-src/_includes/footer.11ty.cjs',
  'footer template renders ws-footer',
  '<ws-footer>'
);

const requiredGeneratedExamplesIndex = [
  '<link rel="stylesheet" href="../docs.css">',
  '<script type="module" src="../ws-button.bundled.js"></script>',
  '<ws-docs-shell>',
  '<ws-app-bar class="site-nav"',
  '<ws-tabs class="site-tabs"',
  '<a class="site-logo" slot="leading"',
  '<ws-brand-mark mark-only size="40px"',
  '<ws-switch slot="trailing" class="theme-switch"',
  '<ws-page>',
  '<div class="docs-content">',
  '<section class="examples">',
  '<nav class="collection"',
  '<div class="example-content">',
  '<aside class="example-toc"',
  '<ws-footer>',
  "localStorage.setItem('ws-docs-theme'",
];

for (const snippet of requiredGeneratedExamplesIndex) {
  addCheck(
    'docs/examples/index.html',
    `generated examples index contains ${snippet}`,
    snippet
  );
}

const siteUrl =
  'https://mihaicristiancondrea.github.io/workshop-expressive-web-components/';
const examplesUrl = new URL('examples/', siteUrl).href;
for (const filePath of [
  'docs/index.html',
  'docs/examples/index.html',
  'docs/examples/drawer/index.html',
]) {
  addCheck(
    filePath,
    'top navigation has a stable Home URL',
    `href="${siteUrl}"`
  );
  addCheck(
    filePath,
    'top navigation has a stable Examples URL',
    `href="${examplesUrl}"`
  );
}

addCheck(
  'docs/examples/drawer/index.html',
  'nested examples page selects the Examples tab',
  `<ws-tab selected href="${examplesUrl}" aria-current="page">`
);

for (const filePath of [
  'docs/examples/index.html',
  'docs/examples/text-field/index.html',
  'docs/examples/breadcrumbs/index.html',
]) {
  addCheck(
    filePath,
    'component navigation has a stable Text field URL',
    `href="${new URL('examples/text-field/', siteUrl).href}"`
  );
  addCheck(
    filePath,
    'component navigation has a stable Breadcrumbs URL',
    `href="${new URL('examples/breadcrumbs/', siteUrl).href}"`
  );
}

const requiredBundledElements = [
  'ws-app-bar',
  'ws-brand-mark',
  'ws-breadcrumbs',
  'ws-button',
  'ws-card',
  'ws-chip',
  'ws-code-block',
  'ws-date-picker',
  'ws-docs-shell',
  'ws-drawer',
  'ws-drawer-item',
  'ws-footer',
  'ws-hero',
  'ws-page',
  'ws-switch',
  'ws-tab',
  'ws-tabs',
  'ws-text-field',
];

for (const elementName of requiredBundledElements) {
  addCheck(
    'docs/ws-button.bundled.js',
    `docs bundle registers ${elementName}`,
    elementName
  );
}

addCheck(
  'docs/foundation/theme.css',
  'generated docs include the imported foundation theme',
  "@import url('./colors.css')"
);

const exampleFiles = fs
  .readdirSync(path.join(root, 'docs-src/examples'))
  .filter((file) => file.endsWith('.md'))
  .sort();

const requiredSections = [
  '## Live demo',
  '## Code',
  '## API',
  '## Slots',
  '## Events',
  '## Accessibility notes',
  '## Design notes',
];

for (const file of exampleFiles) {
  const filePath = `docs-src/examples/${file}`;
  addCheck(filePath, 'example source has a title', /^title: /m);
  addCheck(filePath, 'example source has an intro paragraph', /---\n\n<p>/);
  for (const section of requiredSections) {
    addCheck(filePath, `example source contains ${section}`, section);
  }
}

const failures = checks.filter((check) => !check.passed);

if (failures.length) {
  console.error('Documentation structure verification failed:');
  for (const failure of failures) {
    console.error(`- ${failure.filePath}: ${failure.description}`);
  }
  process.exit(1);
}

console.log(
  `Documentation structure verification passed (${checks.length} checks).`
);
