import {fixture, assert, oneEvent} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

import '../components/chip/ws-chip.js';
import type {WsChip, WsChipRemoveDetail} from '../components/chip/ws-chip.js';

suite('ws-chip', () => {
  test('is defined', () => {
    const el = document.createElement('ws-chip');
    assert.equal(el.localName, 'ws-chip');
    assert.equal(customElements.get('ws-chip'), el.constructor);
  });

  test('renders an interactive assist chip by default', async () => {
    const el = await fixture<WsChip>(html`<ws-chip>Open</ws-chip>`);
    const button = el.shadowRoot!.querySelector('button.chip')!;

    assert.equal(el.variant, 'assist');
    assert.equal(el.textContent!.trim(), 'Open');
    assert.isNull(button.getAttribute('aria-pressed'));
  });

  test('toggles a filter chip and emits change', async () => {
    const el = await fixture<WsChip>(html`
      <ws-chip variant="filter">Favorite</ws-chip>
    `);
    const eventPromise = oneEvent(el, 'change');

    el.shadowRoot!.querySelector<HTMLButtonElement>('button.chip')!.click();
    await eventPromise;
    await el.updateComplete;

    assert.isTrue(el.selected);
    assert.equal(
      el.shadowRoot!.querySelector('button.chip')!.getAttribute('aria-pressed'),
      'true'
    );
  });

  test('does not toggle while disabled', async () => {
    const el = await fixture<WsChip>(html`
      <ws-chip variant="filter" disabled>Favorite</ws-chip>
    `);

    el.shadowRoot!.querySelector<HTMLButtonElement>('button.chip')!.click();

    assert.isFalse(el.selected);
  });

  test('makes input chips removable by default', async () => {
    const el = await fixture<WsChip>(html`
      <ws-chip variant="input" value="android">Android</ws-chip>
    `);
    const eventPromise = oneEvent(el, 'ws-chip-remove');

    el.shadowRoot!.querySelector<HTMLButtonElement>('.remove-button')!.click();
    const event = (await eventPromise) as CustomEvent<WsChipRemoveDetail>;

    assert.equal(event.detail.value, 'android');
    assert.isTrue(event.composed);
  });

  test('renders status chips as non-interactive content', async () => {
    const el = await fixture<WsChip>(html`
      <ws-chip variant="status" tone="success">Published</ws-chip>
    `);
    const surface = el.shadowRoot!.querySelector('.chip')!;

    assert.equal(surface.localName, 'span');
    assert.equal(surface.getAttribute('role'), 'status');
    assert.isNull(el.shadowRoot!.querySelector('button.chip'));
  });

  test('supports icon slots and a custom remove icon', async () => {
    const el = await fixture<WsChip>(html`
      <ws-chip removable>
        <span slot="leading-icon">tag</span>
        Label
        <span slot="remove-icon">remove</span>
      </ws-chip>
    `);
    await el.updateComplete;

    assert.equal(
      el.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="leading-icon"]')!
        .assignedElements()[0].textContent,
      'tag'
    );
    assert.equal(
      el.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="remove-icon"]')!
        .assignedElements()[0].textContent,
      'remove'
    );
  });
});
