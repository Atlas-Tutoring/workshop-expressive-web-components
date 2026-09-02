import {fixture, assert, oneEvent} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

import '../components/color-picker/ws-color-picker.js';
import type {
  WsAccentChangeDetail,
  WsColorPicker,
} from '../components/color-picker/ws-color-picker.js';

suite('ws-color-picker custom color popover', () => {
  test('keeps compact mode open while the native color input changes', async () => {
    const el = await fixture<WsColorPicker>(
      html`<ws-color-picker apply="none" compact></ws-color-picker>`
    );
    el.show();
    await el.updateComplete;

    const input =
      el.shadowRoot!.querySelector<HTMLInputElement>('.custom input')!;
    const popover = () => el.shadowRoot!.querySelector('.popover')!;
    const eventPromise = oneEvent(el, 'ws-accent-change');

    input.value = '#123456';
    input.dispatchEvent(new Event('input', {bubbles: true, composed: true}));
    const event = await eventPromise;
    await el.updateComplete;

    assert.equal(el.value, '#123456');
    assert.equal((event.detail as WsAccentChangeDetail).value, '#123456');
    assert.isFalse(
      popover().hasAttribute('hidden'),
      'native color input changes must not dismiss the Workshop popover'
    );
  });
});
