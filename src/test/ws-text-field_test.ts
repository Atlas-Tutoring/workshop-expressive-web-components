import {fixture, assert, oneEvent} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

import '../components/text-field/ws-text-field.js';
import type {WsTextField} from '../components/text-field/ws-text-field.js';

suite('ws-text-field', () => {
  test('is defined', () => {
    const el = document.createElement('ws-text-field');
    assert.equal(el.localName, 'ws-text-field');
    assert.equal(customElements.get('ws-text-field'), el.constructor);
  });

  test('renders a labeled text input with the default shape', async () => {
    const el = await fixture<WsTextField>(html`
      <ws-text-field label="Project name" placeholder="Atlas"></ws-text-field>
    `);
    const input = el.shadowRoot!.querySelector('input')!;
    const control = el.shadowRoot!.querySelector('.control')!;

    assert.equal(input.type, 'text');
    assert.equal(input.placeholder, 'Atlas');
    assert.equal(control.getAttribute('data-shape'), 'default');
    assert.equal(el.shadowRoot!.querySelector('label')!.textContent!.trim(), 'Project name');
  });

  test('renders a vertically resizable textarea with requested rows', async () => {
    const el = await fixture<WsTextField>(html`
      <ws-text-field
        type="textarea"
        label="Description"
        rows="4"
        placeholder="Describe the project"
      ></ws-text-field>
    `);
    const textarea = el.shadowRoot!.querySelector<HTMLTextAreaElement>('textarea')!;

    assert.isNull(el.shadowRoot!.querySelector('input'));
    assert.equal(textarea.rows, 4);
    assert.equal(textarea.placeholder, 'Describe the project');
    assert.equal(getComputedStyle(textarea).resize, 'vertical');
  });

  test('uses the circular shape for search unless explicitly overridden', async () => {
    const search = await fixture<WsTextField>(html`
      <ws-text-field type="search" aria-label="Search"></ws-text-field>
    `);
    const overridden = await fixture<WsTextField>(html`
      <ws-text-field type="search" shape="default" aria-label="Search"></ws-text-field>
    `);

    assert.equal(
      search.shadowRoot!.querySelector('.control')!.getAttribute('data-shape'),
      'circle'
    );
    assert.equal(
      overridden.shadowRoot!.querySelector('.control')!.getAttribute('data-shape'),
      'default'
    );
  });

  test('updates value and emits a composed input event', async () => {
    const el = await fixture<WsTextField>(html`
      <ws-text-field label="Title"></ws-text-field>
    `);
    const input = el.shadowRoot!.querySelector<HTMLInputElement>('input')!;
    const eventPromise = oneEvent(el, 'input');

    input.value = 'Expressive';
    input.dispatchEvent(new InputEvent('input', {bubbles: true}));
    const event = await eventPromise;

    assert.equal(el.value, 'Expressive');
    assert.isTrue(event.composed);
  });

  test('textarea updates value and participates in form submission', async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form>
        <ws-text-field type="textarea" name="description"></ws-text-field>
      </form>
    `);
    const el = form.querySelector<WsTextField>('ws-text-field')!;
    const textarea = el.shadowRoot!.querySelector<HTMLTextAreaElement>('textarea')!;
    const eventPromise = oneEvent(el, 'input');

    textarea.value = 'First line\nSecond line';
    textarea.dispatchEvent(new InputEvent('input', {bubbles: true}));
    const event = await eventPromise;

    assert.isTrue(event.composed);
    assert.equal(el.value, 'First line\nSecond line');
    assert.equal(new FormData(form).get('description'), 'First line\nSecond line');
  });

  test('participates in form submission and reset', async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form>
        <ws-text-field name="query" value="initial"></ws-text-field>
      </form>
    `);
    const el = form.querySelector<WsTextField>('ws-text-field')!;

    el.value = 'updated';
    await el.updateComplete;
    assert.equal(new FormData(form).get('query'), 'updated');

    form.reset();
    await el.updateComplete;
    assert.equal(el.value, 'initial');
  });

  test('forwards native validation and exposes an error message', async () => {
    const el = await fixture<WsTextField>(html`
      <ws-text-field
        label="Email"
        type="email"
        required
        error-text="Enter a valid email"
      ></ws-text-field>
    `);

    assert.isFalse(el.checkValidity());
    assert.isFalse(el.reportValidity());
    await el.updateComplete;

    assert.isTrue(el.shadowRoot!.querySelector('.control')!.classList.contains('invalid'));
    assert.equal(
      el.shadowRoot!.querySelector('.supporting-text')!.textContent!.trim(),
      'Enter a valid email'
    );
  });

  test('forwards required validation to textarea fields', async () => {
    const el = await fixture<WsTextField>(html`
      <ws-text-field
        label="Description"
        type="textarea"
        required
        error-text="Enter a description"
      ></ws-text-field>
    `);

    assert.isFalse(el.checkValidity());
    assert.isFalse(el.reportValidity());
    await el.updateComplete;

    assert.equal(
      el.shadowRoot!.querySelector('.supporting-text')!.textContent!.trim(),
      'Enter a description'
    );
  });

  test('clears the value and restores focus', async () => {
    const el = await fixture<WsTextField>(html`
      <ws-text-field label="Search" value="Atlas" clearable></ws-text-field>
    `);
    const changePromise = oneEvent(el, 'change');

    el.shadowRoot!.querySelector<HTMLButtonElement>('.clear-button')!.click();
    await changePromise;
    await el.updateComplete;

    assert.equal(el.value, '');
    assert.equal(el.shadowRoot!.activeElement, el.shadowRoot!.querySelector('input'));
  });

  test('supports leading and trailing icon slots', async () => {
    const el = await fixture<WsTextField>(html`
      <ws-text-field label="Website">
        <span slot="leading-icon">link</span>
        <span slot="trailing-icon">open</span>
      </ws-text-field>
    `);
    await el.updateComplete;

    assert.equal(
      el.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="leading-icon"]')!
        .assignedElements()[0].textContent,
      'link'
    );
    assert.equal(
      el.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="trailing-icon"]')!
        .assignedElements()[0].textContent,
      'open'
    );
  });
});