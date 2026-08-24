# Changelog

All notable changes to `@mihaicristiancondrea/workshop-expressive-web-components` are documented in this file.

## Unreleased

## 0.3.2

### Added

- Expanded `<ws-dropdown>` with `mode="menu"` for immediate commands that do not retain a selected value or participate in form submission.
- Added composed `ws-dropdown-action` events, menu/menuitem semantics, keyboard navigation, outside-click and Escape dismissal, focus restoration, and viewport-safe popup positioning for command menus.
- Added configurable dropdown checkmarks through `checkmark="auto|always|none"` and semantic destructive actions through `data-tone="danger"`.
- Added `trigger-label` so command menus can use a visible text trigger instead of being limited to icon-only overflow buttons; text triggers can still use the default chevron or a custom trigger icon.

### Changed

- Unified contextual action menus with `<ws-dropdown>` so selection dropdowns and command menus share trigger variants, sizes, popup animation, icon handling, and positioning behavior.
- Added animated `<ws-dialog>` closing motion for both the dialog surface and backdrop while preserving reduced-motion behavior.
- Expanded dropdown documentation with text-only choices, icon choices, destructive commands, icon-only command triggers, and labeled command triggers.

### Fixed

- Fixed dropdown choice icons supplied by global icon-font classes so their glyphs and font family remain visible after the choices are rendered inside the component shadow DOM.
- Fixed dropdown option icons inheriting the browser's default italic `<i>` styling; reconstructed icon-font glyphs now render upright with normal font weight.

## 0.3.1

### Added

- Added `primary`, `secondary`, `outlined`, and `text` visual variants to `<ws-dropdown>`, with button-aligned small, medium, and large sizes.
- Added icon-only dropdown triggers, customizable trigger icons, configurable icon rotation, and optional per-choice icons without reserving empty icon space for text-only choices.
- Added `contained` tabs for compact local view switching, value-driven button tabs, and `<ws-tab-panel>` with automatic panel synchronization and keyboard navigation.
- Added `<ws-dialog>` with native modal top-layer behavior, blurred backdrops, composable content and action slots, responsive layout, and close/cancel events.
- Added form-associated `<ws-time-picker>` with editable `HH:mm` values, hour/minute selection, configurable minute steps, time ranges, validation, clear behavior, and small, medium, and large sizes.
- Added editable `<ws-code-block>` mode with live syntax highlighting, synchronized line numbers, native textarea editing, Tab/Shift+Tab indentation, readonly and disabled states, configurable rows and tab size, and composed input/change events.
- Added an editable code-language picker with configurable `languageOptions` and `ws-code-language-change` events.

### Changed

- Animated the dropdown popup surface while opening and closing with clipped expansion, subtle movement, opacity, and reduced-motion support.
- Expanded `<ws-tabs>` beyond navigation-only usage while preserving existing `href`-based tab behavior.
- Aligned contained-tab geometry, interaction, motion, and semantic colors with the Atlas Edit / Preview control.
- Added progressive, caret-aware typing to `<ws-date-picker>` and `<ws-time-picker>`, including automatic separators, compact-input and paste normalization, canonical completed values, and omission of incomplete edits from form submission.
- Aligned `<ws-dialog>` body spacing, typography, desktop action placement, and mobile action layout with the backend course dialogs.
- Standardized component documentation spacing, section hierarchy, demo surfaces, and API tables.

### Fixed

- Fixed contained-tab contrast in both documentation themes and prevented contained tabs from changing foreground or background color on hover.
- Made contained-tab indicator motion deterministic, preserved pending animations across resize observation, and kept reverse animations continuous from the indicator's visible position.
- Fixed `<ws-dialog>` action-slot layout so desktop actions reliably stay grouped at the bottom-right.
- Fixed editable `<ws-code-block>` sizing when code grows beyond the configured rows so line numbers, syntax highlighting, and both scroll directions stay aligned with the textarea viewport.
- Preserved the time-picker caret when hour input is normalized during progressive typing.
- Kept the standard tabs documentation demos on the current page instead of navigating to nonexistent GitHub Pages routes.
- Updated dependency overrides and lockfile resolutions for reported dependency security advisories.

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
- Added native form submission, reset, validation, disabled-fieldset handling, state restoration, helper and error messages, icon slots, clear behavior, and size and shape variants.
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
