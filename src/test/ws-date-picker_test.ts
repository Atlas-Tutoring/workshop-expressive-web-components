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

  test('forwards value and date constraints to the native input', async () => {
    const el = await fixture<WsDatePicker>(html`
      <ws-date-picker
        label="Release date"
        value="2026-07-28"
        min="2026-07-01"
        max="2026-07-31"
      ></ws-date-picker>
    `);
    const input = el.shadowRoot!.querySelector<HTMLInputElement>('input')!;

    assert.equal(input.type, 'date');
    assert.equal(input.value, '2026-07-28');
    assert.equal(input.min, '2026-07-01');
    assert.equal(input.max, '2026-07-31');
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

    assert.isTrue(el.shadowRoot!.querySelector('.control')!.classList.contains('invalid'));
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
    assert.equal(el.shadowRoot!.activeElement, el.shadowRoot!.querySelector('input'));
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
});
