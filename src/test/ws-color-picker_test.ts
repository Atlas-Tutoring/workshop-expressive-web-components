import {fixture, assert, oneEvent} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

import '../components/color-picker/ws-color-picker.js';
import {
  WS_ACCENT_PRESETS,
  WS_DEFAULT_ACCENT,
  accentForeground,
  contrastRatio,
  normalizeHex,
} from '../components/color-picker/accent.js';
import type {
  WsAccentChangeDetail,
  WsColorPicker,
} from '../components/color-picker/ws-color-picker.js';

const swatches = (el: WsColorPicker) =>
  Array.from(el.shadowRoot!.querySelectorAll<HTMLButtonElement>('.swatch'));

suite('ws-color-picker', () => {
  teardown(() => {
    document.documentElement.style.removeProperty('--ws-accent');
    document.documentElement.style.removeProperty('--ws-accent-on');
  });

  test('is defined', () => {
    const el = document.createElement('ws-color-picker');
    assert.equal(el.localName, 'ws-color-picker');
    assert.equal(customElements.get('ws-color-picker'), el.constructor);
  });

  test('defaults to the purple accent', async () => {
    const el = await fixture<WsColorPicker>(
      html`<ws-color-picker apply="none"></ws-color-picker>`
    );

    assert.equal(el.value, WS_DEFAULT_ACCENT);
    assert.equal(el.value, '#7c5cff');
  });

  test('renders one radio per preset with the current one checked', async () => {
    const el = await fixture<WsColorPicker>(
      html`<ws-color-picker apply="none"></ws-color-picker>`
    );
    const buttons = swatches(el);

    assert.equal(buttons.length, WS_ACCENT_PRESETS.length);
    assert.equal(
      el.shadowRoot!.querySelector('.swatches')!.getAttribute('role'),
      'radiogroup'
    );
    assert.equal(buttons[0].getAttribute('aria-checked'), 'true');
    assert.equal(buttons[1].getAttribute('aria-checked'), 'false');
    assert.equal(buttons[0].getAttribute('aria-label'), 'Purple');
  });

  test('selecting a swatch updates the value and emits ws-accent-change', async () => {
    const el = await fixture<WsColorPicker>(
      html`<ws-color-picker apply="none"></ws-color-picker>`
    );
    const eventPromise = oneEvent(el, 'ws-accent-change');

    swatches(el)[2].click();
    const event = await eventPromise;
    const detail = event.detail as WsAccentChangeDetail;

    assert.equal(el.value, WS_ACCENT_PRESETS[2].value);
    assert.equal(detail.value, WS_ACCENT_PRESETS[2].value);
    assert.equal(detail.onColor, accentForeground(WS_ACCENT_PRESETS[2].value));
  });

  test('writes the accent custom properties to the document root', async () => {
    const el = await fixture<WsColorPicker>(
      html`<ws-color-picker></ws-color-picker>`
    );

    swatches(el)[5].click();
    await el.updateComplete;

    const root = document.documentElement.style;
    assert.equal(root.getPropertyValue('--ws-accent'), '#ffa62b');
    assert.equal(
      root.getPropertyValue('--ws-accent-on'),
      accentForeground('#ffa62b')
    );
  });

  test('apply="self" scopes the accent to the element', async () => {
    const el = await fixture<WsColorPicker>(
      html`<ws-color-picker apply="self"></ws-color-picker>`
    );

    swatches(el)[1].click();
    await el.updateComplete;

    assert.equal(el.style.getPropertyValue('--ws-accent'), '#4b5bff');
    assert.equal(
      document.documentElement.style.getPropertyValue('--ws-accent'),
      ''
    );
  });

  test('apply="none" leaves both the element and the root untouched', async () => {
    const el = await fixture<WsColorPicker>(
      html`<ws-color-picker apply="none"></ws-color-picker>`
    );

    swatches(el)[1].click();
    await el.updateComplete;

    assert.equal(el.style.getPropertyValue('--ws-accent'), '');
    assert.equal(
      document.documentElement.style.getPropertyValue('--ws-accent'),
      ''
    );
  });

  test('accepts a custom color from the native input', async () => {
    const el = await fixture<WsColorPicker>(
      html`<ws-color-picker apply="none"></ws-color-picker>`
    );
    const input =
      el.shadowRoot!.querySelector<HTMLInputElement>('.custom input')!;

    input.value = '#123456';
    input.dispatchEvent(new Event('input'));
    await el.updateComplete;

    assert.equal(el.value, '#123456');
    assert.isTrue(
      swatches(el).every(
        (swatch) => swatch.getAttribute('aria-checked') === 'false'
      )
    );
  });

  test('no-custom hides the custom color affordance', async () => {
    const el = await fixture<WsColorPicker>(
      html`<ws-color-picker apply="none" no-custom></ws-color-picker>`
    );

    assert.isNull(el.shadowRoot!.querySelector('.custom'));
  });

  test('arrow keys move between swatches and select', async () => {
    const el = await fixture<WsColorPicker>(
      html`<ws-color-picker apply="none"></ws-color-picker>`
    );

    swatches(el)[0].focus();
    swatches(el)[0].dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        bubbles: true,
        composed: true,
      })
    );
    await el.updateComplete;

    assert.equal(el.value, WS_ACCENT_PRESETS[1].value);
  });

  test('compact mode toggles a popover from its trigger', async () => {
    const el = await fixture<WsColorPicker>(
      html`<ws-color-picker apply="none" compact></ws-color-picker>`
    );
    const trigger =
      el.shadowRoot!.querySelector<HTMLButtonElement>('.trigger')!;
    const popover = () => el.shadowRoot!.querySelector('.popover')!;

    assert.equal(trigger.getAttribute('aria-expanded'), 'false');
    assert.isTrue(popover().hasAttribute('hidden'));

    trigger.click();
    await el.updateComplete;

    assert.equal(trigger.getAttribute('aria-expanded'), 'true');
    assert.isFalse(popover().hasAttribute('hidden'));

    swatches(el)[3].click();
    await el.updateComplete;

    assert.equal(el.value, WS_ACCENT_PRESETS[3].value);
    assert.isTrue(popover().hasAttribute('hidden'));
  });

  test('restores a stored accent and persists new selections', async () => {
    const key = 'ws-test-accent';
    localStorage.setItem(key, '#12b5a5');

    try {
      const el = await fixture<WsColorPicker>(
        html`<ws-color-picker
          apply="none"
          storage-key=${key}
        ></ws-color-picker>`
      );
      assert.equal(el.value, '#12b5a5');

      swatches(el)[6].click();
      await el.updateComplete;

      assert.equal(localStorage.getItem(key), WS_ACCENT_PRESETS[6].value);
    } finally {
      localStorage.removeItem(key);
    }
  });

  test('reset() returns to the default accent', async () => {
    const el = await fixture<WsColorPicker>(
      html`<ws-color-picker apply="none" value="#ff4d5e"></ws-color-picker>`
    );

    el.reset();
    await el.updateComplete;

    assert.equal(el.value, WS_DEFAULT_ACCENT);
  });
});

