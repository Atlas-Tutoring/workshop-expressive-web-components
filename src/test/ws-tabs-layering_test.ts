import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

import '../components/tabs/ws-tab.js';
import '../components/tabs/ws-tabs.js';
import type {WsTab} from '../components/tabs/ws-tab.js';
import type {WsTabs} from '../components/tabs/ws-tabs.js';

suite('ws-tabs indicator layering', () => {
  test('keeps the standard indicator above tab hover surfaces', async () => {
    const el = await fixture<WsTabs>(html`
      <ws-tabs aria-label="Sections">
        <ws-tab selected href="#overview">Overview</ws-tab>
        <ws-tab href="#settings">Settings</ws-tab>
      </ws-tabs>
    `);
    const tab = el.querySelector<WsTab>('ws-tab')!;
    const indicator = el.shadowRoot!.querySelector<HTMLElement>('.indicator')!;

    await el.updateComplete;
    await tab.updateComplete;

    assert.isAbove(
      Number.parseInt(getComputedStyle(indicator).zIndex, 10),
      Number.parseInt(getComputedStyle(tab).zIndex, 10),
      'standard indicator must remain visible above a tab state layer'
    );
  });

  test('keeps the contained indicator behind tab content', async () => {
    const el = await fixture<WsTabs>(html`
      <ws-tabs variant="contained" value="details" aria-label="Content view">
        <ws-tab value="details">Details</ws-tab>
        <ws-tab value="raw">Raw</ws-tab>
      </ws-tabs>
    `);
    const tab = el.querySelector<WsTab>('ws-tab')!;
    const indicator = el.shadowRoot!.querySelector<HTMLElement>('.indicator')!;

    await el.updateComplete;
    await tab.updateComplete;

    assert.isBelow(
      Number.parseInt(getComputedStyle(indicator).zIndex, 10),
      Number.parseInt(getComputedStyle(tab).zIndex, 10),
      'contained indicator must stay behind the tab label and focus content'
    );
  });

  test('applies contained selected styles before hover', async () => {
    const el = await fixture<WsTabs>(html`
      <ws-tabs
        variant="contained"
        value="edit"
        aria-label="Markdown mode"
        style="--ws-tabs-contained-selected-color: rgb(1 2 3); --ws-color-primary: rgb(10 20 30)"
      >
        <ws-tab value="edit">Edit</ws-tab>
        <ws-tab value="preview">Preview</ws-tab>
      </ws-tabs>
    `);
    const edit = el.querySelector<WsTab>('ws-tab')!;

    await el.updateComplete;
    await edit.updateComplete;

    const control = edit.shadowRoot!.querySelector<HTMLElement>('.tab')!;
    assert.equal(getComputedStyle(edit).color, 'rgb(1, 2, 3)');
    assert.equal(getComputedStyle(control).backgroundColor, 'rgba(0, 0, 0, 0)');
  });

  test('derives contained selection colors from the active accent roles', async () => {
    const el = await fixture<WsTabs>(html`
      <ws-tabs
        variant="contained"
        value="edit"
        aria-label="Markdown mode"
        style="--ws-color-primary-container: rgb(11 22 33); --ws-color-on-primary-container: rgb(44 55 66); --ws-color-secondary-container: rgb(77 88 99); --ws-color-on-secondary-container: rgb(111 122 133)"
      >
        <ws-tab value="edit">Edit</ws-tab>
        <ws-tab value="preview">Preview</ws-tab>
      </ws-tabs>
    `);
    const edit = el.querySelector<WsTab>('ws-tab')!;
    const indicator = el.shadowRoot!.querySelector<HTMLElement>('.indicator')!;

    await el.updateComplete;
    await edit.updateComplete;

    assert.equal(getComputedStyle(indicator).backgroundColor, 'rgb(11, 22, 33)');
    assert.equal(getComputedStyle(edit).color, 'rgb(44, 55, 66)');
  });
});
