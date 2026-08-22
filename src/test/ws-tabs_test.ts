import {fixture, assert, oneEvent, waitUntil} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

import '../components/tabs/ws-tab.js';
import '../components/tabs/ws-tab-panel.js';
import '../components/tabs/ws-tabs.js';
import type {WsTab} from '../components/tabs/ws-tab.js';
import type {WsTabPanel} from '../components/tabs/ws-tab-panel.js';
import type {WsTabs} from '../components/tabs/ws-tabs.js';

const nextFrame = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });

const waitForMeasuredIndicator = (el: WsTabs) =>
  waitUntil(
    () => el.style.getPropertyValue('--ws-tabs-indicator-opacity') === '1',
    'indicator was not measured',
    {timeout: 5000}
  );

suite('ws-tabs', () => {
  test('renders slotted tabs inside the tablist', async () => {
    const el = await fixture<WsTabs>(html`
      <ws-tabs>
        <ws-tab href="/" selected>Home</ws-tab>
        <ws-tab href="/api/">API</ws-tab>
      </ws-tabs>
    `);

    assert.equal(
      el.shadowRoot!.querySelector('[role="tablist"]')!.getAttribute('part'),
      'tabs'
    );
    assert.lengthOf(el.querySelectorAll('ws-tab'), 2);
  });

  test('keeps anchor navigation semantics while forwarding selected state', async () => {
    const el = await fixture<WsTab>(html`
      <ws-tab href="/api/" selected>API</ws-tab>
    `);
    const anchor = el.shadowRoot!.querySelector<HTMLAnchorElement>('a')!;

    assert.equal(anchor.getAttribute('href'), '/api/');
    assert.equal(anchor.getAttribute('aria-selected'), 'true');
    assert.equal(anchor.getAttribute('aria-current'), 'page');
    assert.equal(anchor.getAttribute('role'), 'tab');
  });

  test('omits current semantics when a navigation tab is not selected', async () => {
    const el = await fixture<WsTab>(html`
      <ws-tab href="/examples/">Examples</ws-tab>
    `);
    const anchor = el.shadowRoot!.querySelector<HTMLAnchorElement>('a')!;

    assert.equal(anchor.getAttribute('href'), '/examples/');
    assert.equal(anchor.getAttribute('aria-selected'), 'false');
    assert.isFalse(anchor.hasAttribute('aria-current'));
  });

  test('renders value-driven tabs as buttons', async () => {
    const el = await fixture<WsTab>(html`
      <ws-tab value="preview" selected>Preview</ws-tab>
    `);
    const button = el.shadowRoot!.querySelector<HTMLButtonElement>('button')!;

    assert.exists(button);
    assert.equal(button.getAttribute('role'), 'tab');
    assert.equal(button.getAttribute('aria-selected'), 'true');
    assert.equal(button.tabIndex, 0);
    assert.notExists(el.shadowRoot!.querySelector('a'));
  });

  test('supports contained view tabs and synchronizes panels', async () => {
    const el = await fixture<WsTabs>(html`
      <ws-tabs variant="contained" value="edit" aria-label="Markdown mode">
        <ws-tab value="edit">Edit</ws-tab>
        <ws-tab value="preview">Preview</ws-tab>
        <ws-tab-panel value="edit">Editor</ws-tab-panel>
        <ws-tab-panel value="preview">Rendered markdown</ws-tab-panel>
      </ws-tabs>
    `);
    await el.updateComplete;

    const [edit, preview] = Array.from(el.querySelectorAll<WsTab>('ws-tab'));
    const [editPanel, previewPanel] = Array.from(
      el.querySelectorAll<WsTabPanel>('ws-tab-panel')
    );
    await edit.updateComplete;
    await preview.updateComplete;
    await editPanel.updateComplete;
    await previewPanel.updateComplete;

    assert.equal(el.variant, 'contained');
    assert.equal(el.value, 'edit');
    assert.isTrue(edit.selected);
    assert.isFalse(preview.selected);
    assert.isTrue(editPanel.active);
    assert.isFalse(previewPanel.active);
    assert.isFalse(editPanel.hidden);
    assert.isTrue(previewPanel.hidden);
    assert.equal(editPanel.slot, 'panel');
    assert.equal(
      edit.shadowRoot!.querySelector('button')!.getAttribute('aria-controls'),
      editPanel.id
    );
    assert.equal(editPanel.getAttribute('aria-label'), 'Edit');
    const editControl = edit.shadowRoot!.querySelector('button')!;
    const editStyles = getComputedStyle(editControl);
    assert.equal(
      editStyles.getPropertyValue('--ws-tab-hover-background').trim(),
      'transparent'
    );
    assert.equal(
      editStyles.getPropertyValue('--ws-tab-hover-color').trim(),
      'inherit'
    );
  });

  test('updates contained tabs when value changes programmatically', async () => {
    const el = await fixture<WsTabs>(html`
      <ws-tabs value="edit">
        <ws-tab value="edit">Edit</ws-tab>
        <ws-tab value="preview">Preview</ws-tab>
        <ws-tab-panel value="edit">Editor</ws-tab-panel>
        <ws-tab-panel value="preview">Preview body</ws-tab-panel>
      </ws-tabs>
    `);
    const preview = el.querySelectorAll<WsTab>('ws-tab')[1];
    const previewPanel = el.querySelectorAll<WsTabPanel>('ws-tab-panel')[1];

    el.value = 'preview';
    await el.updateComplete;
    await preview.updateComplete;
    await previewPanel.updateComplete;

    assert.isTrue(preview.selected);
    assert.isTrue(previewPanel.active);
    assert.isFalse(previewPanel.hidden);
  });

  test('switches panel tabs with arrow keys and emits the selected value', async () => {
    const el = await fixture<WsTabs>(html`
      <ws-tabs value="edit">
        <ws-tab value="edit">Edit</ws-tab>
        <ws-tab value="preview">Preview</ws-tab>
      </ws-tabs>
    `);
    const [edit, preview] = Array.from(el.querySelectorAll<WsTab>('ws-tab'));
    await edit.updateComplete;
    await preview.updateComplete;
    const changed = oneEvent(el, 'ws-tab-change');

    edit.shadowRoot!.querySelector('button')!.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        bubbles: true,
        composed: true,
      })
    );

    const event = (await changed) as CustomEvent<{value: string}>;
    await preview.updateComplete;
    assert.isTrue(preview.selected);
    assert.equal(el.value, 'preview');
    assert.equal(event.detail.value, 'preview');
  });

  test('reflects vertical orientation to the tablist', async () => {
    const el = await fixture<WsTabs>(html`
      <ws-tabs orientation="vertical" aria-label="Components">
        <ws-tab href="/examples/" selected>Buttons</ws-tab>
      </ws-tabs>
    `);
    const tablist = el.shadowRoot!.querySelector('[role="tablist"]')!;

    assert.equal(tablist.getAttribute('aria-orientation'), 'vertical');
  });

  test('selects a clicked tab and clears sibling selection', async () => {
    const el = await fixture<WsTabs>(html`
      <ws-tabs>
        <ws-tab href="#overview" selected>Overview</ws-tab>
        <ws-tab href="#settings">Settings</ws-tab>
      </ws-tabs>
    `);
    const [overview, settings] = Array.from(
      el.querySelectorAll<WsTab>('ws-tab')
    );
    const settingsAnchor =
      settings.shadowRoot!.querySelector<HTMLAnchorElement>('a')!;

    settingsAnchor.click();
    await el.updateComplete;
    await overview.updateComplete;
    await settings.updateComplete;

    assert.isFalse(overview.selected);
    assert.isTrue(settings.selected);
  });

  test('only animates the indicator after a user selection change', async () => {
    const el = await fixture<WsTabs>(html`
      <ws-tabs>
        <ws-tab href="#overview" selected>Overview</ws-tab>
        <ws-tab href="#settings">Settings</ws-tab>
      </ws-tabs>
    `);
    const settings = el.querySelectorAll<WsTab>('ws-tab')[1];
    const settingsAnchor =
      settings.shadowRoot!.querySelector<HTMLAnchorElement>('a')!;

    await waitForMeasuredIndicator(el);
    assert.isFalse(el.hasAttribute('indicator-animated'));

    settingsAnchor.click();
    await waitUntil(() => el.hasAttribute('indicator-animated'));

    assert.isTrue(el.hasAttribute('indicator-animated'));
  });

  test('animates the indicator when selected state changes externally', async () => {
    const el = await fixture<WsTabs>(html`
      <ws-tabs>
        <ws-tab href="#overview" selected>Overview</ws-tab>
        <ws-tab href="#settings">Settings</ws-tab>
      </ws-tabs>
    `);
    const [overview, settings] = Array.from(
      el.querySelectorAll<WsTab>('ws-tab')
    );

    await waitForMeasuredIndicator(el);
    assert.isFalse(el.hasAttribute('indicator-animated'));

    overview.selected = false;
    settings.selected = true;
    await overview.updateComplete;
    await settings.updateComplete;
    await waitUntil(() => el.hasAttribute('indicator-animated'));

    assert.isTrue(el.hasAttribute('indicator-animated'));
  });

  test('runs a real contained indicator animation in light theme', async () => {
    const root = document.documentElement;
    const previousTheme = root.getAttribute('data-ws-theme');
    root.setAttribute('data-ws-theme', 'light');

    try {
      const el = await fixture<WsTabs>(html`
        <ws-tabs variant="contained" value="edit">
          <ws-tab value="edit">Edit</ws-tab>
          <ws-tab value="preview">Longer preview</ws-tab>
        </ws-tabs>
      `);
      const preview = el.querySelectorAll<WsTab>('ws-tab')[1];
      const previewButton =
        preview.shadowRoot!.querySelector<HTMLButtonElement>('button')!;
      const indicator =
        el.shadowRoot!.querySelector<HTMLElement>('.indicator')!;

      await waitForMeasuredIndicator(el);
      previewButton.click();

      await waitUntil(
        () => indicator.getAnimations().length > 0,
        'contained indicator did not start a browser animation in light theme'
      );

      const [animation] = indicator.getAnimations();
      const frames = (animation.effect as KeyframeEffect).getKeyframes();
      assert.lengthOf(frames, 2);
      assert.notEqual(frames[0].transform, frames[1].transform);
      assert.notEqual(frames[0].inlineSize, frames[1].inlineSize);
    } finally {
      if (previousTheme === null) root.removeAttribute('data-ws-theme');
      else root.setAttribute('data-ws-theme', previousTheme);
    }
  });

  test('does not animate while repositioning for orientation changes', async () => {
    const el = await fixture<WsTabs>(html`
      <ws-tabs>
        <ws-tab href="#overview" selected>Overview</ws-tab>
        <ws-tab href="#settings">Settings</ws-tab>
      </ws-tabs>
    `);

    await nextFrame();
    el.removeAttribute('indicator-animated');
    el.orientation = 'vertical';
    await el.updateComplete;
    await nextFrame();

    assert.isFalse(el.hasAttribute('indicator-animated'));
    assert.equal(el.getAttribute('orientation'), 'vertical');
  });

  test('ignores clicked tabs that do not belong to the current group', async () => {
    const el = await fixture<WsTabs>(html`
      <ws-tabs>
        <ws-tab href="#outer" selected>Outer</ws-tab>
        <div>
          <ws-tabs>
            <ws-tab href="#inner" selected>Inner</ws-tab>
            <ws-tab href="#inner-two">Inner two</ws-tab>
          </ws-tabs>
        </div>
      </ws-tabs>
    `);
    const outer = el.querySelector<WsTab>('ws-tab')!;
    const nestedSecond = el.querySelectorAll<WsTab>('ws-tab')[2];
    const nestedAnchor =
      nestedSecond.shadowRoot!.querySelector<HTMLAnchorElement>('a')!;

    nestedAnchor.click();
    await el.updateComplete;
    await outer.updateComplete;
    await nestedSecond.updateComplete;

    assert.isTrue(outer.selected);
    assert.isTrue(nestedSecond.selected);
  });
});
