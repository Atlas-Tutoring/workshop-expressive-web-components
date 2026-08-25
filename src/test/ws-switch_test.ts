import {fixture, assert, oneEvent} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

import '../components/switch/ws-switch.js';
import type {WsSwitch} from '../components/switch/ws-switch.js';

suite('ws-switch', () => {
  test('is defined', () => {
    const el = document.createElement('ws-switch');
    assert.equal(el.localName, 'ws-switch');
    assert.equal(customElements.get('ws-switch'), el.constructor);
  });

  test('renders an unchecked accessible switch by default', async () => {
    const el = await fixture<WsSwitch>(
      html`<ws-switch aria-label="Theme"></ws-switch>`
    );
    const button = el.shadowRoot!.querySelector('button')!;

    assert.isFalse(el.checked);
    assert.equal(button.getAttribute('role'), 'switch');
    assert.equal(button.getAttribute('aria-checked'), 'false');
    assert.equal(button.getAttribute('aria-label'), 'Theme');
  });

  test('toggles checked and emits change when clicked', async () => {
    const el = await fixture<WsSwitch>(html`<ws-switch></ws-switch>`);
    const eventPromise = oneEvent(el, 'change');

    el.shadowRoot!.querySelector('button')!.click();
    const event = await eventPromise;

    assert.isTrue(el.checked);
    assert.equal(event.type, 'change');
    assert.equal(
      el.shadowRoot!.querySelector('button')!.getAttribute('aria-checked'),
      'true'
    );
  });

  test('does not toggle while disabled', async () => {
    const el = await fixture<WsSwitch>(html`<ws-switch disabled></ws-switch>`);

    el.shadowRoot!.querySelector('button')!.click();

    assert.isFalse(el.checked);
  });

  test('supports checked and unchecked icon slots', async () => {
    const el = await fixture<WsSwitch>(html`
      <ws-switch>
        <span slot="unchecked-icon">sun</span>
        <span slot="checked-icon">moon</span>
      </ws-switch>
    `);

    assert.equal(
      el
        .shadowRoot!.querySelector<HTMLSlotElement>(
          'slot[name="unchecked-icon"]'
        )!
        .assignedElements()[0].textContent,
      'sun'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector<HTMLSlotElement>(
          'slot[name="checked-icon"]'
        )!
        .assignedElements()[0].textContent,
      'moon'
    );
  });
});

suite('ws-switch geometry', () => {
  const parts = (el: WsSwitch) => {
    const track = el
      .shadowRoot!.querySelector('.track')!
      .getBoundingClientRect();
    const handle = el
      .shadowRoot!.querySelector('.handle')!
      .getBoundingClientRect();
    const round = (value: number) => Math.round(value * 100) / 100;

    return {
      left: round(handle.left - track.left),
      right: round(track.right - handle.right),
      top: round(handle.top - track.top),
      bottom: round(track.bottom - handle.bottom),
    };
  };

  /*
   * The thumb used to sit flush against the track's inner edge when checked
   * while keeping padding at the top and bottom, so it read as misaligned.
   */
  test('the thumb keeps an equal inset from every track edge', async () => {
    const off = await fixture<WsSwitch>(
      html`<ws-switch aria-label="Off"></ws-switch>`
    );
    const offBox = parts(off);
    assert.equal(offBox.left, offBox.top);
    assert.equal(offBox.left, offBox.bottom);

    const on = await fixture<WsSwitch>(
      html`<ws-switch checked aria-label="On"></ws-switch>`
    );
    const onBox = parts(on);
    assert.equal(onBox.right, onBox.top);
    assert.equal(onBox.right, onBox.bottom);
  });

  test('the travel is symmetric between the two ends', async () => {
    const off = await fixture<WsSwitch>(
      html`<ws-switch aria-label="Off"></ws-switch>`
    );
    const on = await fixture<WsSwitch>(
      html`<ws-switch checked aria-label="On"></ws-switch>`
    );

    assert.equal(parts(off).left, parts(on).right);
    assert.equal(parts(off).right, parts(on).left);
  });

  test('the geometry follows the size tokens', async () => {
    const el = await fixture<WsSwitch>(html`
      <ws-switch
        aria-label="Large"
        style="--ws-switch-track-width: 72px; --ws-switch-track-height: 44px; --ws-switch-handle-size: 34px"
      ></ws-switch>
    `);
    const box = parts(el);

    // (44 - 2 * 2px border - 34) / 2 + 2px border = 5
    assert.equal(box.left, 5);
    assert.equal(box.top, 5);
    assert.equal(box.bottom, 5);
  });
});

suite('ws-switch icons', () => {
  const iconMarkup = html`
    <svg slot="unchecked-icon" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="6" />
    </svg>
    <svg slot="checked-icon" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="6" />
    </svg>
  `;

  test('reflects has-icon only when a glyph is slotted', async () => {
    const bare = await fixture<WsSwitch>(
      html`<ws-switch aria-label="Bare"></ws-switch>`
    );
    assert.isFalse(bare.hasAttribute('has-icon'));

    const withIcon = await fixture<WsSwitch>(
      html`<ws-switch aria-label="Iconed">${iconMarkup}</ws-switch>`
    );
    await withIcon.updateComplete;
    assert.isTrue(withIcon.hasAttribute('has-icon'));
  });

  /*
   * The thumb scales, and a slotted SVG used to scale with it, so the glyph
   * shrank in the off state. Icons now keep the thumb at full size.
   */
  test('keeps the thumb at full size so the glyph has room', async () => {
    const el = await fixture<WsSwitch>(
      html`<ws-switch aria-label="Iconed">${iconMarkup}</ws-switch>`
    );
    await el.updateComplete;

    const handle = el.shadowRoot!.querySelector('.handle')!;
    const thumb = getComputedStyle(handle, '::before');

    assert.equal(thumb.transform, 'matrix(1, 0, 0, 1, 0, 0)');
  });

  test('centres the glyph in the thumb', async () => {
    const el = await fixture<WsSwitch>(
      html`<ws-switch aria-label="Iconed">${iconMarkup}</ws-switch>`
    );
    await el.updateComplete;

    const handle = el
      .shadowRoot!.querySelector('.handle')!
      .getBoundingClientRect();
    const icon = el
      .querySelector('[slot="unchecked-icon"]')!
      .getBoundingClientRect();

    assert.closeTo(
      icon.left + icon.width / 2,
      handle.left + handle.width / 2,
      0.5
    );
    assert.closeTo(
      icon.top + icon.height / 2,
      handle.top + handle.height / 2,
      0.5
    );
  });

  test('defaults to the rotating swap and supports a fade', async () => {
    const rotate = await fixture<WsSwitch>(
      html`<ws-switch aria-label="Rotate">${iconMarkup}</ws-switch>`
    );
    await rotate.updateComplete;
    assert.equal(rotate.iconTransition, 'rotate');
    assert.notEqual(
      getComputedStyle(rotate.shadowRoot!.querySelector('.checked-icon')!)
        .transform,
      'none'
    );

    const fade = await fixture<WsSwitch>(
      html`<ws-switch aria-label="Fade" icon-transition="fade"
        >${iconMarkup}</ws-switch
      >`
    );
    await fade.updateComplete;
    assert.equal(
      getComputedStyle(fade.shadowRoot!.querySelector('.checked-icon')!)
        .transform,
      'none'
    );
  });
});
