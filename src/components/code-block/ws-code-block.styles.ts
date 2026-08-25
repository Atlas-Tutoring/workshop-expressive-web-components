import {css} from 'lit';

export const wsCodeBlockStyles = css`
  :host {
    display: block;
    font-family: var(
      --ws-code-font-family,
      'Google Sans Code',
      ui-monospace,
      monospace
    );

    /*
     * Private aliases so the shared code tokens can be themed from :root
     * (see foundation/colors.css) while still allowing a per-instance
     * override of --ws-color-code-*. The fallbacks keep the block legible
     * when the foundation stylesheet is not loaded.
     */
    --_code-background: var(--ws-color-code-background, #ffffff);
    --_code-on-background: var(--ws-color-code-on-background, #17171c);
    --_code-border: var(--ws-color-code-border, #e3e6ed);
    --_code-muted: var(--ws-color-code-muted, #626875);
    --_code-button: var(--ws-color-code-button, #f0f2f7);
    --_code-button-hover: var(--ws-color-code-button-hover, #e3e6ed);
    --_code-gutter: var(--ws-color-code-gutter, #f8f9fc);
    --_code-selection: var(
      --ws-color-code-selection,
      color-mix(in srgb, var(--ws-color-primary, #7c5cff) 24%, transparent)
    );
    --_code-caret: var(--ws-color-code-caret, var(--ws-color-primary, #7c5cff));
    --_code-token-comment: var(--ws-color-code-token-comment, #626875);
    --_code-token-keyword: var(--ws-color-code-token-keyword, #5b3ce0);
    --_code-token-string: var(--ws-color-code-token-string, #0f8a5f);
    --_code-token-number: var(--ws-color-code-token-number, #b45a09);
    --_code-token-tag: var(--ws-color-code-token-tag, #1a5fd0);
    --_code-token-attr: var(--ws-color-code-token-attr, #d02a3d);
    --_code-token-punctuation: var(--ws-color-code-token-punctuation, #4a505d);
    --_code-token-operator: var(--ws-color-code-token-operator, #9333d6);
  }

  :host([hidden]) {
    display: none;
  }

  .source {
    display: none;
  }

  .code-block {
    margin: 0;
    overflow: visible;
    border: 1px solid var(--_code-border);
    border-radius: var(--ws-code-block-radius, var(--ws-shape-large, 12px));
    background: var(--_code-background);
    box-shadow: var(--ws-elevation-sm, 0 1px 2px rgb(15 23 42 / 8%));
  }

  :host([editable]:focus-within) .code-block {
    border-color: var(
      --ws-code-editor-focus-color,
      var(--ws-color-primary, #7c5cff)
    );
    box-shadow: 0 0 0 1px
      var(--ws-code-editor-focus-color, var(--ws-color-primary, #7c5cff));
  }

  :host([disabled]) .code-block {
    opacity: 0.56;
  }

  .header {
    min-height: var(--ws-code-block-header-height, 40px);
    padding: 0 var(--ws-spacing-md, 12px);
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--_code-border);
    position: relative;
    z-index: 3;
  }

  .language {
    color: var(--_code-muted);
    font: var(--ws-typography-label-small);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .language-picker {
    --ws-dropdown-small-height: 28px;
    --ws-dropdown-small-padding-inline: 8px;
    --ws-dropdown-menu-min-width: 168px;
    --ws-dropdown-icon-size: 14px;
    --ws-dropdown-icon-spacing: 4px;
    --ws-dropdown-radius: var(--ws-shape-small, 6px);
  }

  .language-picker::part(control) {
    color: var(--_code-muted);
    font: var(--ws-typography-label-small);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .language-picker::part(listbox),
  .language-picker::part(option) {
    text-transform: none;
    letter-spacing: normal;
  }

  .readonly-code {
    margin: 0;
    overflow: auto;
    padding: var(--ws-spacing-lg, 16px);
    border-end-start-radius: var(
      --ws-code-block-radius,
      var(--ws-shape-large, 12px)
    );
    border-end-end-radius: var(
      --ws-code-block-radius,
      var(--ws-shape-large, 12px)
    );
  }

  code,
  .editor,
  .line-numbers {
    font: var(--ws-typography-code);
    line-height: var(--ws-code-editor-line-height, 1.6);
    tab-size: var(--ws-code-tab-size, 2);
  }

  code {
    white-space: pre;
    color: var(--_code-on-background);
  }

  .editor-shell {
    position: relative;
    min-inline-size: 0;
    overflow: hidden;
    background: var(--_code-background);
    border-end-start-radius: var(
      --ws-code-block-radius,
      var(--ws-shape-large, 12px)
    );
    border-end-end-radius: var(
      --ws-code-block-radius,
      var(--ws-shape-large, 12px)
    );
  }

  .editor-shell.with-line-numbers {
    padding-inline-start: var(--ws-code-editor-gutter-width, 48px);
  }

  .editor-stack {
    position: relative;
    min-inline-size: 0;
  }

  .highlight-layer,
  .editor {
    box-sizing: border-box;
    inline-size: 100%;
    min-block-size: var(--ws-code-editor-min-height, 192px);
    margin: 0;
    border: 0;
    padding: var(--ws-code-editor-padding, var(--ws-spacing-lg, 16px));
    white-space: pre;
    overflow: auto;
  }

  .highlight-layer {
    position: absolute;
    inset: 0;
    pointer-events: none;
    color: var(--_code-on-background);
    background: transparent;
    scrollbar-width: none;
  }

  .highlight-layer::-webkit-scrollbar {
    display: none;
  }

  .editor {
    position: relative;
    z-index: 1;
    display: block;
    resize: vertical;
    outline: 0;
    background: transparent;
    color: transparent;
    caret-color: var(--_code-caret);
    -webkit-text-fill-color: transparent;
  }

  .editor::selection {
    background: var(--_code-selection);
  }

  .editor::placeholder {
    color: var(--_code-muted);
    -webkit-text-fill-color: var(--_code-muted);
    opacity: 0.82;
  }

  .editor[readonly] {
    cursor: text;
  }

  .editor:disabled {
    cursor: not-allowed;
  }

  .line-numbers {
    position: absolute;
    inset-block: 0;
    inset-inline-start: 0;
    z-index: 2;
    box-sizing: border-box;
    inline-size: var(--ws-code-editor-gutter-width, 48px);
    min-inline-size: 0;
    margin: 0;
    overflow: hidden;
    border-inline-end: 1px solid var(--_code-border);
    padding: var(--ws-code-editor-padding, var(--ws-spacing-lg, 16px))
      var(--ws-spacing-sm, 8px);
    color: var(--_code-muted);
    background: var(--_code-gutter);
    text-align: end;
    user-select: none;
    pointer-events: none;
  }

  .token.comment {
    color: var(--_code-token-comment);
  }
  .token.keyword {
    color: var(--_code-token-keyword);
  }
  .token.string {
    color: var(--_code-token-string);
  }
  .token.number {
    color: var(--_code-token-number);
  }
  .token.tag {
    color: var(--_code-token-tag);
  }
  .token.attr {
    color: var(--_code-token-attr);
  }
  .token.punctuation {
    color: var(--_code-token-punctuation);
  }
  .token.operator {
    color: var(--_code-token-operator);
  }

  .copy-button {
    border: 0;
    border-radius: var(--ws-shape-small, 6px);
    padding: var(--ws-code-copy-padding-block, var(--ws-spacing-xs, 4px))
      var(--ws-code-copy-padding-inline, var(--ws-spacing-md, 12px));
    cursor: pointer;
    color: var(--_code-on-background);
    background: var(--_code-button);
    font: var(--ws-typography-label-small);
    transition: background-color var(--ws-motion-duration-fast, 120ms)
        var(--ws-motion-easing-standard, ease),
      transform var(--ws-motion-duration-fast, 120ms)
        var(--ws-motion-easing-standard, ease);
  }

  .copy-button:focus-visible {
    outline: var(--ws-focus-ring-inner-size, 2px) solid
      var(--_code-on-background);
    outline-offset: var(--ws-spacing-xs, 4px);
  }

  .copy-button:hover:not(:disabled) {
    background: var(--_code-button-hover);
  }

  .copy-button:active:not(:disabled) {
    transform: scale(0.985);
  }

  .copy-button:disabled {
    cursor: not-allowed;
  }

  @media (prefers-reduced-motion: reduce) {
    .copy-button {
      transition-duration: 1ms;
    }
  }
`;
