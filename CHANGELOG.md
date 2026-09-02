# Changelog

All notable changes to `@mihaicristiancondrea/workshop-expressive-web-components` are documented in this file.

## Unreleased

### Added

- Added C++ and Python syntax highlighting to `<ws-code-block>`, including built-in editable language choices and the `c++`, `cxx`, and `py` aliases.
- Added `icon-transition` to `<ws-switch>`, choosing between the rotating icon swap (`rotate`, the default) and a straight cross-fade (`fade`).
- Added `--ws-switch-icon-size`, applied to slotted icons so an inline SVG and an icon-font `<i>` render at the same size.
- Added a reflected `has-icon` attribute on `<ws-switch>`, set while either icon slot has content.
- Added `<ws-color-picker>` for choosing the accent color at runtime: preset swatches, a custom color input, compact popover mode, `localStorage` persistence, and `ws-accent-change` events.
- Added the `--ws-accent` seed token. Every primary role — `--ws-color-primary`, `--ws-color-primary-hover`, `--ws-color-primary-container`, `--ws-color-on-primary-container` — now derives from it, so overriding one pair re-themes the whole system in both schemes.
- Added `--ws-accent-on`, computed from WCAG relative luminance so type stays readable on any accent.
- Added the accent color picker to the documentation app bar, with the choice remembered and applied before first paint.
- Added `foundation/schemes.css`, the light and dark scheme overrides split out of `theme.css`, so the palette can be loaded without `typography.css` and its webfont request.
- Added `data-ws-accent-scope`, which re-declares the accent-derived roles inside a subtree so a scoped `--ws-accent` actually takes effect. `<ws-color-picker>` sets it on any non-root target.
- Added `target` to `<ws-color-picker>`, a CSS selector for the element to theme.
- Added tokens that components referenced but the foundation never defined: `--ws-typography-display-large/medium/small`, `--ws-motion-duration-extra-slow`, `--ws-motion-easing-decelerate`, `--ws-focus-ring-*`, `--ws-color-warning`, and `--ws-color-success`.
- Added a Changelog section to the documentation site at `/changelog/`, generated at build time from this file so there is no second copy to drift.
- Added a GitHub link to the documentation app bar.
- Added `AGENTS.md`, documenting which version is in flight, the requirement that every user-visible change adds an `## Unreleased` entry here, and the project's component, color, and dismissal conventions.
- Added themeable switch parts: `--ws-switch-track-off-background`, `--ws-switch-track-off-border`, `--ws-switch-handle-off-background`, `--ws-switch-handle-off-color`, `--ws-switch-track-on-background`, `--ws-switch-track-on-border`, `--ws-switch-handle-on-background`, `--ws-switch-handle-on-color`, `--ws-switch-handle-off-scale`, `--ws-switch-handle-pressed-scale`, `--ws-switch-state-layer-opacity`, and `--ws-switch-disabled-opacity`.

### Changed

- Contained tabs no longer change foreground or background color on hover, so the moving indicator remains the only selection cue and its travel stays easy to follow.
- `<ws-switch>` keeps its thumb at full size when icons are present, so the glyph has the same room in both states.
- Dark mode now overrides the accent roles instead of reusing the light ones, lightening the accent and its containers so they stay legible on near-black surfaces, and using shadows tuned for those surfaces.
- The hero gradient and the brand mark's SVG gradients now derive from the accent instead of a fixed cyan-to-violet ramp.
- Syntax highlighting tokens moved into the foundation theme, so `<ws-code-block>` picks up the dark scheme through inherited custom properties.
- Consolidated the documentation palette: `docs-src/palette.css` and the palette block in `docs-src/docs.css` both forked the token set with different values, and were removed in favour of `foundation/theme.css`.
- Reworked `<ws-switch>`: the track fills with the primary color when on and the handle grows, so on and off differ in weight rather than only hue. The handle picks up a hover and focus halo and swells while pressed.
- `<ws-color-picker>` now flips its compact popover to the trigger's inline start when it would otherwise open past the viewport edge.

### Fixed

- Fixed standard `<ws-tab>` hover feedback being dropped in Firefox and Safari because it still relied on Chromium-only `:host-context()` styling.
- Fixed contained and vertical tab styling being dropped in Firefox and Safari. It was applied through `:host-context()`, which only Chromium implements, so contained tabs fell back to the standard accent hover, along with the wrong padding, radius, and weight. `<ws-tabs>` now mirrors its `variant` and `orientation` onto each tab.
- Fixed the `<ws-switch>` thumb sitting flush against the track's inner edge when checked while keeping padding at the top and bottom, which read as misaligned. The inset is now derived from the size tokens and is equal on every edge at both ends of the travel.
- Fixed slotted `<ws-switch>` icons shrinking with the off-state thumb; an SVG's own `width` and `height` won over the counter-scaling, so the two icon treatments came out different sizes.
- Fixed component color fallbacks across the library. They used an older slate palette (`#6c5cff`, `#0f172a`, `#e2e8f0`, `#64748b`, `#f5f3ff`, `#f1f5f9`, `#3b82f6`) that no longer matched the foundation tokens, so any component rendered without the theme stylesheet drew from a different palette than one rendered with it.
- Fixed `<ws-code-block>` staying on its light scheme in Firefox and Safari; its dark colors were applied through `:host-context()`, which neither browser supports.
- Fixed `<ws-badge>` tone foregrounds being hardcoded light-theme hues, which left them unreadable on dark surfaces and mismatched against their own backgrounds.
- Fixed the `secondary` button variant falling back to the surface-variant color instead of the secondary container.
- Fixed primary button and dropdown hover states staying purple when the accent changed, by deriving them from `--ws-color-primary-hover`.
- Fixed elevation and motion fallbacks that disagreed with the tokens they were shadowing.
- Fixed `<ws-switch>` being nearly unreadable in dark mode: the handle used a surface token, which put a near-black handle on a near-black track under a shadow that was itself black on black.
- Fixed `<ws-color-picker>`'s popover closing when a drag that began inside it ended outside — selecting text in the panel dismissed it mid-gesture. Dismissal now keys off `pointerdown`, matching `<ws-dropdown>`.
- Fixed `<ws-dialog>` dismissing when a text selection started on the dialog surface and was released over the backdrop. Dismissal now requires the press and the release to both land on the backdrop.
- Component tests now load the foundation stylesheets, so token-dependent behavior is exercised against real values rather than resolving to nothing.

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
