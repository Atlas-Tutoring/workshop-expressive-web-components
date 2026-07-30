import {fixture, assert, oneEvent} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

import '../components/dropdown/ws-dropdown.js';
import type {WsDropdown} from '../components/dropdown/ws-dropdown.js';

suite('ws-dropdown', () => {
  test('renders native options and the selected value', async () => {
    const el = await fixture<WsDropdown>(html`
      <ws-dropdown value="7" aria-label="Period">
        <option value="1">1 day</option>
        <option value="7">7 days</option>
      </ws-dropdown>
    `);
    await el.updateComplete;
    const select = el.shadowRoot!.querySelector('select')!;
    assert.equal(select.options.length, 2);
    assert.equal(select.value, '7');
    assert.equal(select.getAttribute('aria-label'), 'Period');
  });

  test('updates value and emits a composed change event', async () => {
    const el = await fixture<WsDropdown>(html`
      <ws-dropdown
        ><option value="1">1 day</option>
        <option value="7">7 days</option></ws-dropdown
      >
    `);
    await el.updateComplete;
    const select = el.shadowRoot!.querySelector('select')!;
    const changed = oneEvent(el, 'change');
    select.value = '7';
    select.dispatchEvent(new Event('change', {bubbles: true}));
    const event = await changed;
    assert.equal(el.value, '7');
    assert.isTrue(event.composed);
  });
});
