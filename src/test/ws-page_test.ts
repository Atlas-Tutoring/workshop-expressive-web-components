import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

import '../components/page/ws-page.js';
import type {WsPage} from '../components/page/ws-page.js';

suite('ws-page', () => {
  test('is defined', () => {
    const el = document.createElement('ws-page');
    assert.equal(el.localName, 'ws-page');
    assert.equal(customElements.get('ws-page'), el.constructor);
  });

  test('renders slotted content inside page container', async () => {
    const el = await fixture<WsPage>(html`
      <ws-page>
        <h1>Page Title</h1>
        <p>Page description</p>
      </ws-page>
    `);

    assert.equal(el.querySelector('h1')!.textContent, 'Page Title');
    assert.equal(el.querySelector('p')!.textContent, 'Page description');
    assert.exists(el.shadowRoot!.querySelector('slot'));
  });
});
