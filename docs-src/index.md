---
layout: page.11ty.cjs
title: WorkShop Expressive Web Components ⌲ Home
hideBreadcrumbs: true
---

<h1 class="home-title">
  <strong class="home-title-workshop"><span class="home-title-work">Work</span><span class="home-title-shop">Shop</span></strong>
  <span class="home-title-expressive">Expressive</span><br>
  <span class="home-title-components">Web Components</span>
</h1>

Lit implementations of the WorkShop Expressive primitives. The package includes foundation tokens, navigation surfaces, form controls, compact data controls, and documentation helpers for building expressive web interfaces.

## Install

Install dependencies, build the component library, and import the theme plus the components you need.

```bash
npm install
npm run build
```

```ts
import '@workshop/expressive-web-components/foundation/theme.css';
import '@workshop/expressive-web-components/components/button/ws-button.js';
import '@workshop/expressive-web-components/components/text-field/ws-text-field.js';
import '@workshop/expressive-web-components/components/date-picker/ws-date-picker.js';
import '@workshop/expressive-web-components/components/chip/ws-chip.js';
import '@workshop/expressive-web-components/components/switch/ws-switch.js';
```

The library exposes icon slots and does not inject an icon font into consuming apps. Install Remix Icon when you want to use the icon classes shown in these docs.

```bash
npm install remixicon
```

```ts
import 'remixicon/fonts/remixicon.css';
```

## What is included

- Foundation color, spacing, shape, elevation, motion, and typography tokens.
- Components for buttons, text fields, date pickers, chips, switches, drawers, breadcrumbs, tabs, cards, and code blocks.
- Form-associated text fields and date pickers with native submission, reset, validation, and state restoration.
- Documentation shell components used by this site.

> **Configuration:** Import the foundation theme stylesheet before your component modules so every component receives the expected colors, spacing, typography, shape, elevation, and motion tokens. Import Remix Icon separately only when you use the icon classes shown in these examples.

## Local documentation workflow

Generate the GitHub Pages demo locally when you want to preview the full documentation site:

```bash
npm run docs
```

The generated `/docs/index.html` loads the bundled demo with relative module paths so it works from a GitHub Pages project URL such as `/workshop-expressive-web-components/`.
