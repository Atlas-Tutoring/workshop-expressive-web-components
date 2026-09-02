import {fixture, assert, oneEvent} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

import '../components/code-block/ws-code-block.js';
import type {WsCodeBlock} from '../components/code-block/ws-code-block.js';
import type {WsDropdown} from '../components/dropdown/ws-dropdown.js';

suite('ws-code-block', () => {
  test('is defined', () => {
    const el = document.createElement('ws-code-block');
    assert.equal(el.localName, 'ws-code-block');
    assert.equal(customElements.get('ws-code-block'), el.constructor);
  });

  test('renders default content', async () => {
    const code = 'const x = 1;';
    const el = await fixture<WsCodeBlock>(
      html`<ws-code-block language="typescript" .code=${code}></ws-code-block>`
    );

    assert.equal(el.language, 'typescript');
    assert.equal(el.code, code);

    const languageEl = el.shadowRoot!.querySelector('.language')!;
    assert.equal(languageEl.textContent, 'typescript');

    const codeEl = el.shadowRoot!.querySelector('code')!;
    assert.equal(codeEl.textContent, code);

    assert.isNull(el.shadowRoot!.querySelector('.copy-button'));
  });

  test('renders slotted plain text code for declarative usage', async () => {
    const el = await fixture<WsCodeBlock>(html`
      <ws-code-block language="html">
        &lt;ws-button variant="primary"&gt;Continue&lt;/ws-button&gt;
      </ws-code-block>
    `);
    await el.updateComplete;

    assert.include(
      el.shadowRoot!.querySelector('code')!.textContent,
      '<ws-button variant="primary">Continue</ws-button>'
    );
  });

  test('renders template content for declarative HTML examples', async () => {
    const el = await fixture<WsCodeBlock>(html`
      <ws-code-block language="html">
        <template><ws-button variant="primary">Continue</ws-button></template>
      </ws-code-block>
    `);
    await el.updateComplete;

    assert.equal(
      el.shadowRoot!.querySelector('code')!.textContent,
      '<ws-button variant="primary">Continue</ws-button>'
    );
  });

  test('adds syntax token spans for supported languages', async () => {
    const el = await fixture<WsCodeBlock>(
      html`<ws-code-block language="html" code="<ws-button variant='primary'>Create</ws-button>"></ws-code-block>`
    );

    assert.exists(el.shadowRoot!.querySelector('.token.tag'));
    assert.exists(el.shadowRoot!.querySelector('.token.attr'));
    assert.exists(el.shadowRoot!.querySelector('.token.string'));
  });

  test('renders copy button when copy attribute is present', async () => {
    const el = await fixture<WsCodeBlock>(
      html`<ws-code-block copy code="test"></ws-code-block>`
    );
    assert.isTrue(el.copy);
    assert.exists(el.shadowRoot!.querySelector('.copy-button'));
  });

  test('dispatches ws-code-copy event and updates label when clicked', async () => {
    const code = 'npm install lit';
    const el = await fixture<WsCodeBlock>(
      html`<ws-code-block copy .code=${code}></ws-code-block>`
    );
    const copyButton =
      el.shadowRoot!.querySelector<HTMLButtonElement>('.copy-button')!;
    const copyLabel = el.shadowRoot!.querySelector('.copy-label')!;

    assert.equal(copyLabel.textContent?.trim(), 'Copy');

    const eventPromise = oneEvent(el, 'ws-code-copy');

    const originalClipboard = navigator.clipboard;
    let copiedText = '';
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          copiedText = text;
        },
      },
    });

    copyButton.click();

    const event = await eventPromise;
    assert.equal(event.detail.code, code);
    assert.equal(copiedText, code);
    assert.equal(copyLabel.textContent?.trim(), 'Copied');

    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: originalClipboard,
    });
  });

  test('turns into a syntax-highlighted editor when editable', async () => {
    const el = await fixture<WsCodeBlock>(html`
      <ws-code-block
        editable
        language="typescript"
        .code=${'const answer = 42;\nreturn answer;'}
      ></ws-code-block>
    `);
    const editor = el.shadowRoot!.querySelector<HTMLTextAreaElement>('.editor')!;
    const highlight = el.shadowRoot!.querySelector('.highlight-layer')!;
    const lineNumbers = el.shadowRoot!.querySelector('.line-numbers')!;
    const languagePicker =
      el.shadowRoot!.querySelector<WsDropdown>('.language-picker')!;

    assert.exists(editor);
    assert.equal(editor.value, 'const answer = 42;\nreturn answer;');
    assert.include(highlight.textContent, 'const answer = 42;');
    assert.exists(highlight.querySelector('.token.keyword'));
    assert.equal(lineNumbers.textContent?.trim(), '1\n2');
    assert.equal(languagePicker.value, 'typescript');
    assert.notExists(el.shadowRoot!.querySelector('.readonly-code'));
  });

  test('changes syntax language from the editable dropdown', async () => {
    const el = await fixture<WsCodeBlock>(html`
      <ws-code-block
        editable
        language="text"
        .code=${'<section>Workshop</section>'}
      ></ws-code-block>
    `);
    const dropdown = el.shadowRoot!.querySelector<WsDropdown>('.language-picker')!;
    await dropdown.updateComplete;

    const sourceOptions = [...dropdown.querySelectorAll('option')];
    assert.deepEqual(
      sourceOptions.map((option) => option.value),
      [
        'text',
        'html',
        'css',
        'javascript',
        'typescript',
        'cpp',
        'python',
        'json',
        'markdown',
        'xml',
        'svg',
      ]
    );

    const languageChange = oneEvent(el, 'ws-code-language-change');
    dropdown.value = 'html';
    dropdown.dispatchEvent(new Event('change', {bubbles: true, composed: true}));
    const event = await languageChange;
    await el.updateComplete;

    assert.equal(el.language, 'html');
    assert.equal(event.detail.language, 'html');
    assert.exists(el.shadowRoot!.querySelector('.highlight-layer .token.tag'));
  });

  test('highlights C++ syntax and its common language aliases', async () => {
    const code = '#include <iostream>\nint main() { return 0; } // done';

    for (const language of ['cpp', 'c++', 'cxx']) {
      const el = await fixture<WsCodeBlock>(
        html`<ws-code-block .language=${language} .code=${code}></ws-code-block>`
      );
      const highlighted = el.shadowRoot!;

      assert.equal(highlighted.querySelector('.token.keyword')!.textContent, '#include');
      assert.equal(highlighted.querySelector('.token.number')!.textContent, '0');
      assert.equal(highlighted.querySelector('.token.comment')!.textContent, '// done');
    }
  });

  test('highlights Python syntax and its common language alias', async () => {
    const code = 'def greet(name):\n    # Welcome\n    return f"Hello, {name}"';

    for (const language of ['python', 'py']) {
      const el = await fixture<WsCodeBlock>(
        html`<ws-code-block .language=${language} .code=${code}></ws-code-block>`
      );
      const highlighted = el.shadowRoot!;

      assert.equal(highlighted.querySelector('.token.keyword')!.textContent, 'def');
      assert.equal(highlighted.querySelector('.token.comment')!.textContent, '# Welcome');
      assert.include(highlighted.querySelector('.token.string')!.textContent, 'Hello');
    }
  });

  test('supports product-defined language choices', async () => {
    const el = await fixture<WsCodeBlock>(html`
      <ws-code-block editable language="kotlin"></ws-code-block>
    `);
    el.languageOptions = [
      {value: 'kotlin', label: 'Kotlin'},
      {value: 'java', label: 'Java'},
    ];
    await el.updateComplete;

    const dropdown = el.shadowRoot!.querySelector<WsDropdown>('.language-picker')!;
    await dropdown.updateComplete;
    assert.deepEqual(
      [...dropdown.querySelectorAll('option')].map((option) => option.textContent),
      ['Kotlin', 'Java']
    );
  });

  test('updates code and emits composed input and change events while editing', async () => {
    const el = await fixture<WsCodeBlock>(html`
      <ws-code-block editable language="typescript"></ws-code-block>
    `);
    const editor = el.shadowRoot!.querySelector<HTMLTextAreaElement>('.editor')!;
    const inputPromise = oneEvent(el, 'input');

    editor.value = 'const name = "Workshop";';
    editor.dispatchEvent(
      new InputEvent('input', {
        bubbles: true,
        composed: true,
        inputType: 'insertText',
      })
    );

    const inputEvent = await inputPromise;
    await el.updateComplete;
    assert.equal(el.code, 'const name = "Workshop";');
    assert.isTrue(inputEvent.composed);
    assert.include(
      el.shadowRoot!.querySelector('.highlight-layer')!.textContent,
      'Workshop'
    );

    const changePromise = oneEvent(el, 'change');
    editor.dispatchEvent(new Event('change', {bubbles: true, composed: true}));
    const changeEvent = await changePromise;
    assert.isTrue(changeEvent.composed);
  });

  test('lets slotted starter code be cleared without restoring it', async () => {
    const el = await fixture<WsCodeBlock>(html`
      <ws-code-block editable language="typescript">const starter = true;</ws-code-block>
    `);
    await el.updateComplete;
    const editor = el.shadowRoot!.querySelector<HTMLTextAreaElement>('.editor')!;
    assert.equal(editor.value, 'const starter = true;');

    editor.value = '';
    editor.dispatchEvent(
      new InputEvent('input', {
        bubbles: true,
        composed: true,
        inputType: 'deleteContentBackward',
      })
    );
    await el.updateComplete;

    assert.equal(el.code, '');
    assert.equal(
      el.shadowRoot!.querySelector<HTMLTextAreaElement>('.editor')!.value,
      ''
    );
  });

  test('inserts and removes indentation with Tab and Shift+Tab', async () => {
    const el = await fixture<WsCodeBlock>(html`
      <ws-code-block editable tab-size="2" .code=${'return value;'}></ws-code-block>
    `);
    let editor = el.shadowRoot!.querySelector<HTMLTextAreaElement>('.editor')!;
    editor.focus();
    editor.setSelectionRange(0, 0);

    editor.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
        composed: true,
        cancelable: true,
      })
    );
    await el.updateComplete;

    assert.equal(el.code, '  return value;');
    editor = el.shadowRoot!.querySelector<HTMLTextAreaElement>('.editor')!;
    assert.equal(editor.selectionStart, 2);

    editor.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: true,
        bubbles: true,
        composed: true,
        cancelable: true,
      })
    );
    await el.updateComplete;

    assert.equal(el.code, 'return value;');
  });

  test('allows Escape then Tab to leave the editor', async () => {
    const el = await fixture<WsCodeBlock>(html`
      <ws-code-block editable .code=${'const x = 1;'}></ws-code-block>
    `);
    const editor = el.shadowRoot!.querySelector<HTMLTextAreaElement>('.editor')!;

    const escape = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    editor.dispatchEvent(escape);

    const tab = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    editor.dispatchEvent(tab);

    assert.isFalse(tab.defaultPrevented);
    assert.equal(el.code, 'const x = 1;');
  });

  test('respects line-number, readonly, and disabled editor states', async () => {
    const el = await fixture<WsCodeBlock>(html`
      <ws-code-block
        editable
        .lineNumbers=${false}
        readonly
        .code=${'const x = 1;'}
      ></ws-code-block>
    `);
    let editor = el.shadowRoot!.querySelector<HTMLTextAreaElement>('.editor')!;
    let languagePicker =
      el.shadowRoot!.querySelector<WsDropdown>('.language-picker')!;

    assert.isTrue(editor.readOnly);
    assert.isTrue(languagePicker.disabled);
    assert.notExists(el.shadowRoot!.querySelector('.line-numbers'));

    el.readOnly = false;
    el.disabled = true;
    await el.updateComplete;
    editor = el.shadowRoot!.querySelector<HTMLTextAreaElement>('.editor')!;
    languagePicker = el.shadowRoot!.querySelector<WsDropdown>('.language-picker')!;
    assert.isTrue(editor.disabled);
    assert.isTrue(languagePicker.disabled);
  });
});
