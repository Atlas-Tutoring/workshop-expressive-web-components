import {aTimeout, assert, fixture, oneEvent} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

import '../components/menu/ws-menu.js';
import type {WsMenu} from '../components/menu/ws-menu.js';
import type {WsMenuItem} from '../components/menu/ws-menu-item.js';

suite('ws-menu', () => {
  test('renders an icon action trigger and a semantic menu surface', async () => {
    const el = await fixture<WsMenu>(html`
      <ws-menu aria-label="Course actions">
        <span slot="trigger-icon">more</span>
        <ws-menu-item value="delete" tone="danger">Delete course</ws-menu-item>
      </ws-menu>
    `);
    await el.updateComplete;

    const trigger = el.shadowRoot!.querySelector<HTMLButtonElement>('.trigger')!;
    const surface = el.shadowRoot!.querySelector<HTMLElement>('.surface')!;

    assert.equal(trigger.getAttribute('aria-label'), 'Course actions');
    assert.equal(trigger.getAttribute('aria-haspopup'), 'menu');
    assert.equal(trigger.getAttribute('aria-expanded'), 'false');
    assert.equal(surface.getAttribute('role'), 'menu');
    assert.equal(surface.getAttribute('aria-hidden'), 'true');
    assert.isTrue(surface.hasAttribute('inert'));
    assert.isTrue(el.hasAttribute('icon-only'));
  });

  test('opens a viewport-positioned surface from the trigger', async () => {
    const el = await fixture<WsMenu>(html`
      <ws-menu aria-label="Actions">
        <ws-menu-item value="edit">Edit</ws-menu-item>
      </ws-menu>
    `);
    await el.updateComplete;

    const trigger = el.shadowRoot!.querySelector<HTMLButtonElement>('.trigger')!;
    trigger.click();
    await el.updateComplete;
    await aTimeout(0);

    const surface = el.shadowRoot!.querySelector<HTMLElement>('.surface')!;
    assert.isTrue(el.open);
    assert.isTrue(surface.classList.contains('open'));
    assert.equal(trigger.getAttribute('aria-expanded'), 'true');
    assert.isNull(surface.getAttribute('aria-hidden'));
    assert.isFalse(surface.hasAttribute('inert'));
    assert.match(surface.style.top, /^\d+px$/);
    assert.match(surface.style.left, /^\d+px$/);
  });

  test('emits the selected action and restores trigger focus', async () => {
    const el = await fixture<WsMenu>(html`
      <ws-menu aria-label="Course actions">
        <ws-menu-item value="edit">Edit</ws-menu-item>
        <ws-menu-item value="delete" tone="danger">Delete course</ws-menu-item>
      </ws-menu>
    `);
    await el.updateComplete;

    el.shadowRoot!.querySelector<HTMLButtonElement>('.trigger')!.click();
    await el.updateComplete;

    const selected = oneEvent(el, 'ws-menu-select');
    const deleteItem = el.querySelectorAll<WsMenuItem>('ws-menu-item')[1];
    deleteItem.shadowRoot!.querySelector<HTMLButtonElement>('.item')!.click();
    const event = await selected;
    await el.updateComplete;
    await aTimeout(0);

    assert.equal(event.detail.value, 'delete');
    assert.strictEqual(event.detail.item, deleteItem);
    assert.isFalse(el.open);
    assert.equal(
      el.shadowRoot!.activeElement,
      el.shadowRoot!.querySelector('.trigger')
    );
  });

  test('supports arrow navigation and Escape dismissal', async () => {
    const el = await fixture<WsMenu>(html`
      <ws-menu aria-label="Actions">
        <ws-menu-item value="edit">Edit</ws-menu-item>
        <ws-menu-item value="disabled" disabled>Disabled</ws-menu-item>
        <ws-menu-item value="delete" tone="danger">Delete</ws-menu-item>
      </ws-menu>
    `);
    await el.updateComplete;

    const trigger = el.shadowRoot!.querySelector<HTMLButtonElement>('.trigger')!;
    trigger.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
        composed: true,
      })
    );
    await el.updateComplete;
    await aTimeout(0);

    const items = el.querySelectorAll<WsMenuItem>('ws-menu-item');
    assert.equal(
      items[0].shadowRoot!.activeElement,
      items[0].shadowRoot!.querySelector('.item')
    );

    items[0].shadowRoot!.querySelector<HTMLButtonElement>('.item')!.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
        composed: true,
      })
    );
    await aTimeout(0);

    assert.equal(
      items[2].shadowRoot!.activeElement,
      items[2].shadowRoot!.querySelector('.item')
    );

    items[2].shadowRoot!.querySelector<HTMLButtonElement>('.item')!.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        composed: true,
      })
    );
    await el.updateComplete;
    await aTimeout(0);

    assert.isFalse(el.open);
    assert.equal(el.shadowRoot!.activeElement, trigger);
  });

  test('closes when the user points outside the menu', async () => {
    const el = await fixture<WsMenu>(html`
      <ws-menu aria-label="Actions">
        <ws-menu-item value="edit">Edit</ws-menu-item>
      </ws-menu>
    `);
    await el.updateComplete;

    el.show();
    await el.updateComplete;
    assert.isTrue(el.open);

    document.body.dispatchEvent(
      new PointerEvent('pointerdown', {bubbles: true, composed: true})
    );
    await el.updateComplete;

    assert.isFalse(el.open);
  });

  test('supports danger menu items without forcing all actions to reserve icon space', async () => {
    const el = await fixture<WsMenu>(html`
      <ws-menu aria-label="Actions">
        <ws-menu-item value="duplicate">Duplicate</ws-menu-item>
        <ws-menu-item value="delete" tone="danger">
          <span slot="icon">delete</span>
          Delete course
        </ws-menu-item>
      </ws-menu>
    `);
    await el.updateComplete;

    const items = el.querySelectorAll<WsMenuItem>('ws-menu-item');
    assert.equal(items[1].tone, 'danger');
    assert.notExists(items[0].shadowRoot!.querySelector('.icon'));
    assert.exists(items[1].shadowRoot!.querySelector('.icon'));
  });
});
