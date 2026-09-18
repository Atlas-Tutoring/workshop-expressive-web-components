import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

import '../components/card/ws-card.js';
import type {WsCard} from '../components/card/ws-card.js';

suite('ws-card', () => {
  test('is defined', () => {
    const el = document.createElement('ws-card');
    assert.equal(el.localName, 'ws-card');
    assert.equal(customElements.get('ws-card'), el.constructor);
  });

  test('renders slotted content', async () => {
    const el = await fixture<WsCard>(html`
      <ws-card>
        <strong>Card Title</strong>
        <p>Card body content</p>
      </ws-card>
    `);

    assert.equal(el.querySelector('strong')!.textContent, 'Card Title');
    assert.equal(el.querySelector('p')!.textContent, 'Card body content');
    assert.exists(el.shadowRoot!.querySelector('slot'));
  });
});
