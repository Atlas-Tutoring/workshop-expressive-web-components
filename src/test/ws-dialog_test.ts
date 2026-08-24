import {assert, fixture, oneEvent} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

import '../components/dialog/ws-dialog.js';
import type {WsDialog} from '../components/dialog/ws-dialog.js';

suite('ws-dialog', () => {
  test('is defined', () => {
    const el = document.createElement('ws-dialog');
    assert.equal(el.localName, 'ws-dialog');
    assert.equal(customElements.get('ws-dialog'), el.constructor);
  });

  test('renders heading, description, content, and action slots', async () => {
    const el = await fixture<WsDialog>(html`
      <ws-dialog heading="Create course" description="Add the course details.">
        <span slot="icon">school</span>
        <p id="body">Course form</p>
        <button slot="actions" id="cancel">Cancel</button>
      </ws-dialog>
    `);

    await el.updateComplete;

    assert.equal(
      el.shadowRoot!.querySelector('h2')?.textContent,
      'Create course'
    );
    assert.equal(
      el.shadowRoot!.querySelector('#description')?.textContent,
      'Add the course details.'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector<HTMLSlotElement>('slot[name="icon"]')!
        .assignedElements()[0].textContent,
      'school'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector<HTMLSlotElement>('slot[name="actions"]')!
        .assignedElements()[0].id,
      'cancel'
    );
  });

  test('uses backend-style content spacing and end-aligned actions', async () => {
    const el = await fixture<WsDialog>(html`
      <ws-dialog heading="Create course">
        <input />
        <textarea></textarea>
        <button slot="actions">Cancel</button>
        <button slot="actions">Create</button>
      </ws-dialog>
    `);

    await el.updateComplete;

    const content = el.shadowRoot!.querySelector<HTMLElement>('.content')!;
    const actions = el.shadowRoot!.querySelector<HTMLSlotElement>(
      'slot[name="actions"]'
    )!;
    const contentStyle = getComputedStyle(content);
    const actionsStyle = getComputedStyle(actions);

    assert.equal(contentStyle.display, 'grid');
    assert.equal(contentStyle.gap, '20px');
    assert.equal(actionsStyle.display, 'flex');
    assert.equal(actionsStyle.justifyContent, 'flex-end');
    assert.equal(actionsStyle.gap, '8px');
  });

  test('opens in the modal top layer through showModal', async () => {
    const el = await fixture<WsDialog>(
      html`<ws-dialog heading="Confirm">Continue?</ws-dialog>`
    );

    el.showModal();
    await el.updateComplete;

    const dialog = el.shadowRoot!.querySelector('dialog')!;
    assert.isTrue(el.open);
    assert.isTrue(dialog.open);
    assert.equal(el.getAttribute('open'), '');
  });

  test('reflects an initial open attribute to the native dialog', async () => {
    const el = await fixture<WsDialog>(
      html`<ws-dialog open heading="Open dialog">Content</ws-dialog>`
    );

    await el.updateComplete;

    assert.isTrue(el.shadowRoot!.querySelector('dialog')!.open);
  });

  test('closes with a return value and emits ws-dialog-close', async () => {
    const el = await fixture<WsDialog>(
      html`<ws-dialog heading="Save changes">Content</ws-dialog>`
    );

    el.showModal();
    await el.updateComplete;

    const eventPromise = oneEvent(el, 'ws-dialog-close');
    el.close('saved');
    await el.updateComplete;

    const dialog = el.shadowRoot!.querySelector('dialog')!;
    assert.isTrue(dialog.open, 'dialog remains in the top layer while exiting');
    assert.isTrue(dialog.classList.contains('closing'));

    const event = await eventPromise;
    await el.updateComplete;

    assert.equal(event.detail.returnValue, 'saved');
    assert.isFalse(el.open);
    assert.isFalse(dialog.open);
  });

  test('uses the visible heading as the accessible name', async () => {
    const el = await fixture<WsDialog>(
      html`<ws-dialog heading="Delete course">Content</ws-dialog>`
    );
    const dialog = el.shadowRoot!.querySelector('dialog')!;

    assert.equal(dialog.getAttribute('aria-labelledby'), 'heading');
    assert.isNull(dialog.getAttribute('aria-label'));
  });

  test('supports aria-label when no visible heading is supplied', async () => {
    const el = await fixture<WsDialog>(
      html`<ws-dialog aria-label="Keyboard shortcuts">Content</ws-dialog>`
    );
    const dialog = el.shadowRoot!.querySelector('dialog')!;

    assert.equal(dialog.getAttribute('aria-label'), 'Keyboard shortcuts');
    assert.isNull(dialog.getAttribute('aria-labelledby'));
  });
});
