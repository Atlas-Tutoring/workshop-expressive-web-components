---
layout: example.11ty.cjs
title: Workshop Expressive Web Components ⌲ Examples ⌲ Code block
tags: example
name: Code block
description: Read-only and editable code surfaces with Workshop syntax highlighting
order: 8
---

<p><code>ws-code-block</code> handles both reusable read-only snippets and lightweight code editing. Editable blocks keep the same Workshop syntax palette while using a real textarea for native selection, undo and redo, paste, IME input, and accessibility. Their header also exposes the syntax language as a Workshop dropdown so users can change highlighting without leaving the editor.</p>

## Live demo

### Editable

<div class="demo-panel component-demo">
  <ws-code-block
    language="typescript"
    editable
    copy
    rows="9"
    aria-label="TypeScript example editor"
  >const greet = (name: string) => {
  return `Hello, ${name}!`;
};

console.log(greet('Workshop'));</ws-code-block>
</div>

Use the language dropdown in the editor header to switch syntax highlighting. Try typing, selecting multiple lines, and pressing <kbd>Tab</kbd> or <kbd>Shift</kbd> + <kbd>Tab</kbd>. The highlighted layer, line-number gutter, and editor scroll position remain synchronized.

The built-in language list contains Plain text, HTML, CSS, JavaScript, TypeScript, JSON, Markdown, XML, and SVG. Products can replace this list through the `languageOptions` property.

### Read-only

<div class="demo-panel component-demo">
  <ws-code-block language="html" copy>
<template>
<ws-button variant="primary">
  <i slot="icon" class="ri-add-line" aria-hidden="true"></i>
  Create
</ws-button>
</template>
  </ws-code-block>
</div>

Read-only blocks intentionally keep a static language label instead of a selector.

## Code

```html
<!-- Editable: the language label becomes a dropdown automatically. -->
<ws-code-block
  language="typescript"
  editable
  copy
  rows="9"
  aria-label="TypeScript example editor"
>const answer = 42;
console.log(answer);</ws-code-block>

<!-- Read-only -->
<ws-code-block language="html" copy>
  <template>
    <ws-button variant="primary">Create</ws-button>
  </template>
</ws-code-block>
```

Use the `code` property when application state owns the editor value:

```js
const editor = document.querySelector('#exercise-editor');

editor.code = exercise.starterCode;

editor.addEventListener('input', () => {
  exercise.code = editor.code;
});

editor.addEventListener('ws-code-language-change', (event) => {
  exercise.language = event.detail.language;
});
```

Products can provide a focused language list instead of the defaults:

```js
editor.languageOptions = [
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'java', label: 'Java' },
];
editor.language = 'kotlin';
```

Unknown or product-defined languages remain valid values. When Workshop does not have a tokenizer for that language yet, the editor still works and renders the source as plain text.

## API

| Property          | Type                             | Default         | Description                                                                  |
| ----------------- | -------------------------------- | --------------- | ---------------------------------------------------------------------------- |
| `language`        | `string`                         | `'text'`        | Current language and syntax-highlighting hint.                               |
| `languageOptions` | `WsCodeLanguageOption[]`         | built-in list   | Property-only list offered by the editable language dropdown.                |
| `code`            | `string`                         | `''`            | Code source. In editable mode this is updated as the user types.             |
| `copy`            | `boolean`                        | `false`         | Shows a copy button for the current code.                                    |
| `editable`        | `boolean`                        | `false`         | Replaces the read-only renderer with the highlighted editor and language UI. |
| `readonly`        | `boolean`                        | `false`         | Prevents code and language edits while preserving selection and copy.        |
| `disabled`        | `boolean`                        | `false`         | Disables the editor, language selector, and copy action.                     |
| `line-numbers`    | `boolean`                        | `true`          | Shows the synchronized line-number gutter in editable mode.                  |
| `tab-size`        | `number`                         | `2`             | Number of spaces inserted or removed by Tab and Shift+Tab.                   |
| `rows`            | `number`                         | `8`             | Initial editable textarea height hint.                                       |
| `placeholder`     | `string`                         | `''`            | Placeholder shown by an empty editable block.                                |
| `aria-label`      | `string`                         | `'Code editor'` | Accessible name for the editable textarea.                                   |

