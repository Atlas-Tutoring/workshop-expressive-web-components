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
    --ws-color-code-background: #ffffff;
    --ws-color-code-on-background: #0f172a;
    --ws-color-code-border: #e2e8f0;
    --ws-color-code-muted: #64748b;
    --ws-color-code-button: #f1f5f9;
    --ws-color-code-button-hover: #e2e8f0;
    --ws-color-code-gutter: #f8fafc;
    --ws-color-code-selection: rgb(108 92 255 / 24%);
    --ws-color-code-caret: #6c5cff;
    --ws-color-code-token-comment: #64748b;
    --ws-color-code-token-keyword: #7c3aed;
    --ws-color-code-token-string: #047857;
    --ws-color-code-token-number: #c2410c;
    --ws-color-code-token-tag: #2563eb;
    --ws-color-code-token-attr: #be123c;
    --ws-color-code-token-punctuation: #475569;
    --ws-color-code-token-operator: #9333ea;
  }

  :host-context(:root[data-ws-theme='dark']),
  :host-context([data-ws-theme='dark']) {
    --ws-color-code-background: #030304;
    --ws-color-code-on-background: #f7f7fa;
    --ws-color-code-border: #1c1c20;
    --ws-color-code-muted: #8f8f9b;
    --ws-color-code-button: #101014;
    --ws-color-code-button-hover: #18181d;
    --ws-color-code-gutter: #08080a;
    --ws-color-code-selection: rgb(155 135 255 / 28%);
    --ws-color-code-caret: #c6b8ff;
    --ws-color-code-token-comment: #8f8f9b;
    --ws-color-code-token-keyword: #c6b8ff;
    --ws-color-code-token-string: #72e0b1;
    --ws-color-code-token-number: #ffbd73;
    --ws-color-code-token-tag: #82baff;
    --ws-color-code-token-attr: #ff9daa;
    --ws-color-code-token-punctuation: #b8b8c2;
    --ws-color-code-token-operator: #e7a8ff;
  }

  :host([hidden]) {
    display: none;
  }

  .source {
    display: none;
  }

  .code-block {
    margin: 0;
    overflow: hidden;
    border: 1px solid var(--ws-color-code-border);
    border-radius: var(--ws-code-block-radius, var(--ws-shape-large, 12px));
    background: var(--ws-color-code-background);
    box-shadow: var(--ws-elevation-sm, 0 1px 2px rgb(15 23 42 / 8%));
  }

  :host([editable]:focus-within) .code-block {
    border-color: var(--ws-code-editor-focus-color, var(--ws-color-primary, #6c5cff));
    box-shadow: 0 0 0 1px
      var(--ws-code-editor-focus-color, var(--ws-color-primary, #6c5cff));
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
    border-bottom: 1px solid var(--ws-color-code-border);
  }

  .language {
    color: var(--ws-color-code-muted);
    font: var(--ws-typography-label-small);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .readonly-code {
    margin: 0;
    overflow: auto;
    padding: var(--ws-spacing-lg, 16px);
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
    color: var(--ws-color-code-on-background);
  }

  .editor-shell {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    min-inline-size: 0;
    background: var(--ws-color-code-background);
  }

  .editor-shell.with-line-numbers {
    grid-template-columns: auto minmax(0, 1fr);
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
    color: var(--ws-color-code-on-background);
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
    caret-color: var(--ws-color-code-caret);
    -webkit-text-fill-color: transparent;
  }

  .editor::selection {
    background: var(--ws-color-code-selection);
  }

  .editor::placeholder {
    color: var(--ws-color-code-muted);
    -webkit-text-fill-color: var(--ws-color-code-muted);
    opacity: 0.82;
  }

  .editor[readonly] {
    cursor: text;
  }

  .editor:disabled {
    cursor: not-allowed;
  }

  .line-numbers {
    box-sizing: border-box;
    min-inline-size: var(--ws-code-editor-gutter-width, 48px);
    max-block-size: none;
    margin: 0;
    overflow: hidden;
    border-inline-end: 1px solid var(--ws-color-code-border);
    padding: var(--ws-code-editor-padding, var(--ws-spacing-lg, 16px))
      var(--ws-spacing-sm, 8px);
    color: var(--ws-color-code-muted);
    background: var(--ws-color-code-gutter);
    text-align: end;
    user-select: none;
  }

  .token.comment {
    color: var(--ws-color-code-token-comment);
  }
  .token.keyword {
    color: var(--ws-color-code-token-keyword);
  }
  .token.string {
    color: var(--ws-color-code-token-string);
  }
  .token.number {
    color: var(--ws-color-code-token-number);
  }
  .token.tag {
    color: var(--ws-color-code-token-tag);
  }
  .token.attr {
    color: var(--ws-color-code-token-attr);
  }
  .token.punctuation {
    color: var(--ws-color-code-token-punctuation);
  }
  .token.operator {
    color: var(--ws-color-code-token-operator);
  }

  .copy-button {
    border: 0;
    border-radius: var(--ws-shape-small, 6px);
    padding: var(--ws-code-copy-padding-block, var(--ws-spacing-xs, 4px))
      var(--ws-code-copy-padding-inline, var(--ws-spacing-md, 12px));
    cursor: pointer;
    color: var(--ws-color-code-on-background);
    background: var(--ws-color-code-button);
    font: var(--ws-typography-label-small);
    transition: background-color var(--ws-motion-duration-fast, 120ms)
        var(--ws-motion-easing-standard, ease),
      transform var(--ws-motion-duration-fast, 120ms)
        var(--ws-motion-easing-standard, ease);
  }

  .copy-button:focus-visible {
    outline: var(--ws-focus-ring-inner-size, 2px) solid
      var(--ws-color-code-on-background);
    outline-offset: var(--ws-spacing-xs, 4px);
  }

  .copy-button:hover:not(:disabled) {
    background: var(--ws-color-code-button-hover);
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
