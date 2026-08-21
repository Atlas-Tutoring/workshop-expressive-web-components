import {fixture, assert, oneEvent} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

import '../components/dropdown/ws-dropdown.js';
import type {WsDropdown} from '../components/dropdown/ws-dropdown.js';

suite('ws-dropdown', () => {
  test('renders options in an expressive listbox', async () => {
    const el = await fixture<WsDropdown>(html`
      <ws-dropdown value="7" aria-label="Period">
        <option value="1">1 day</option>
        <option value="7">7 days</option>
      </ws-dropdown>
    `);
    await el.updateComplete;
    const control =
      el.shadowRoot!.querySelector<HTMLButtonElement>('.control')!;
    assert.equal(control.textContent!.trim(), '7 days');
    assert.equal(control.getAttribute('aria-label'), 'Period');
    assert.equal(control.getAttribute('part'), 'control');
    control.click();
    await el.updateComplete;
    assert.lengthOf(el.shadowRoot!.querySelectorAll('[role="option"]'), 2);
  });

  test('supports button-aligned variants and sizes', async () => {
    const el = await fixture<WsDropdown>(html`
      <ws-dropdown variant="primary" size="large" aria-label="Period">
        <option value="7">7 days</option>
      </ws-dropdown>
    `);
    await el.updateComplete;

    assert.equal(el.variant, 'primary');
    assert.equal(el.size, 'large');
    assert.equal(el.getAttribute('variant'), 'primary');
    assert.equal(el.getAttribute('size'), 'large');
  });

  test('uses outlined and medium as backward-compatible defaults', async () => {
    const el = await fixture<WsDropdown>(html`
      <ws-dropdown aria-label="Period">
        <option value="7">7 days</option>
      </ws-dropdown>
    `);
    await el.updateComplete;

    assert.equal(el.variant, 'outlined');
    assert.equal(el.size, 'medium');
  });

  test('uses a rotating default arrow indicator', async () => {
    const el = await fixture<WsDropdown>(html`
      <ws-dropdown aria-label="Period">
        <option value="1">1 day</option>
        <option value="7">7 days</option>
      </ws-dropdown>
    `);
    await el.updateComplete;
    const control =
      el.shadowRoot!.querySelector<HTMLButtonElement>('.control')!;
    const indicator = el.shadowRoot!.querySelector<HTMLElement>('.indicator')!;

    assert.isTrue(el.rotateIcon);
    assert.isTrue(indicator.classList.contains('rotatable'));
    assert.exists(el.shadowRoot!.querySelector('.chevron'));
    assert.equal(control.getAttribute('aria-expanded'), 'false');

    control.click();
    await el.updateComplete;
    assert.equal(control.getAttribute('aria-expanded'), 'true');

    control.click();
    await el.updateComplete;
    assert.equal(control.getAttribute('aria-expanded'), 'false');
  });

  test('supports a custom indicator icon', async () => {
    const el = await fixture<WsDropdown>(html`
      <ws-dropdown aria-label="Sort order">
        <span slot="icon" id="sort-icon">sort</span>
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
      </ws-dropdown>
    `);
    await el.updateComplete;

    const iconSlot =
      el.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="icon"]')!;
    assert.equal(iconSlot.assignedElements()[0]?.id, 'sort-icon');
  });

  test('supports icon-only triggers and disabling icon rotation', async () => {
    const el = await fixture<WsDropdown>(html`
      <ws-dropdown
        icon-only
        rotate-icon="false"
        variant="secondary"
        aria-label="Sort order"
      >
        <span slot="icon">sort</span>
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
      </ws-dropdown>
    `);
    await el.updateComplete;

    const indicator = el.shadowRoot!.querySelector<HTMLElement>('.indicator')!;
    assert.isTrue(el.iconOnly);
    assert.isFalse(el.rotateIcon);
    assert.notExists(el.shadowRoot!.querySelector('.value'));
    assert.isFalse(indicator.classList.contains('rotatable'));
  });

  test('updates value and emits a composed change event', async () => {
    const el = await fixture<WsDropdown>(html`
      <ws-dropdown
        ><option value="1">1 day</option>
        <option value="7">7 days</option></ws-dropdown
      >
    `);
    await el.updateComplete;
    el.shadowRoot!.querySelector<HTMLButtonElement>('.control')!.click();
    await el.updateComplete;
    const changed = oneEvent(el, 'change');
    el.shadowRoot!.querySelectorAll<HTMLButtonElement>('.option')[1].click();
    const event = await changed;
    assert.equal(el.value, '7');
    assert.isTrue(event.composed);
  });
});