`WsCodeLanguageOption` has the shape `{ value: string; label: string }`. `tab-size` is clamped from 1 to 8. `rows` has a minimum of 2.

## Slots

| Slot    | Description                                                                                                                 |
| ------- | --------------------------------------------------------------------------------------------------------------------------- |
| default | Initial code source. Wrap read-only HTML snippets in a `template` so the browser does not render them as live components. |

For application-controlled editors, prefer the `code` property. Slotted text is useful for declarative starter code and remains editable once the user begins typing.

## Events

| Event                     | Detail         | Description                                                                     |
| ------------------------- | -------------- | ------------------------------------------------------------------------------- |
| `input`                   | —              | Bubbles and crosses the shadow boundary whenever editable code changes.         |
| `change`                  | —              | Bubbles and crosses the shadow boundary when the native code editor commits.    |
| `ws-code-language-change` | `{ language }` | Fired when the editable language dropdown changes syntax mode.                  |
| `ws-code-copy`            | `{ code }`     | Fired after the current code is copied successfully.                            |

Language selection deliberately uses its own event instead of re-emitting the dropdown's generic `change`, so product code can distinguish source edits from syntax-mode changes.

## Keyboard behavior

| Key             | Editable behavior                                              |
| --------------- | -------------------------------------------------------------- |
| `Tab`           | Inserts `tab-size` spaces or indents every selected line.      |
| `Shift` + `Tab` | Removes up to `tab-size` leading spaces from the current lines. |
| `Escape`, `Tab` | Lets Tab move focus out of the editor instead of indenting.     |

The language dropdown follows the normal `ws-dropdown` keyboard behavior. Modified Tab shortcuts using Ctrl, Alt, or Meta are never intercepted. All other editing behavior stays native to the browser, including selection, undo and redo, clipboard commands, IME composition, and platform text-navigation shortcuts.

## CSS parts

| Part              | Description                                      |
| ----------------- | ------------------------------------------------ |
| `header`          | Language and action header.                      |
| `language`        | Read-only language label.                        |
| `language-picker` | Editable Workshop language dropdown.             |
| `code`            | Read-only highlighted code surface.              |
| `editor`          | Native editable textarea.                        |
| `line-numbers`    | Synchronized editable line-number gutter.        |
| `copy-button`     | Copy action.                                      |

## CSS custom properties

```css
ws-code-block {
  --ws-code-block-radius: 12px;
  --ws-code-editor-min-height: 192px;
  --ws-code-editor-padding: 16px;
  --ws-code-editor-line-height: 1.6;
  --ws-code-editor-gutter-width: 48px;
  --ws-code-editor-focus-color: var(--ws-color-primary);
}
```

The existing `--ws-color-code-*` syntax and surface tokens continue to control both read-only and editable blocks.

## Accessibility notes

- Give every editable block a specific `aria-label` when the surrounding context does not already make its purpose obvious.
- The language selector has its own accessible name, "Syntax language", and is disabled with readonly or disabled editors.
- The visible syntax-highlight layer and line numbers are presentation only. Assistive technology interacts with the real textarea and receives the actual source text.
- Because Tab is useful for indentation, press Escape and then Tab or Shift+Tab to leave the editor with the keyboard.
- `readonly` is preferable to `disabled` when users should still be able to focus, select, or copy the code.
- Keep the selected language accurate so users understand the source they are editing.

## Design notes

- Use read-only mode for documentation, examples, generated output, and source previews.
- Use `editable` for starter code, small configuration editors, playground inputs, and exercise code.
- Keep code execution outside this primitive. A product-level workbench can compose the editor with Run, console output, tests, status, and backend execution without coupling those concerns to the code surface itself.
- The editor intentionally uses a native textarea rather than shipping an IDE dependency. This keeps the component lightweight while preserving familiar browser editing behavior.
