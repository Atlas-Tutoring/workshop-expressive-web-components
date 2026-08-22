# Changelog

## Unreleased

### Added

- Added `primary`, `secondary`, `outlined`, and `text` visual variants to `<ws-dropdown>`, aligned with `<ws-button>`.
- Added button-aligned small, medium, and large dropdown sizing, animated chevron rotation, reduced-motion handling, and dropdown CSS parts.
- Added icon-only dropdown triggers, a customizable `icon` slot with the existing arrow as its fallback, and configurable icon rotation through `rotate-icon`.
- Added `contained` tabs for compact local view switching, value-driven button tabs, and the new `<ws-tab-panel>` component with automatic panel synchronization and keyboard navigation.
- Added `<ws-dialog>` with native modal top-layer behavior, Atlas-style blurred backdrops, composable content and action slots, responsive layout, and close/cancel events.

### Changed

- Animated the dropdown menu surface itself when opening and closing, using a clipped expansion, subtle movement, and opacity while preserving reduced-motion behavior.
- Expanded `<ws-tabs>` beyond navigation-only usage while preserving existing `href`-based tab behavior.
- Aligned contained-tab geometry and interaction with the Atlas Edit / Preview control, including its compact 3px inset, 11px outer radius, 8px selected surface, and quiet interaction treatment.
- Kept contained-tab colors tied to semantic Workshop tokens so Atlas dark and light themes provide the bar, selected surface, text, focus, and elevation colors directly.
- Animated the contained selected-surface background during indicator movement, blending only between the active theme's `secondary-container` and `surface-variant` colors and respecting reduced-motion preferences.
- Standardized component documentation spacing, section hierarchy, demo surfaces, and tables, and removed the redundant tabs panel-switching demo.

All notable changes to `@mihaicristiancondrea/workshop-expressive-web-components` are documented in this file.

## 0.3.0

### Added

- Added multiline `type="textarea"` support to `<ws-text-field>` with configurable rows, native form and validation behavior, and vertical resizing by default.
- Added `--ws-text-field-resize` and `--ws-text-field-textarea-padding-block` customization hooks for multiline fields.

## 0.2.2

### Changed

- **Breaking:** Renamed the `ws-button` `ghost` variant to `text`. Replace
  `variant="ghost"` with `variant="text"` when upgrading.
- Updated CI, documentation, and npm publishing jobs to Node.js 24.
- Retired the legacy-browser development-server plugin and its obsolete polyfills.
- Replaced the deprecated Rimraf dependency with the platform cleanup command.

### Fixed

- Advanced the package version so the corrected release can be published to npm.

## 0.2.1

### Changed

- Added consistent spacing between documentation code blocks.
- Made the brand-mark bounce more subtle.
- Kept chips level on hover and smoothed their size-change animation.

## 0.2.0

### Added

- Added the form-associated `<ws-text-field>` component with text, email, password, number, URL, telephone, and search input types.
- Added native form submission, reset, validation, disabled-fieldset handling, state restoration, helper and error messages, icon slots, clear behavior, and size and shape variants for text fields.
- Added the `<ws-chip>` component with assist, filter, input, and status variants, semantic tones, selection, removal events, icon slots, and small and medium sizes.
- Added the form-associated `<ws-date-picker>` component with the platform calendar, date constraints, validation, clear behavior, three sizes, and native form participation.
- Added documentation pages, live examples, package exports, custom-element registration, and browser tests for the new components.
- Added pull-request and `main` branch CI covering linting, compilation, browser tests, documentation generation, documentation verification, and package dry runs.
- Added release-driven npm publishing with version-tag validation and npm provenance.

### Changed

- Improved chip size transitions so switching between small and medium feels fluid.
- Corrected leading-icon alignment inside chips, including Remix Icon glyphs and custom slotted icons.
- Simplified the GitHub Pages workflow and made documentation verification a deployment requirement.
- Standardized automated workflows on Node.js 22.

### Fixed

- Fixed TypeScript DOM-property compatibility for `inputMode` and `autocomplete` in `<ws-text-field>`.
- Fixed documentation bundle registration for `<ws-text-field>` and `<ws-chip>`.

## 0.1.0

### Added

- Initial Workshop Expressive component library release.
- Added foundation tokens, buttons, navigation components, tabs, cards, switches, code blocks, layout surfaces, and documentation helpers.