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
});
