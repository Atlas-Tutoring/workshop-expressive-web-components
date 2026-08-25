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

suite('ws-dialog backdrop dismissal', () => {
  /**
   * The backdrop is the <dialog> box itself; content lives in .surface. A
   * point outside the surface bounds but targeting the dialog is a backdrop
   * hit.
   */
  const backdropPoint = (el: WsDialog) => {
    const dialog = el.shadowRoot!.querySelector('dialog')!;
    const bounds = dialog.getBoundingClientRect();
    return {dialog, clientX: bounds.left - 20, clientY: bounds.top - 20};
  };

  const surfacePoint = (el: WsDialog) => {
    const dialog = el.shadowRoot!.querySelector('dialog')!;
    const bounds = dialog.getBoundingClientRect();
    return {
      dialog,
      clientX: bounds.left + bounds.width / 2,
      clientY: bounds.top + bounds.height / 2,
    };
  };

  /**
   * Resolves true when the dialog dispatches ws-dialog-close within the
   * window. `open` alone is not enough: it stays true for the length of the
   * exit animation, so a dismissed dialog still looks open moments later.
   */
  const closesWithin = (el: WsDialog, ms: number) =>
    new Promise<boolean>((resolve) => {
      const timer = globalThis.setTimeout(() => resolve(false), ms);
      el.addEventListener(
        'ws-dialog-close',
        () => {
          globalThis.clearTimeout(timer);
          resolve(true);
        },
        {once: true}
      );
    });

  const openDialog = async () => {
    const el = await fixture<WsDialog>(
      html`<ws-dialog heading="Selectable"><p>Body copy</p></ws-dialog>`
    );
    el.showModal();
    await el.updateComplete;
    return el;
  };

  const press = (
    dialog: HTMLElement,
    point: {clientX: number; clientY: number}
  ) =>
    dialog.dispatchEvent(
      new PointerEvent('pointerdown', {bubbles: true, composed: true, ...point})
    );

  const release = (
    dialog: HTMLElement,
    point: {clientX: number; clientY: number}
  ) =>
    dialog.dispatchEvent(
      new MouseEvent('click', {bubbles: true, composed: true, ...point})
    );

  test('a press and release on the backdrop dismisses', async () => {
    const el = await openDialog();
    const point = backdropPoint(el);
    // Closing runs through the exit animation before `open` flips.
    const closed = oneEvent(el, 'ws-dialog-close');

    press(point.dialog, point);
    release(point.dialog, point);
    await closed;

    assert.isFalse(el.open);
  });

  /*
   * Selecting text inside the surface and releasing over the backdrop
   * produces a click on the <dialog> with coordinates outside the surface.
   * That must not dismiss, or the selection gesture kills the dialog.
   */
  test('a selection drag released over the backdrop does not dismiss', async () => {
    const el = await openDialog();
    const start = surfacePoint(el);
    const end = backdropPoint(el);

    press(start.dialog, start);
    release(end.dialog, end);

    assert.isFalse(await closesWithin(el, 400));
    assert.isTrue(el.open);
  });

  test('a press on the backdrop released over the surface does not dismiss', async () => {
    const el = await openDialog();
    const start = backdropPoint(el);
    const end = surfacePoint(el);

    press(start.dialog, start);
    release(end.dialog, end);

    assert.isFalse(await closesWithin(el, 400));
    assert.isTrue(el.open);
  });
});