suite('accent utilities', () => {
  test('normalizeHex expands shorthand and rejects non-hex input', () => {
    assert.equal(normalizeHex('#ABC'), '#aabbcc');
    assert.equal(normalizeHex('  #7C5CFF '), '#7c5cff');
    assert.isNull(normalizeHex('rebeccapurple'));
    assert.isNull(normalizeHex('#12345'));
  });

  test('contrastRatio spans the full WCAG range', () => {
    assert.closeTo(contrastRatio('#000000', '#ffffff'), 21, 0.01);
    assert.closeTo(contrastRatio('#7c5cff', '#7c5cff'), 1, 0.01);
  });

  test('accentForeground picks the more readable foreground', () => {
    // Dark accents take light type, light accents take dark type.
    assert.equal(accentForeground('#7c5cff'), '#f7f7fa');
    assert.equal(accentForeground('#ffa62b'), '#17171c');
    assert.equal(accentForeground('#000000'), '#f7f7fa');
    assert.equal(accentForeground('#ffffff'), '#17171c');
  });

  test('every shipped preset reaches at least 3:1 against its foreground', () => {
    for (const preset of WS_ACCENT_PRESETS) {
      const ratio = contrastRatio(accentForeground(preset.value), preset.value);
      assert.isAtLeast(
        ratio,
        3,
        `${preset.name} (${preset.value}) contrast was ${ratio.toFixed(2)}`
      );
    }
  });
});

