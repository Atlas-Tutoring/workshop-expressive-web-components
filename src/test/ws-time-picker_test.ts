import {fixture, assert, oneEvent} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

import '../components/time-picker/ws-time-picker.js';
import type {WsTimePicker} from '../components/time-picker/ws-time-picker.js';

suite('ws-time-picker', () => {
  test('is defined', () => {
    const el = document.createElement('ws-time-picker');
    assert.equal(el.localName, 'ws-time-picker');
    assert.equal(customElements.get('ws-time-picker'), el.constructor);
  });

  test('uses canonical HH:mm values and opens the custom picker', async () => {
    const el = await fixture<WsTimePicker>(html`
      <ws-time-picker label="Start time" value="09:30"></ws-time-picker>
    `);
    const input = el.shadowRoot!.querySelector<HTMLInputElement>('input')!;

    assert.equal(input.type, 'text');
    assert.equal(input.value, '09:30');
    el.showPicker();
    await el.updateComplete;

    assert.exists(el.shadowRoot!.querySelector('[role="dialog"]'));
    assert.equal(
      el.shadowRoot!.querySelector('.preview')!.textContent!.trim(),
      '09:30'
    );
  });

  test('updates value and emits a composed input event while typing', async () => {
    const el = await fixture<WsTimePicker>(html`
      <ws-time-picker label="Start time"></ws-time-picker>
    `);
    const input = el.shadowRoot!.querySelector<HTMLInputElement>('input')!;
    const eventPromise = oneEvent(el, 'input');

    input.value = '14:45';
    input.dispatchEvent(new InputEvent('input', {bubbles: true}));
    const event = await eventPromise;

    assert.equal(el.value, '14:45');
    assert.isTrue(event.composed);
  });

  test('formats time input progressively and normalizes one-digit hours', async () => {
    const el = await fixture<WsTimePicker>(html`
      <ws-time-picker label="Start time"></ws-time-picker>
    `);
    const input = el.shadowRoot!.querySelector<HTMLInputElement>('input')!;

    input.value = '14';
    input.setSelectionRange(2, 2);
    input.dispatchEvent(
      new InputEvent('input', {bubbles: true, inputType: 'insertText'})
    );
    await el.updateComplete;

    assert.equal(input.value, '14:');
    assert.equal(el.value, '14:');
    assert.equal(input.selectionStart, 3);

    input.value = '930';
    input.setSelectionRange(3, 3);
    input.dispatchEvent(
      new InputEvent('input', {bubbles: true, inputType: 'insertText'})
    );
    await el.updateComplete;

    assert.equal(input.value, '09:30');
    assert.equal(el.value, '09:30');
    assert.equal(input.selectionStart, 5);
  });

  test('keeps incomplete typed times out of form submission', async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form>
        <ws-time-picker name="startTime"></ws-time-picker>
      </form>
    `);
    const el = form.querySelector<WsTimePicker>('ws-time-picker')!;
    const input = el.shadowRoot!.querySelector<HTMLInputElement>('input')!;

    input.value = '14';
    input.setSelectionRange(2, 2);
    input.dispatchEvent(
      new InputEvent('input', {bubbles: true, inputType: 'insertText'})
    );
    await el.updateComplete;

    assert.equal(input.value, '14:');
    assert.isNull(new FormData(form).get('startTime'));

    input.value = '1430';
    input.setSelectionRange(4, 4);
    input.dispatchEvent(
      new InputEvent('input', {bubbles: true, inputType: 'insertText'})
    );
    await el.updateComplete;

    assert.equal(input.value, '14:30');
    assert.equal(new FormData(form).get('startTime'), '14:30');
  });

  test('commits selected hour and minute from the picker', async () => {
    const el = await fixture<WsTimePicker>(html`
      <ws-time-picker
        label="Start time"
        value="09:30"
        minute-step="15"
      ></ws-time-picker>
    `);

    el.showPicker();
    await el.updateComplete;

    el.shadowRoot!
      .querySelector<HTMLButtonElement>('.time-option[data-hour="14"]')!
      .click();
    el.shadowRoot!
      .querySelector<HTMLButtonElement>('.time-option[data-minute="45"]')!
      .click();
    await el.updateComplete;

    const changed = oneEvent(el, 'change');
    [...el.shadowRoot!.querySelectorAll<HTMLElement>('ws-button')]
      .find((button) => button.textContent?.trim() === 'Done')!
      .click();
    await changed;

    assert.equal(el.value, '14:45');
    assert.notExists(el.shadowRoot!.querySelector('.picker'));
  });

  test('uses minute-step for available minute choices and validation', async () => {
    const el = await fixture<WsTimePicker>(html`
      <ws-time-picker
        label="Start time"
        value="10:20"
        minute-step="15"
      ></ws-time-picker>
    `);

    assert.isFalse(el.checkValidity());

    el.value = '10:30';
    await el.updateComplete;
    assert.isTrue(el.checkValidity());

    el.showPicker();
    await el.updateComplete;
    assert.equal(
      el.shadowRoot!.querySelectorAll('[data-minute]').length,
      4
    );
  });

  test('participates in form submission and reset', async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form>
        <ws-time-picker name="startTime" value="08:15"></ws-time-picker>
      </form>
    `);
    const el = form.querySelector<WsTimePicker>('ws-time-picker')!;

    el.value = '16:40';
    await el.updateComplete;
    assert.equal(new FormData(form).get('startTime'), '16:40');

    form.reset();
    await el.updateComplete;
    assert.equal(el.value, '08:15');
  });

  test('validates required, range, and format constraints', async () => {
    const el = await fixture<WsTimePicker>(html`
      <ws-time-picker
        label="Office hours"
        required
        min="09:00"
        max="17:00"
        error-text="Choose a valid office time"
      ></ws-time-picker>
    `);

    assert.isFalse(el.checkValidity());

    el.value = '08:30';
    await el.updateComplete;
    assert.isFalse(el.checkValidity());

    el.value = 'noon';
    await el.updateComplete;
    assert.isFalse(el.checkValidity());

    el.value = '12:30';
    await el.updateComplete;
    assert.isTrue(el.checkValidity());

    el.value = '';
    assert.isFalse(el.reportValidity());
    await el.updateComplete;
    assert.equal(
      el.shadowRoot!.querySelector('.supporting-text')!.textContent!.trim(),
      'Choose a valid office time'
    );
  });

  test('clears the selected time and restores focus', async () => {
    const el = await fixture<WsTimePicker>(html`
      <ws-time-picker
        label="Start time"
        value="09:30"
        clearable
      ></ws-time-picker>
    `);
    const changed = oneEvent(el, 'change');

    el.shadowRoot!.querySelector<HTMLButtonElement>('.clear-button')!.click();
    await changed;
    await el.updateComplete;

    assert.equal(el.value, '');
    assert.equal(
      el.shadowRoot!.activeElement,
      el.shadowRoot!.querySelector('input')
    );
  });

  test('disables the picker action with the control', async () => {
    const el = await fixture<WsTimePicker>(html`
      <ws-time-picker label="Start time" disabled></ws-time-picker>
    `);
    const input = el.shadowRoot!.querySelector<HTMLInputElement>('input')!;
    const pickerButton =
      el.shadowRoot!.querySelector<HTMLButtonElement>('.picker-button')!;

    assert.isTrue(input.disabled);
    assert.isTrue(pickerButton.disabled);
  });
});
