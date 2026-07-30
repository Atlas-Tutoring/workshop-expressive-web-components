import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

import '../components/badge/ws-badge.js';
import type {WsBadge} from '../components/badge/ws-badge.js';

suite('ws-badge', () => {
  test('renders slotted status text and reflects its tone', async () => {
    const el = await fixture<WsBadge>(
      html`<ws-badge tone="success">Healthy</ws-badge>`
    );
    assert.equal(el.tone, 'success');
    assert.equal(
      el.shadowRoot!.querySelector('slot')!.assignedNodes()[0].textContent,
      'Healthy'
    );
    assert.equal(
      el.shadowRoot!.querySelector('.badge')!.getAttribute('part'),
      'badge'
    );
  });
});