suite('ws-color-picker targeting', () => {
  test('target selector themes another element', async () => {
    const host = await fixture<HTMLElement>(html`
      <div>
        <div id="preview"></div>
        <ws-color-picker target="#preview"></ws-color-picker>
      </div>
    `);
    const picker = host.querySelector<WsColorPicker>('ws-color-picker')!;
    const preview = host.querySelector<HTMLElement>('#preview')!;

    picker
      .shadowRoot!.querySelectorAll<HTMLButtonElement>('.swatch')[4]
      .click();
    await picker.updateComplete;

    assert.equal(preview.style.getPropertyValue('--ws-accent'), '#19c98b');
    assert.equal(
      document.documentElement.style.getPropertyValue('--ws-accent'),
      ''
    );
  });

  test('retargeting releases the accent from the previous target', async () => {
    const host = await fixture<HTMLElement>(html`
      <div>
        <div id="first"></div>
        <div id="second"></div>
        <ws-color-picker target="#first"></ws-color-picker>
      </div>
    `);
    const picker = host.querySelector<WsColorPicker>('ws-color-picker')!;
    assert.equal(
      host
        .querySelector<HTMLElement>('#first')!
        .style.getPropertyValue('--ws-accent'),
      '#7c5cff'
    );

    picker.target = '#second';
    await picker.updateComplete;

    assert.equal(
      host
        .querySelector<HTMLElement>('#first')!
        .style.getPropertyValue('--ws-accent'),
      ''
    );
    assert.equal(
      host
        .querySelector<HTMLElement>('#second')!
        .style.getPropertyValue('--ws-accent'),
      '#7c5cff'
    );
  });

  test('apply="none" wins over a target selector', async () => {
    const host = await fixture<HTMLElement>(html`
      <div>
        <div id="preview"></div>
        <ws-color-picker apply="none" target="#preview"></ws-color-picker>
      </div>
    `);

    assert.equal(
      host
        .querySelector<HTMLElement>('#preview')!
        .style.getPropertyValue('--ws-accent'),
      ''
    );
  });
});

suite('ws-color-picker derived roles', () => {
  /**
   * Custom properties are substituted where they are declared, so a subtree
   * that only carries --ws-accent would still inherit the roles computed at
   * :root. These tests assert the resolved roles, not just the seed.
   */
  const primaryOf = (element: Element) =>
    getComputedStyle(element).getPropertyValue('--ws-color-primary').trim();

  test('a scoped target re-derives --ws-color-primary', async () => {
    const host = await fixture<HTMLElement>(html`
      <div>
        <div id="preview"><span id="child"></span></div>
        <ws-color-picker target="#preview"></ws-color-picker>
      </div>
    `);
    const picker = host.querySelector<WsColorPicker>('ws-color-picker')!;
    const preview = host.querySelector<HTMLElement>('#preview')!;
    const child = host.querySelector<HTMLElement>('#child')!;

    picker
      .shadowRoot!.querySelectorAll<HTMLButtonElement>('.swatch')[5]
      .click();
    await picker.updateComplete;

    assert.isTrue(preview.hasAttribute('data-ws-accent-scope'));
    assert.equal(primaryOf(preview), '#ffa62b');
    // Descendants inherit the re-derived role.
    assert.equal(primaryOf(child), '#ffa62b');
    // The rest of the document is untouched.
    assert.notEqual(primaryOf(document.body), '#ffa62b');
  });

  test('retargeting removes the scope attribute from the old target', async () => {
    const host = await fixture<HTMLElement>(html`
      <div>
        <div id="first"></div>
        <div id="second"></div>
        <ws-color-picker target="#first"></ws-color-picker>
      </div>
    `);
    const picker = host.querySelector<WsColorPicker>('ws-color-picker')!;

    picker.target = '#second';
    await picker.updateComplete;

    assert.isFalse(
      host
        .querySelector<HTMLElement>('#first')!
        .hasAttribute('data-ws-accent-scope')
    );
    assert.isTrue(
      host
        .querySelector<HTMLElement>('#second')!
        .hasAttribute('data-ws-accent-scope')
    );
  });

  test('the document root is themed without a scope attribute', async () => {
    const el = await fixture<WsColorPicker>(
      html`<ws-color-picker></ws-color-picker>`
    );

    el.shadowRoot!.querySelectorAll<HTMLButtonElement>('.swatch')[2].click();
    await el.updateComplete;

    assert.isFalse(
      document.documentElement.hasAttribute('data-ws-accent-scope')
    );
    assert.equal(primaryOf(document.documentElement), '#2f80ff');
  });
});
