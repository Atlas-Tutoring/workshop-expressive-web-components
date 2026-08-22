import {fixture, assert, oneEvent} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

import '../components/date-picker/ws-date-picker.js';
import type {WsDatePicker} from '../components/date-picker/ws-date-picker.js';

suite('ws-date-picker', () => {
  test('is defined', () => {
    const el = document.createElement('ws-date-picker');
    assert.equal(el.localName, 'ws-date-picker');
    assert.equal(customElements.get('ws-date-picker'), el.constructor);
  });

  test('uses a text field and an expressive constrained calendar', async () => {
    const el = await fixture<WsDatePicker>(html`
      <ws-date-picker
        label="Release date"
        value="2026-07-28"
        min="2026-07-01"
        max="2026-07-31"
      ></ws-date-picker>
    `);
    const input = el.shadowRoot!.querySelector<HTMLInputElement>('input')!;

    assert.equal(input.type, 'text');
    assert.equal(input.value, '2026-07-28');
    el.showPicker();
    await el.updateComplete;
    assert.exists(el.shadowRoot!.querySelector('[role="dialog"]'));
    assert.equal(
      el.shadowRoot!
        .querySelector<HTMLButtonElement>('.day[aria-selected="true"]')!
        .textContent!.trim(),
      '28'
    );
  });

  test('updates value and emits a composed input event', async () => {
    const el = await fixture<WsDatePicker>(html`
      <ws-date-picker label="Release date"></ws-date-picker>
    `);
    const input = el.shadowRoot!.querySelector<HTMLInputElement>('input')!;
    const eventPromise = oneEvent(el, 'input');

    input.value = '2026-08-01';
    input.dispatchEvent(new InputEvent('input', {bubbles: true}));
    const event = await eventPromise;

    assert.equal(el.value, '2026-08-01');
    assert.isTrue(event.composed);
  });

  test('formats date input progressively and normalizes pasted separators', async () => {
    const el = await fixture<WsDatePicker>(html`
      <ws-date-picker label="Release date"></ws-date-picker>
    `);
    const input = el.shadowRoot!.querySelector<HTMLInputElement>('input')!;

    input.value = '2026';
    input.setSelectionRange(4, 4);
    input.dispatchEvent(
      new InputEvent('input', {bubbles: true, inputType: 'insertText'})
    );
    await el.updateComplete;

    assert.equal(input.value, '2026-');
    assert.equal(el.value, '2026-');
    assert.equal(input.selectionStart, 5);

    input.value = '2026/08/22';
    input.setSelectionRange(input.value.length, input.value.length);
    input.dispatchEvent(
      new InputEvent('input', {bubbles: true, inputType: 'insertFromPaste'})
    );
    await el.updateComplete;

    assert.equal(input.value, '2026-08-22');
    assert.equal(el.value, '2026-08-22');
    assert.equal(input.selectionStart, 10);
  });

  test('keeps incomplete typed dates out of form submission', async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form>
        <ws-date-picker name="releaseDate"></ws-date-picker>
      </form>
    `);
    const el = form.querySelector<WsDatePicker>('ws-date-picker')!;
    const input = el.shadowRoot!.querySelector<HTMLInputElement>('input')!;

    input.value = '202608';
    input.setSelectionRange(6, 6);
    input.dispatchEvent(
      new InputEvent('input', {bubbles: true, inputType: 'insertText'})
    );
    await el.updateComplete;

    assert.equal(input.value, '2026-08-');
    assert.isNull(new FormData(form).get('releaseDate'));

    input.value = '20260822';
    input.setSelectionRange(8, 8);
    input.dispatchEvent(
      new InputEvent('input', {bubbles: true, inputType: 'insertText'})
    );
    await el.updateComplete;

    assert.equal(new FormData(form).get('releaseDate'), '2026-08-22');
  });

  test('participates in form submission and reset', async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form>
        <ws-date-picker name="releaseDate" value="2026-07-28"></ws-date-picker>
      </form>
    `);
    const el = form.querySelector<WsDatePicker>('ws-date-picker')!;

    el.value = '2026-08-04';
    await el.updateComplete;
    assert.equal(new FormData(form).get('releaseDate'), '2026-08-04');

    form.reset();
    await el.updateComplete;
    assert.equal(el.value, '2026-07-28');
  });

  test('forwards required validation and shows the configured error', async () => {
    const el = await fixture<WsDatePicker>(html`
      <ws-date-picker
        label="Release date"
        required
        error-text="Choose a release date"
      ></ws-date-picker>
    `);

    assert.isFalse(el.checkValidity());
    assert.isFalse(el.reportValidity());
    await el.updateComplete;

    assert.isTrue(
      el.shadowRoot!.querySelector('.control')!.classList.contains('invalid')
    );
    assert.equal(
      el.shadowRoot!.querySelector('.supporting-text')!.textContent!.trim(),
      'Choose a release date'
    );
  });

  test('clears the selected date and restores focus', async () => {
    const el = await fixture<WsDatePicker>(html`
      <ws-date-picker
        label="Release date"
        value="2026-07-28"
        clearable
      ></ws-date-picker>
    `);
    const changePromise = oneEvent(el, 'change');

    el.shadowRoot!.querySelector<HTMLButtonElement>('.clear-button')!.click();
    await changePromise;
    await el.updateComplete;

    assert.equal(el.value, '');
    assert.equal(
      el.shadowRoot!.activeElement,
      el.shadowRoot!.querySelector('input')
    );
  });

  test('disables the calendar action with the control', async () => {
    const el = await fixture<WsDatePicker>(html`
      <ws-date-picker label="Release date" disabled></ws-date-picker>
    `);
    const input = el.shadowRoot!.querySelector<HTMLInputElement>('input')!;
    const pickerButton =
      el.shadowRoot!.querySelector<HTMLButtonElement>('.picker-button')!;

    assert.isTrue(input.disabled);
    assert.isTrue(pickerButton.disabled);
  });

  test('selects a date from the custom calendar', async () => {
    const el = await fixture<WsDatePicker>(html`
      <ws-date-picker label="Release date" value="2026-07-28"></ws-date-picker>
    `);
    el.showPicker();
    await el.updateComplete;
    const changed = oneEvent(el, 'change');
    const day = [
      ...el.shadowRoot!.querySelectorAll<HTMLButtonElement>('.day'),
    ].find((button) => button.textContent?.trim() === '30')!;
    day.click();
    await changed;
    assert.equal(el.value, '2026-07-30');
    assert.notExists(el.shadowRoot!.querySelector('.calendar'));
  });
});
