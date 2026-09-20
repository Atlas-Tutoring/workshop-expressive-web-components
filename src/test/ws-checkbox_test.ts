import {fixture, assert, oneEvent} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

import '../components/checkbox/ws-checkbox.js';
import type {WsCheckbox} from '../components/checkbox/ws-checkbox.js';

suite('ws-checkbox', () => {
  test('is defined', () => {
    const el = document.createElement('ws-checkbox');
    assert.equal(el.localName, 'ws-checkbox');
    assert.equal(customElements.get('ws-checkbox'), el.constructor);
  });

  test('renders an unchecked accessible checkbox by default', async () => {
    const el = await fixture<WsCheckbox>(
      html`<ws-checkbox aria-label="Subscribe"></ws-checkbox>`
    );
    const button = el.shadowRoot!.querySelector('button')!;

    assert.isFalse(el.checked);
    assert.isFalse(el.indeterminate);
    assert.equal(button.getAttribute('role'), 'checkbox');
    assert.equal(button.getAttribute('aria-checked'), 'false');
    assert.equal(button.getAttribute('aria-label'), 'Subscribe');
  });

  test('toggles checked and emits change & input when clicked on control', async () => {
    const el = await fixture<WsCheckbox>(html`<ws-checkbox></ws-checkbox>`);
    const button = el.shadowRoot!.querySelector('button')!;

    const changePromise = oneEvent(el, 'change');
    const inputPromise = oneEvent(el, 'input');

    button.click();

    const changeEvent = await changePromise;
    const inputEvent = await inputPromise;
    await el.updateComplete;

    assert.isTrue(el.checked);
    assert.equal(changeEvent.type, 'change');
    assert.equal(inputEvent.type, 'input');
    assert.equal(button.getAttribute('aria-checked'), 'true');
  });

  test('toggles checked when clicked on label', async () => {
    const el = await fixture<WsCheckbox>(
      html`<ws-checkbox>Agree to terms</ws-checkbox>`
    );
    const label = el.shadowRoot!.querySelector('.label') as HTMLElement;

    const changePromise = oneEvent(el, 'change');
    label.click();
    await changePromise;

    assert.isTrue(el.checked);
  });

  test('toggles on Space keypress and prevents scroll', async () => {
    const el = await fixture<WsCheckbox>(html`<ws-checkbox></ws-checkbox>`);
    const button = el.shadowRoot!.querySelector('button')!;

    let defaultPrevented = false;
    const event = new KeyboardEvent('keydown', {
      key: ' ',
      bubbles: true,
      cancelable: true,
    });
    button.dispatchEvent(event);
    if (event.defaultPrevented) defaultPrevented = true;

    assert.isTrue(defaultPrevented);
    assert.isTrue(el.checked);
  });

  test('does not toggle while disabled', async () => {
    const el = await fixture<WsCheckbox>(
      html`<ws-checkbox disabled>Disabled</ws-checkbox>`
    );
    const button = el.shadowRoot!.querySelector('button')!;
    const label = el.shadowRoot!.querySelector('.label') as HTMLElement;

    button.click();
    assert.isFalse(el.checked);

    label.click();
    assert.isFalse(el.checked);
  });

  test('supports indeterminate state and transitions to checked on click', async () => {
    const el = await fixture<WsCheckbox>(
      html`<ws-checkbox indeterminate aria-label="Select all"></ws-checkbox>`
    );
    const button = el.shadowRoot!.querySelector('button')!;

    assert.isTrue(el.indeterminate);
    assert.equal(button.getAttribute('aria-checked'), 'mixed');

    button.click();
    await el.updateComplete;

    assert.isFalse(el.indeterminate);
    assert.isTrue(el.checked);
    assert.equal(button.getAttribute('aria-checked'), 'true');
  });

  test('focus and blur methods work', async () => {
    const el = await fixture<WsCheckbox>(html`<ws-checkbox></ws-checkbox>`);
    const button = el.shadowRoot!.querySelector('button')!;

    el.focus();
    assert.equal(el.shadowRoot!.activeElement, button);

    el.blur();
    assert.notEqual(el.shadowRoot!.activeElement, button);
  });

  test('reflects size attribute correctly', async () => {
    const el = await fixture<WsCheckbox>(
      html`<ws-checkbox size="large"></ws-checkbox>`
    );
    assert.equal(el.getAttribute('size'), 'large');
    assert.equal(el.size, 'large');

    el.size = 'small';
    await el.updateComplete;
    assert.equal(el.getAttribute('size'), 'small');
  });
});

suite('ws-checkbox form participation', () => {
  test('submits value when checked in a form', async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form>
        <ws-checkbox name="accept" checked></ws-checkbox>
      </form>
    `);
    const checkboxEl = form.querySelector('ws-checkbox')!;
    await checkboxEl.updateComplete;

    let data = new FormData(form);
    assert.equal(data.get('accept'), 'on');

    checkboxEl.checked = false;
    await checkboxEl.updateComplete;
    data = new FormData(form);
    assert.isNull(data.get('accept'));
  });

  test('submits custom value when checked', async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form>
        <ws-checkbox name="color" value="blue" checked></ws-checkbox>
      </form>
    `);
    const data = new FormData(form);
    assert.equal(data.get('color'), 'blue');
  });

  test('does not submit value when disabled', async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form>
        <ws-checkbox name="color" value="blue" checked disabled></ws-checkbox>
      </form>
    `);
    const data = new FormData(form);
    assert.isNull(data.get('color'));
  });

  test('resets to default state on form reset', async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form>
        <ws-checkbox name="optin" checked></ws-checkbox>
        <ws-checkbox id="indet" name="partial" indeterminate></ws-checkbox>
      </form>
    `);
    const checkEl = form.querySelector('ws-checkbox')!;
    const indetEl = form.querySelector<WsCheckbox>('#indet')!;
    await checkEl.updateComplete;
    await indetEl.updateComplete;

    checkEl.checked = false;
    indetEl.indeterminate = false;
    indetEl.checked = true;
    await checkEl.updateComplete;
    await indetEl.updateComplete;

    assert.isFalse(checkEl.checked);
    assert.isTrue(indetEl.checked);

    form.reset();
    assert.isTrue(checkEl.checked);
    assert.isTrue(indetEl.indeterminate);
    assert.isFalse(indetEl.checked);
  });

  test('validates required state', async () => {
    const checkboxEl = await fixture<WsCheckbox>(
      html`<ws-checkbox required></ws-checkbox>`
    );
    await checkboxEl.updateComplete;

    assert.isFalse(checkboxEl.checkValidity());
    assert.isTrue(checkboxEl.validity.valueMissing);

    checkboxEl.checked = true;
    await checkboxEl.updateComplete;

    assert.isTrue(checkboxEl.checkValidity());
    assert.isFalse(checkboxEl.validity.valueMissing);
  });

  test('supports custom validity messages', async () => {
    const checkboxEl = await fixture<WsCheckbox>(
      html`<ws-checkbox></ws-checkbox>`
    );
    await checkboxEl.updateComplete;

    checkboxEl.setCustomValidity('Must accept');
    assert.isFalse(checkboxEl.checkValidity());
    assert.equal(checkboxEl.validationMessage, 'Must accept');

    checkboxEl.setCustomValidity('');
    assert.isTrue(checkboxEl.checkValidity());
    assert.equal(checkboxEl.validationMessage, '');
  });
});
