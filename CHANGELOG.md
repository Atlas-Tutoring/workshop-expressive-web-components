# Changelog

## Unreleased

- **Breaking:** Renamed the `ws-button` `ghost` variant to `text`. Replace
  `variant="ghost"` with `variant="text"` when upgrading.

All notable changes to `@mihaicristiancondrea/workshop-expressive-web-components` are documented in this file.

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
